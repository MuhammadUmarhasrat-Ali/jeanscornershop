const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const PORT = 5500;
const ROOT_DIR = __dirname;
const DB_FILE = path.join(ROOT_DIR, 'data', 'store_db.json');
const UPLOAD_DIR = path.join(ROOT_DIR, 'assets', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4'
};

// In-memory active admin sessions
const activeSessions = new Map();

function getDb() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    console.error('Error reading DB_FILE:', err);
    return {};
  }
}

function saveDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    // Also update assets/js/data.js so storefront always has direct fallback
    const jsContent = `// JEANSCORNER Product Catalog & Storefront Data (Synchronized with Admin DB)\nconst GENSCORNAR_DATA = ${JSON.stringify(data, null, 2)};\n\nif (typeof window !== 'undefined') {\n  window.GENSCORNAR_DATA = GENSCORNAR_DATA;\n}\n`;
    fs.writeFileSync(path.join(ROOT_DIR, 'assets', 'js', 'data.js'), jsContent, 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving DB:', err);
    return false;
  }
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 50 * 1024 * 1024) { // 50MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function checkAdminAuth(req) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (token && activeSessions.has(token)) {
    const session = activeSessions.get(token);
    // 24 hour expiry
    if (Date.now() - session.createdAt < 24 * 60 * 60 * 1000) {
      return session;
    } else {
      activeSessions.delete(token);
    }
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  // CORS & No-Cache headers so changes reflect instantly
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURI(parsedUrl.pathname);

  // ==========================================
  // API ENDPOINTS FOR STOREFRONT & ADMIN DASHBOARD
  // ==========================================

  // 1. GET /api/data (Storefront & Admin data fetch)
  if (pathname === '/api/data' && req.method === 'GET') {
    const db = getDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db));
    return;
  }

  // 2. POST /api/admin/login
  if (pathname === '/api/admin/login' && req.method === 'POST') {
    try {
      const { username, password } = await parseJsonBody(req);
      const db = getDb();
      if (
        (username === 'admin' || username === 'admin@jeanscorner.com') &&
        (password === 'jeanscorner2026' || password === 'admin123')
      ) {
        const token = crypto.randomBytes(32).toString('hex');
        const session = {
          token,
          user: {
            username: 'admin',
            name: db.admin?.name || 'Administrator',
            role: 'Super Admin',
            email: 'admin@jeanscorner.com'
          },
          createdAt: Date.now()
        };
        activeSessions.set(token, session);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, token, user: session.user }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid admin credentials' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 3. GET /api/admin/me
  if (pathname === '/api/admin/me' && req.method === 'GET') {
    const session = checkAdminAuth(req);
    if (!session) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ authenticated: false }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ authenticated: true, user: session.user }));
    return;
  }

  // 4. POST /api/admin/logout
  if (pathname === '/api/admin/logout' && req.method === 'POST') {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (token) activeSessions.delete(token);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // 5. POST /api/admin/upload (Base64 file upload)
  if (pathname === '/api/admin/upload' && req.method === 'POST') {
    if (!checkAdminAuth(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    try {
      const { filename, base64Data } = await parseJsonBody(req);
      if (!base64Data) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'No image data provided' }));
        return;
      }
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer, ext = '.jpg';
      if (matches && matches.length === 3) {
        buffer = Buffer.from(matches[2], 'base64');
        const mime = matches[1];
        if (mime.includes('png')) ext = '.png';
        else if (mime.includes('webp')) ext = '.webp';
        else if (mime.includes('gif')) ext = '.gif';
      } else {
        buffer = Buffer.from(base64Data, 'base64');
      }

      const cleanName = (filename || 'product').replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueName = `upload_${Date.now()}_${cleanName}${ext}`;
      const filePath = path.join(UPLOAD_DIR, uniqueName);
      fs.writeFileSync(filePath, buffer);

      const relativeUrl = `assets/uploads/${uniqueName}`;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, url: relativeUrl, filename: uniqueName, size: buffer.length }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 6. POST /api/admin/products (Add product)
  if (pathname === '/api/admin/products' && req.method === 'POST') {
    if (!checkAdminAuth(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    try {
      const product = await parseJsonBody(req);
      const db = getDb();
      if (!product.id) {
        product.id = 'prod_' + Date.now();
      }
      if (!product.handle) {
        product.handle = (product.title || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      product.createdAt = new Date().toISOString();
      db.products.unshift(product);

      // Log activity
      if (!db.activityLogs) db.activityLogs = [];
      db.activityLogs.unshift({
        type: 'product',
        title: `New product added: ${product.title}`,
        time: 'Just now',
        icon: 'shirt'
      });

      saveDb(db);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, product }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 7. PUT /api/admin/products/:id (Update product)
  if (pathname.startsWith('/api/admin/products/') && req.method === 'PUT') {
    if (!checkAdminAuth(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    try {
      const prodId = pathname.replace('/api/admin/products/', '');
      const updatedFields = await parseJsonBody(req);
      const db = getDb();
      const idx = db.products.findIndex(p => p.id === prodId);
      if (idx === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Product not found' }));
        return;
      }
      db.products[idx] = { ...db.products[idx], ...updatedFields };

      if (!db.activityLogs) db.activityLogs = [];
      db.activityLogs.unshift({
        type: 'product',
        title: `Product updated: ${db.products[idx].title}`,
        time: 'Just now',
        icon: 'shirt'
      });

      saveDb(db);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, product: db.products[idx] }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 8. DELETE /api/admin/products/:id (Delete product)
  if (pathname.startsWith('/api/admin/products/') && req.method === 'DELETE') {
    if (!checkAdminAuth(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    try {
      const prodId = pathname.replace('/api/admin/products/', '');
      const db = getDb();
      const existing = db.products.find(p => p.id === prodId);
      db.products = db.products.filter(p => p.id !== prodId);

      if (!db.activityLogs) db.activityLogs = [];
      db.activityLogs.unshift({
        type: 'product',
        title: `Product deleted: ${existing ? existing.title : prodId}`,
        time: 'Just now',
        icon: 'trash'
      });

      saveDb(db);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 9. BANNERS CRUD: /api/admin/banners
  if (pathname === '/api/admin/banners' && req.method === 'POST') {
    if (!checkAdminAuth(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    try {
      const banner = await parseJsonBody(req);
      const db = getDb();
      if (!banner.id) banner.id = 'banner_' + Date.now();
      if (!db.banners) db.banners = [];
      db.banners.unshift(banner);

      if (!db.activityLogs) db.activityLogs = [];
      db.activityLogs.unshift({
        type: 'banner',
        title: `New promotional banner created: ${banner.title}`,
        time: 'Just now',
        icon: 'image'
      });

      saveDb(db);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, banner }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname.startsWith('/api/admin/banners/') && req.method === 'DELETE') {
    if (!checkAdminAuth(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    try {
      const bannerId = pathname.replace('/api/admin/banners/', '');
      const db = getDb();
      if (!db.banners) db.banners = [];
      db.banners = db.banners.filter(b => b.id !== bannerId);
      saveDb(db);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 10. CATEGORIES CRUD: /api/admin/categories
  if (pathname === '/api/admin/categories' && req.method === 'POST') {
    if (!checkAdminAuth(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    try {
      const catData = await parseJsonBody(req);
      const db = getDb();
      if (!db.categories) db.categories = [];

      const rawId = (catData.id || catData.title || 'cat_' + Date.now()).toLowerCase().trim();
      const slug = rawId.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

      let subcats = [];
      if (Array.isArray(catData.subcategories)) {
        subcats = catData.subcategories.map(s => String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')).filter(Boolean);
      } else if (typeof catData.subcategories === 'string') {
        subcats = catData.subcategories.split(',').map(s => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')).filter(Boolean);
      }

      const newCat = {
        id: slug,
        title: catData.title || 'New Category',
        subtitle: catData.subtitle || 'Exclusive Collection',
        description: catData.description || 'Premium menswear crafted with perfection.',
        image: catData.image || 'assets/categories/cat_shirts.jpg',
        banner: catData.banner || 'assets/banners/banner_shirts.jpg',
        badge: catData.badge || 'New',
        featured: catData.featured !== undefined ? !!catData.featured : true,
        subcategories: [...new Set(subcats)]
      };

      const existingIdx = db.categories.findIndex(c => c.id === slug);
      if (existingIdx !== -1) {
        db.categories[existingIdx] = { ...db.categories[existingIdx], ...newCat };
      } else {
        db.categories.push(newCat);
      }

      if (!db.activityLogs) db.activityLogs = [];
      db.activityLogs.unshift({
        id: 'act_' + Date.now(),
        type: 'category_created',
        message: `Category "${newCat.title}" created with ${newCat.subcategories.length} subcategories`,
        timestamp: new Date().toISOString()
      });

      saveDb(db);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, category: newCat }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Quick Add Subcategory: POST /api/admin/categories/:id/subcategories
  if (pathname.startsWith('/api/admin/categories/') && pathname.endsWith('/subcategories') && req.method === 'POST') {
    if (!checkAdminAuth(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    try {
      const catId = pathname.replace('/api/admin/categories/', '').replace('/subcategories', '');
      const { subcategory } = await parseJsonBody(req);
      const db = getDb();
      const idx = db.categories.findIndex(c => c.id === catId);
      if (idx !== -1) {
        if (!Array.isArray(db.categories[idx].subcategories)) {
          db.categories[idx].subcategories = [];
        }
        const cleanSub = String(subcategory || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
        if (cleanSub && !db.categories[idx].subcategories.includes(cleanSub)) {
          db.categories[idx].subcategories.push(cleanSub);
          saveDb(db);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, subcategories: db.categories[idx].subcategories }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Category not found' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Update Category: PUT /api/admin/categories/:id
  if (pathname.startsWith('/api/admin/categories/') && req.method === 'PUT') {
    if (!checkAdminAuth(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    try {
      const catId = pathname.replace('/api/admin/categories/', '');
      const fields = await parseJsonBody(req);
      const db = getDb();
      const idx = db.categories.findIndex(c => c.id === catId);
      if (idx !== -1) {
        if (fields.subcategories) {
          if (typeof fields.subcategories === 'string') {
            fields.subcategories = fields.subcategories.split(',').map(s => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')).filter(Boolean);
          } else if (Array.isArray(fields.subcategories)) {
            fields.subcategories = fields.subcategories.map(s => String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')).filter(Boolean);
          }
        }
        db.categories[idx] = { ...db.categories[idx], ...fields };
        saveDb(db);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, category: db.categories[idx] }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Category not found' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Delete Category: DELETE /api/admin/categories/:id
  if (pathname.startsWith('/api/admin/categories/') && req.method === 'DELETE') {
    if (!checkAdminAuth(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    try {
      const catId = pathname.replace('/api/admin/categories/', '');
      const db = getDb();
      if (!db.categories) db.categories = [];
      const cat = db.categories.find(c => c.id === catId);
      db.categories = db.categories.filter(c => c.id !== catId);

      if (!db.activityLogs) db.activityLogs = [];
      db.activityLogs.unshift({
        id: 'act_' + Date.now(),
        type: 'category_deleted',
        message: `Category "${cat ? cat.title : catId}" deleted`,
        timestamp: new Date().toISOString()
      });

      saveDb(db);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 11. ORDERS UPDATE: /api/admin/orders/:id
  if (pathname.startsWith('/api/admin/orders/') && req.method === 'PUT') {
    if (!checkAdminAuth(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    try {
      const orderId = pathname.replace('/api/admin/orders/', '');
      const fields = await parseJsonBody(req);
      const db = getDb();
      if (!db.orders) db.orders = [];
      const idx = db.orders.findIndex(o => o.id === orderId);
      if (idx !== -1) {
        const oldStatus = db.orders[idx].status || db.orders[idx].fulfillmentStatus;
        const newStatus = fields.status || fields.fulfillmentStatus;

        // Auto-restore stock if order is cancelled
        if (oldStatus !== 'cancelled' && oldStatus !== 'Cancelled' && (newStatus === 'cancelled' || newStatus === 'Cancelled')) {
          if (Array.isArray(db.orders[idx].items) && Array.isArray(db.products)) {
            db.orders[idx].items.forEach(item => {
              const prod = db.products.find(p => p.id === item.id || p.handle === item.handle);
              if (prod && typeof prod.stock === 'number') {
                const qty = item.qty || item.quantity || 1;
                prod.stock += qty;
              }
            });
          }
        }

        db.orders[idx] = { ...db.orders[idx], ...fields };
        saveDb(db);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, order: db.orders[idx] }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Order not found' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 12. PUBLIC ORDER CREATION: POST /api/orders
  if (pathname === '/api/orders' && req.method === 'POST') {
    try {
      const orderData = await parseJsonBody(req);
      const db = getDb();
      if (!db.orders) db.orders = [];
      if (!db.products) db.products = [];

      const newId = '#JC-' + Math.floor(10000 + Math.random() * 90000);
      const customerFullName = orderData.customerName || `${orderData.firstName || ''} ${orderData.lastName || ''}`.trim() || 'Valued Client';
      const formattedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

      let paymentLabel = 'Cash on Delivery';
      if (orderData.paymentMethod === 'whatsapp') paymentLabel = 'WhatsApp Order';
      else if (orderData.paymentMethod === 'upi') paymentLabel = 'UPI / QR';
      else if (orderData.paymentMethod === 'card') paymentLabel = 'Credit/Debit Card';

      const customerPhone = orderData.phone || orderData.customerPhone || '';
      const customerEmail = orderData.customerEmail || orderData.email || '';
      const customerAddress = orderData.shippingAddress || orderData.address || `${orderData.street || ''}, ${orderData.city || ''} ${orderData.postalCode || orderData.postal || ''}`.trim();

      const newOrder = {
        id: newId,
        date: formattedDate,
        createdAt: new Date().toISOString(),
        customerName: customerFullName,
        phone: customerPhone,
        customerPhone: customerPhone,
        email: customerEmail,
        customerEmail: customerEmail,
        shippingAddress: customerAddress,
        customerAddress: customerAddress,
        city: orderData.city || 'Solapur',
        postalCode: orderData.postalCode || orderData.postal || '413001',
        items: Array.isArray(orderData.items) ? orderData.items : [],
        paymentMethod: orderData.paymentMethod || 'cod',
        paymentStatus: paymentLabel,
        fulfillmentStatus: 'Placed',
        status: 'placed',
        subtotal: Number(orderData.subtotal) || 0,
        deliveryFee: Number(orderData.deliveryFee) || 0,
        total: Number(orderData.total) || 0,
        notes: orderData.notes || ''
      };

      // Auto-deduct stock for each ordered item
      if (Array.isArray(newOrder.items)) {
        newOrder.items.forEach(item => {
          const prod = db.products.find(p => p.id === item.id || p.handle === item.handle);
          if (prod && typeof prod.stock === 'number') {
            const qty = item.qty || item.quantity || 1;
            prod.stock = Math.max(0, prod.stock - qty);
          }
        });
      }

      // Add to front of orders list (newest first)
      db.orders.unshift(newOrder);

      // Log activity
      if (!db.activityLogs) db.activityLogs = [];
      db.activityLogs.unshift({
        id: 'log_' + Date.now(),
        type: 'order_created',
        message: `New order ${newId} placed by ${customerFullName} (${paymentLabel}) for ₹${newOrder.total}`,
        timestamp: new Date().toISOString()
      });

      saveDb(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, order: newOrder }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ==========================================
  // STATIC FILE SERVING WITH RANGE SUPPORT
  // ==========================================
  let reqUrl = pathname;
  if (reqUrl === '/' || reqUrl === '') {
    reqUrl = '/index.html';
  } else if (reqUrl === '/admin' || reqUrl === '/admin/') {
    reqUrl = '/admin.html';
  }

  const safePath = path.normalize(path.join(ROOT_DIR, reqUrl));

  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<h1>404 Not Found</h1><p>${reqUrl} does not exist.</p>`);
      return;
    }

    let filePathToServe = safePath;
    if (stats.isDirectory()) {
      filePathToServe = path.join(safePath, 'index.html');
    }

    const ext = path.extname(filePathToServe).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const totalSize = stats.size;

    // HTTP Range requests for video/media streaming
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
      const chunkSize = (end - start) + 1;
      const fileStream = fs.createReadStream(filePathToServe, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType
      });
      fileStream.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Length': totalSize,
      'Accept-Ranges': 'bytes',
      'Content-Type': contentType
    });
    fs.createReadStream(filePathToServe).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`JEANSCORNER Luxury Store & Admin Server is running!`);
  console.log(`Storefront: http://127.0.0.1:${PORT}`);
  console.log(`Admin URL:  http://127.0.0.1:${PORT}/admin.html`);
  
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`Network access: http://${iface.address}:${PORT}`);
      }
    }
  }
});
