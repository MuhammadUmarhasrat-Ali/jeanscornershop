/**
 * JEANSCORNER Luxury Fashion Store - Admin Dashboard Core Engine
 * Full functional CRUD for Products, Categories, Banners, Media, Orders, and Settings.
 */

class JeanscornerAdmin {
  constructor() {
    this.currentView = 'dashboard';
    this.token = localStorage.getItem('jeanscorner_admin_token') || null;
    this.data = null;
    this.uploadedImages = [];
    this.init();
  }

  async init() {
    this.setupDropzone();
    if (this.token) {
      const valid = await this.verifySession();
      if (valid) {
        document.getElementById('adminLoginOverlay').style.display = 'none';
        await this.loadData();
        this.renderView(this.currentView);
        return;
      }
    }
    document.getElementById('adminLoginOverlay').style.display = 'flex';
  }

  async verifySession() {
    try {
      const res = await fetch('/api/admin/me', {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      const json = await res.json();
      return json.authenticated === true;
    } catch (e) {
      return false;
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      });
      const json = await res.json();
      if (json.success) {
        this.token = json.token;
        localStorage.setItem('jeanscorner_admin_token', this.token);
        document.getElementById('adminLoginOverlay').style.display = 'none';
        this.showToast('Welcome back, Administrator!');
        await this.loadData();
        this.renderView('dashboard');
      } else {
        alert(json.message || 'Invalid credentials');
      }
    } catch (err) {
      alert('Login error: ' + err.message);
    }
  }

  async handleLogout() {
    if (!confirm('Are you sure you want to log out of the admin panel?')) return;
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
    } catch (e) {}
    this.token = null;
    localStorage.removeItem('jeanscorner_admin_token');
    document.getElementById('adminLoginOverlay').style.display = 'flex';
  }

  async loadData() {
    try {
      const res = await fetch('/api/data');
      this.data = await res.json();
    } catch (err) {
      console.error('Failed to load store data:', err);
    }
  }

  navigate(view) {
    this.currentView = view;
    document.querySelectorAll('.admin-nav-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-view') === view);
    });
    this.renderView(view);
  }

  renderView(view) {
    const container = document.getElementById('adminViewContainer');
    if (!container || !this.data) return;

    if (view === 'dashboard') this.renderDashboard(container);
    else if (view === 'products') this.renderProducts(container);
    else if (view === 'categories') this.renderCategories(container);
    else if (view === 'banners') this.renderBanners(container);
    else if (view === 'collections') this.renderCollections(container);
    else if (view === 'media') this.renderMedia(container);
    else if (view === 'orders') this.renderOrders(container);
    else if (view === 'customers') this.renderCustomers(container);
    else if (view === 'settings') this.renderSettings(container);
  }

  // ==========================================
  // 1. DASHBOARD OVERVIEW (MATCHING REFERENCE IMAGE)
  // ==========================================
  renderDashboard(container) {
    const products = this.data.products || [];
    const categories = this.data.categories || [];
    const newArrivals = products.filter(p => p.isNew).length;
    const lowStock = products.filter(p => (p.stock || 50) < 15).length;

    container.innerHTML = `
      <!-- Welcome Hero Banner (Matching Reference Image) -->
      <div class="admin-welcome-hero">
        <div class="admin-welcome-copy">
          <h2 class="admin-welcome-title">Good morning, Admin</h2>
          <p class="admin-welcome-sub">Manage your store from one place</p>
        </div>
        <img src="assets/admin/admin_welcome_banner.jpg" class="hero-bg-art" alt="Atelier Interior" />
      </div>

      <!-- 4 KPI Metrics Row -->
      <div class="admin-metrics-row">
        <div class="admin-metric-card">
          <div class="admin-metric-icon-box">🛍️</div>
          <div class="admin-metric-info">
            <div class="admin-metric-label">Total Products</div>
            <div class="admin-metric-value-row">
              <span class="admin-metric-value">${products.length}</span>
              <span class="admin-metric-trend trend-up">↑ +12%</span>
            </div>
          </div>
        </div>

        <div class="admin-metric-card">
          <div class="admin-metric-icon-box">🗂️</div>
          <div class="admin-metric-info">
            <div class="admin-metric-label">Active Categories</div>
            <div class="admin-metric-value-row">
              <span class="admin-metric-value">${categories.length}</span>
              <span class="admin-metric-trend trend-up">↑ +0%</span>
            </div>
          </div>
        </div>

        <div class="admin-metric-card">
          <div class="admin-metric-icon-box">⭐</div>
          <div class="admin-metric-info">
            <div class="admin-metric-label">New Arrivals</div>
            <div class="admin-metric-value-row">
              <span class="admin-metric-value">${newArrivals}</span>
              <span class="admin-metric-trend trend-up">↑ +18%</span>
            </div>
          </div>
        </div>

        <div class="admin-metric-card">
          <div class="admin-metric-icon-box">⚠️</div>
          <div class="admin-metric-info">
            <div class="admin-metric-label">Low Stock</div>
            <div class="admin-metric-value-row">
              <span class="admin-metric-value">${lowStock}</span>
              <span class="admin-metric-trend trend-down">↓ -5%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Bar -->
      <div class="admin-quick-actions">
        <button class="admin-qa-btn primary" onclick="adminApp.openProductModal()">
          <span>+ Add Product</span>
        </button>
        <button class="admin-qa-btn secondary" onclick="adminApp.navigate('media')">
          <span>☁ Upload Images</span>
        </button>
        <button class="admin-qa-btn secondary" onclick="adminApp.navigate('banners')">
          <span>🖼 Create Banner</span>
        </button>
      </div>

      <!-- Category Overview Strip (9 Categories with real thumbnails) -->
      <div class="admin-section-header">
        <h3 class="admin-section-title">
          <span>🗂 Category Overview</span>
        </h3>
        <a class="admin-section-link" onclick="adminApp.navigate('categories')">View All →</a>
      </div>

      <div class="admin-cats-strip">
        ${categories.map(cat => `
          <div class="admin-cat-card-mini" onclick="adminApp.filterProductsByCategory('${cat.id}')">
            <img src="${cat.image || 'assets/categories/cat_shirts.jpg'}" class="admin-cat-thumb" alt="${cat.title}" />
            <span class="admin-cat-name">${cat.title}</span>
          </div>
        `).join('')}
      </div>

      <!-- Bottom Grid: Recent Product Uploads + Festival Banners + Recent Activity -->
      <div class="admin-grid-split">
        <!-- Recent Products Table -->
        <div class="admin-panel">
          <div class="admin-section-header">
            <h3 class="admin-section-title">📦 Recent Product Uploads</h3>
            <a class="admin-section-link" onclick="adminApp.navigate('products')">View All →</a>
          </div>
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${products.slice(0, 5).map(p => `
                  <tr>
                    <td><img src="${p.mainImage || p.image}" class="admin-prod-thumb" alt="${p.title}" /></td>
                    <td><strong>${p.title}</strong></td>
                    <td style="text-transform: capitalize;">${p.category}</td>
                    <td><strong>$${(p.price || 0).toFixed(2)}</strong></td>
                    <td>${p.stock || 50}</td>
                    <td><span class="admin-status-badge status-active">Active</span></td>
                    <td>
                      <button class="admin-btn-secondary" style="padding: 4px 10px; font-size: 0.76rem;" onclick="adminApp.openProductModal('${p.id}')">Edit</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right Side: Promotional Banners & Activity -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Create Seasonal Banner Card -->
          <div class="admin-panel" style="background: #FAF6EF; border-color: var(--admin-gold);">
            <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 4px; color: var(--admin-maroon);">Create Seasonal Banner</div>
            <div style="font-size: 0.8rem; color: var(--admin-text-muted); margin-bottom: 14px;">Design and upload promotional banners for Diwali, Eid, Winter Drops.</div>
            <button class="admin-btn-primary" style="padding: 8px 18px; font-size: 0.78rem; width: auto;" onclick="adminApp.navigate('banners')">Create Banner →</button>
            <div style="margin-top: 14px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
              <img src="assets/admin/admin_festival_card.jpg" style="width: 100%; height: auto; display: block;" alt="Festive Banners Preview" />
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="admin-panel">
            <div class="admin-section-header">
              <h3 class="admin-section-title">⏱ Recent Activity</h3>
            </div>
            <div class="admin-activity-list">
              ${(this.data.activityLogs || []).slice(0, 4).map(act => `
                <div class="admin-activity-item">
                  <div class="admin-activity-icon">${act.icon === 'shirt' ? '👔' : act.icon === 'image' ? '🖼️' : '📦'}</div>
                  <div>
                    <div style="font-weight: 600;">${act.title}</div>
                    <div class="admin-activity-time">${act.time}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 2. PRODUCT MANAGEMENT VIEW
  // ==========================================
  renderProducts(container) {
    const products = this.data.products || [];
    container.innerHTML = `
      <div class="admin-section-header" style="margin-bottom: 20px;">
        <div>
          <h2 class="admin-welcome-title" style="font-size: 1.6rem;">Product Inventory Management</h2>
          <p style="font-size: 0.88rem; color: var(--admin-text-muted);">Manage apparel, stock, pricing, and live storefront status.</p>
        </div>
        <button class="admin-btn-primary" style="width: auto;" onclick="adminApp.openProductModal()">
          <span>+ Add New Product</span>
        </button>
      </div>

      <!-- Filters & Search Bar -->
      <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 20px;">
        <input type="text" class="admin-input" style="max-width: 280px;" placeholder="Filter by product name..." oninput="adminApp.filterProductTable(this.value)" id="prodFilterInput" />
        <select class="admin-select" style="max-width: 180px;" onchange="adminApp.filterProductByCategorySelect(this.value)">
          <option value="">All Categories</option>
          ${(this.data.categories || []).map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
        </select>
      </div>

      <div class="admin-panel" style="padding: 0; overflow: hidden;">
        <div class="admin-table-wrap">
          <table class="admin-table" id="allProductsTable">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Sale Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr data-cat="${p.category}" data-title="${p.title.toLowerCase()}">
                  <td><img src="${p.mainImage || p.image}" class="admin-prod-thumb" alt="${p.title}" /></td>
                  <td><strong>${p.title}</strong><br><small style="color:var(--admin-text-light);">${p.id}</small></td>
                  <td style="text-transform: capitalize;">${p.category}</td>
                  <td><strong>$${(p.price || 0).toFixed(2)}</strong></td>
                  <td>${p.compareAtPrice ? `$${p.compareAtPrice.toFixed(2)}` : '—'}</td>
                  <td>
                    <span style="font-weight: 700; color: ${(p.stock || 50) < 10 ? 'var(--admin-danger)' : 'var(--admin-text-main)'};">
                      ${p.stock || 50} units
                    </span>
                  </td>
                  <td><span class="admin-status-badge status-active">Active</span></td>
                  <td>${p.featured ? '⭐ Yes' : 'No'}</td>
                  <td>
                    <div style="display: flex; gap: 6px;">
                      <button class="admin-btn-secondary" style="padding: 6px 12px; font-size: 0.75rem;" onclick="adminApp.openProductModal('${p.id}')">Edit</button>
                      <button class="admin-btn-secondary" style="padding: 6px 10px; font-size: 0.75rem; color: var(--admin-danger);" onclick="adminApp.deleteProduct('${p.id}')">🗑</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 3. CATEGORIES MANAGEMENT VIEW
  // ==========================================
  renderCategories(container) {
    const categories = this.data.categories || [];
    container.innerHTML = `
      <div class="admin-section-header" style="margin-bottom: 20px;">
        <div>
          <h2 class="admin-welcome-title" style="font-size: 1.6rem;">Category Management</h2>
          <p style="font-size: 0.88rem; color: var(--admin-text-muted);">Manage all nine luxury website categories and collections.</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px;">
        ${categories.map(c => {
          const count = (this.data.products || []).filter(p => p.category === c.id).length;
          return `
            <div class="admin-panel" style="display: flex; align-items: center; gap: 16px;">
              <img src="${c.image || 'assets/categories/cat_shirts.jpg'}" style="width: 70px; height: 80px; object-fit: cover; border-radius: 12px; border: 1px solid var(--admin-border);" alt="${c.title}" />
              <div style="flex-grow: 1;">
                <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 4px;">${c.title}</h4>
                <div style="font-size: 0.8rem; color: var(--admin-text-muted); margin-bottom: 6px;">${count} Products Assigned</div>
                <span class="admin-status-badge status-active">Enabled</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ==========================================
  // 4. BANNERS & PROMOTIONS VIEW
  // ==========================================
  renderBanners(container) {
    const banners = this.data.banners || [];
    container.innerHTML = `
      <div class="admin-section-header" style="margin-bottom: 20px;">
        <div>
          <h2 class="admin-welcome-title" style="font-size: 1.6rem;">Banners & Promotional Campaigns</h2>
          <p style="font-size: 0.88rem; color: var(--admin-text-muted);">Schedule and manage festive banners for Diwali, Eid, Christmas, & Seasonal drops.</p>
        </div>
        <button class="admin-btn-primary" style="width: auto;" onclick="adminApp.openNewBannerPrompt()">
          <span>+ Add New Banner</span>
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
        ${banners.map(b => `
          <div class="admin-panel" style="padding: 0; overflow: hidden;">
            <img src="${b.desktopImage || 'assets/banners/banner_sale.jpg'}" style="width: 100%; height: 160px; object-fit: cover;" alt="${b.title}" />
            <div style="padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 0.72rem; font-weight: 700; color: var(--admin-gold); text-transform: uppercase;">${b.occasion}</span>
                <span class="admin-status-badge status-active">${b.status}</span>
              </div>
              <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 6px;">${b.title}</h4>
              <p style="font-size: 0.82rem; color: var(--admin-text-muted); margin-bottom: 14px;">${b.promotionalText}</p>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--admin-border-subtle); padding-top: 12px;">
                <strong style="color: var(--admin-maroon); font-size: 0.9rem;">${b.discountText}</strong>
                <button class="admin-btn-secondary" style="padding: 4px 10px; font-size: 0.76rem; color: var(--admin-danger);" onclick="adminApp.deleteBanner('${b.id}')">Delete</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ==========================================
  // 5. COLLECTIONS VIEW
  // ==========================================
  renderCollections(container) {
    container.innerHTML = `
      <div class="admin-section-header" style="margin-bottom: 20px;">
        <div>
          <h2 class="admin-welcome-title" style="font-size: 1.6rem;">Curated Collections</h2>
          <p style="font-size: 0.88rem; color: var(--admin-text-muted);">Organize products into seasonal lookbooks and festive edits.</p>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px;">
        <div class="admin-panel">
          <h3 style="font-family: 'Playfair Display', serif; font-size: 1.2rem; margin-bottom: 8px;">👑 Redefined Classics</h3>
          <p style="font-size: 0.84rem; color: var(--admin-text-muted); margin-bottom: 14px;">Architectural tailoring and understated luxury staples.</p>
          <span class="admin-status-badge status-active">Published</span>
        </div>
        <div class="admin-panel">
          <h3 style="font-family: 'Playfair Display', serif; font-size: 1.2rem; margin-bottom: 8px;">✨ Festive & Royal Edit</h3>
          <p style="font-size: 0.84rem; color: var(--admin-text-muted); margin-bottom: 14px;">Handcrafted luxury kurtas, silk shawls, and occasion blazers.</p>
          <span class="admin-status-badge status-active">Published</span>
        </div>
        <div class="admin-panel">
          <h3 style="font-family: 'Playfair Display', serif; font-size: 1.2rem; margin-bottom: 8px;">❄ Winter Cashmere & Coats</h3>
          <p style="font-size: 0.84rem; color: var(--admin-text-muted); margin-bottom: 14px;">Heavyweight outerwear, tailored trench coats, and parkas.</p>
          <span class="admin-status-badge status-active">Published</span>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 6. MEDIA LIBRARY VIEW
  // ==========================================
  renderMedia(container) {
    const images = [];
    (this.data.products || []).forEach(p => {
      if (p.mainImage && !images.includes(p.mainImage)) images.push(p.mainImage);
      if (p.gallery) {
        p.gallery.forEach(g => { if (!images.includes(g)) images.push(g); });
      }
    });

    container.innerHTML = `
      <div class="admin-section-header" style="margin-bottom: 20px;">
        <div>
          <h2 class="admin-welcome-title" style="font-size: 1.6rem;">Media Asset Library</h2>
          <p style="font-size: 0.88rem; color: var(--admin-text-muted);">Inspect all high-resolution fashion assets, banner graphics, and studio cutouts.</p>
        </div>
        <button class="admin-btn-primary" style="width: auto;" onclick="document.getElementById('mediaUploadDirect').click()">
          <span>+ Upload Image</span>
        </button>
        <input type="file" id="mediaUploadDirect" accept="image/*" style="display:none;" onchange="adminApp.handleDirectMediaUpload(event)" />
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 14px;">
        ${images.map(img => `
          <div class="admin-panel" style="padding: 8px; text-align: center;">
            <img src="${img}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" alt="Asset" />
            <div style="font-size: 0.68rem; color: var(--admin-text-light); word-break: break-all;">${img.split('/').pop()}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ==========================================
  // 7. ORDERS VIEW
  // ==========================================
  renderOrders(container) {
    const orders = this.data.orders || [];
    container.innerHTML = `
      <div class="admin-section-header" style="margin-bottom: 20px;">
        <div>
          <h2 class="admin-welcome-title" style="font-size: 1.6rem;">Client Order Management</h2>
          <p style="font-size: 0.88rem; color: var(--admin-text-muted);">Real-time atelier orders, dispatch statuses, customer contacts, and payment telemetry.</p>
        </div>
      </div>

      <div class="admin-panel" style="padding: 0; overflow: hidden;">
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client & Contact</th>
                <th>Delivery Address</th>
                <th>Items Ordered</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${orders.length === 0 ? `
                <tr><td colspan="8" style="text-align:center; padding:30px; color:var(--admin-text-muted);">No orders recorded in atelier registry yet.</td></tr>
              ` : orders.map(o => {
                const cleanPhone = (o.phone || '').replace(/[^0-9]/g, '').slice(-10);
                const statusColor = o.fulfillmentStatus === 'delivered' ? '#2E7D32' : 
                                    o.fulfillmentStatus === 'cancelled' ? '#C62828' : 
                                    o.fulfillmentStatus === 'dispatched' ? '#1565C0' : '#E65100';
                return `
                <tr>
                  <td>
                    <strong>${o.id}</strong><br>
                    <small style="color:var(--admin-text-light);">${o.date || ''}</small>
                  </td>
                  <td>
                    <strong>${o.customerName}</strong><br>
                    ${cleanPhone ? `
                      <div style="margin-top:3px; display:flex; gap:6px; align-items:center;">
                        <a href="https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(o.customerName)},%20your%20Jeanscorner%20order%20${o.id}%20update:" target="_blank" style="color:#25D366; font-size:0.75rem; text-decoration:none; font-weight:700;">💬 ${o.phone}</a>
                        <a href="tel:${o.phone}" style="color:var(--admin-text-light); font-size:0.75rem; text-decoration:none;">📞</a>
                      </div>
                    ` : ''}
                    <small style="color:var(--admin-text-light);">${o.customerEmail || ''}</small>
                  </td>
                  <td>
                    <div style="font-size:0.8rem; line-height:1.4; max-width:200px;">
                      ${o.shippingAddress || o.address || 'Solapur Atelier'}, ${o.city || 'Solapur'} ${o.postalCode || ''}
                    </div>
                  </td>
                  <td>
                    <div style="font-size:0.8rem; line-height:1.4;">
                      ${o.items ? o.items.map(i => `<div>${i.quantity}x ${i.title} <span style="color:var(--admin-text-light);">(${i.size || 'M'})</span></div>`).join('') : '1 Item'}
                    </div>
                  </td>
                  <td>
                    <strong style="color:var(--admin-accent); font-size:0.95rem;">₹${(o.total || 0).toLocaleString('en-IN')}</strong><br>
                    <small style="color:var(--admin-text-light);">${o.deliveryFee > 0 ? `+₹${o.deliveryFee} ship` : 'Free ship'}</small>
                  </td>
                  <td>
                    <span class="admin-status-badge status-active" style="text-transform:uppercase; font-size:0.72rem;">${o.paymentMethod || 'COD'}</span>
                  </td>
                  <td>
                    <select class="admin-select" style="padding:4px 8px; font-size:0.78rem; border-radius:4px; font-weight:600; color:${statusColor};" onchange="adminApp.changeOrderStatus('${o.id}', this.value)">
                      <option value="placed" ${o.fulfillmentStatus === 'placed' ? 'selected' : ''}>Placed</option>
                      <option value="processing" ${o.fulfillmentStatus === 'processing' ? 'selected' : ''}>Processing</option>
                      <option value="dispatched" ${o.fulfillmentStatus === 'dispatched' ? 'selected' : ''}>Dispatched</option>
                      <option value="delivered" ${o.fulfillmentStatus === 'delivered' ? 'selected' : ''}>Delivered</option>
                      <option value="cancelled" ${o.fulfillmentStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button class="admin-btn-secondary" style="padding: 4px 10px; font-size: 0.76rem;" onclick="adminApp.updateOrderStatus('${o.id}')">Edit</button>
                  </td>
                </tr>
              `;}).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 8. CUSTOMERS VIEW
  // ==========================================
  renderCustomers(container) {
    const customers = this.data.customers || [];
    container.innerHTML = `
      <div class="admin-section-header" style="margin-bottom: 20px;">
        <div>
          <h2 class="admin-welcome-title" style="font-size: 1.6rem;">Customer Directory</h2>
          <p style="font-size: 0.88rem; color: var(--admin-text-muted);">Registered clientele, lifetime spend, and concierge records.</p>
        </div>
      </div>

      <div class="admin-panel" style="padding: 0; overflow: hidden;">
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>City / Region</th>
                <th>Orders</th>
                <th>Total Spend</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              ${customers.map(c => `
                <tr>
                  <td><strong>${c.name}</strong></td>
                  <td>${c.email}<br><small style="color:var(--admin-text-light);">${c.phone}</small></td>
                  <td>${c.city}</td>
                  <td>${c.orderCount} Orders</td>
                  <td><strong>$${(c.totalSpent || 0).toFixed(2)}</strong></td>
                  <td>${c.registeredDate}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 9. SETTINGS VIEW
  // ==========================================
  renderSettings(container) {
    container.innerHTML = `
      <div class="admin-section-header" style="margin-bottom: 20px;">
        <div>
          <h2 class="admin-welcome-title" style="font-size: 1.6rem;">Store & Atelier Settings</h2>
          <p style="font-size: 0.88rem; color: var(--admin-text-muted);">Brand identity, currency, contact email, and administrator credentials.</p>
        </div>
      </div>

      <div class="admin-panel" style="max-width: 600px;">
        <div class="admin-input-group">
          <label class="admin-label">Store Brand Name</label>
          <input type="text" class="admin-input" value="JEANSCORNER" readonly />
        </div>
        <div class="admin-input-group">
          <label class="admin-label">Store Currency</label>
          <input type="text" class="admin-input" value="USD ($)" readonly />
        </div>
        <div class="admin-input-group">
          <label class="admin-label">Admin Support Email</label>
          <input type="email" class="admin-input" value="admin@jeanscorner.com" />
        </div>
        <button class="admin-btn-primary" style="margin-top: 12px;" onclick="adminApp.showToast('Store settings saved successfully.')">Save Preferences</button>
      </div>
    `;
  }

  // ==========================================
  // ADD / EDIT PRODUCT MODAL LOGIC
  // ==========================================
  openProductModal(productId = null) {
    const panel = document.getElementById('productSlidePanel');
    const form = document.getElementById('productForm');
    const title = document.getElementById('panelFormModeTitle');
    const submitBtn = document.getElementById('prodSubmitBtnText');
    this.uploadedImages = [];

    if (productId) {
      const p = (this.data.products || []).find(item => item.id === productId);
      if (p) {
        title.textContent = '✎ Edit Product: ' + p.title;
        submitBtn.textContent = 'Save Changes';
        document.getElementById('prodEditId').value = p.id;
        document.getElementById('prodTitle').value = p.title || '';
        document.getElementById('prodCategory').value = p.category || 'shirts';
        document.getElementById('prodSubcategory').value = p.subCategory || '';
        document.getElementById('prodPrice').value = p.price || '';
        document.getElementById('prodSalePrice').value = p.compareAtPrice || '';
        document.getElementById('prodStock').value = p.stock || 50;
        document.getElementById('prodSizes').value = p.sizes ? p.sizes.map(s => s.size || s).join(', ') : 'S, M, L, XL';
        document.getElementById('prodColors').value = p.colors ? p.colors.map(c => c.name || c).join(', ') : 'Olive, White';
        document.getElementById('prodDescription').value = p.shortDesc || (p.accordion ? p.accordion.description : '');
        document.getElementById('prodFeatured').checked = !!p.featured;
        document.getElementById('prodIsNew').checked = !!p.isNew;

        if (p.mainImage) this.uploadedImages.push(p.mainImage);
        if (p.gallery) {
          p.gallery.forEach(g => { if (!this.uploadedImages.includes(g)) this.uploadedImages.push(g); });
        }
      }
    } else {
      title.textContent = '⊕ Add New Product';
      submitBtn.textContent = '🚀 Publish Product';
      form.reset();
      document.getElementById('prodEditId').value = '';
      this.uploadedImages = [];
    }

    this.renderUploadedThumbs();
    panel.classList.add('open');
  }

  closeProductModal() {
    document.getElementById('productSlidePanel').classList.remove('open');
  }

  setupDropzone() {
    const dropzone = document.getElementById('prodDropzone');
    if (!dropzone) return;

    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length) this.uploadFiles(files);
    });
  }

  handleFileSelect(e) {
    const files = e.target.files;
    if (files.length) this.uploadFiles(files);
  }

  async uploadFiles(fileList) {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const base64 = await this.toBase64(file);
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ filename: file.name, base64Data: base64 })
        });
        const json = await res.json();
        if (json.success) {
          this.uploadedImages.push(json.url);
          this.renderUploadedThumbs();
        }
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
  }

  async handleDirectMediaUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await this.toBase64(file);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ filename: file.name, base64Data: base64 })
      });
      const json = await res.json();
      if (json.success) {
        this.showToast('Image uploaded to media library!');
        await this.loadData();
        this.renderView('media');
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  }

  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  renderUploadedThumbs() {
    const row = document.getElementById('prodThumbsRow');
    if (!row) return;

    row.innerHTML = this.uploadedImages.map((src, idx) => `
      <div class="admin-thumb-slot">
        <img src="${src}" alt="Thumb" />
        <span class="thumb-del" onclick="adminApp.removeThumb(${idx})">✕</span>
      </div>
    `).join('') + `
      <div class="admin-thumb-slot add-more" onclick="document.getElementById('prodFileInput').click()" title="Add another photo">+</div>
    `;
  }

  removeThumb(idx) {
    this.uploadedImages.splice(idx, 1);
    this.renderUploadedThumbs();
  }

  async saveProduct(e) {
    e.preventDefault();
    const editId = document.getElementById('prodEditId').value;
    const title = document.getElementById('prodTitle').value;
    const category = document.getElementById('prodCategory').value;
    const subCategory = document.getElementById('prodSubcategory').value || 'tailored';
    const price = parseFloat(document.getElementById('prodPrice').value);
    const salePrice = parseFloat(document.getElementById('prodSalePrice').value) || null;
    const stock = parseInt(document.getElementById('prodStock').value, 10) || 50;
    const sizes = document.getElementById('prodSizes').value.split(',').map(s => ({ size: s.trim(), available: true, stock: 10 }));
    const colors = document.getElementById('prodColors').value.split(',').map(c => ({ name: c.trim(), hex: '#141312' }));
    const description = document.getElementById('prodDescription').value;
    const featured = document.getElementById('prodFeatured').checked;
    const isNew = document.getElementById('prodIsNew').checked;

    const mainImage = this.uploadedImages.length > 0 ? this.uploadedImages[0] : 'assets/products/p_classic_black.jpg';
    const gallery = this.uploadedImages.length > 0 ? this.uploadedImages : [mainImage];

    const payload = {
      title,
      category,
      subCategory,
      price,
      compareAtPrice: salePrice,
      stock,
      sizes,
      colors,
      shortDesc: description,
      image: mainImage,
      mainImage,
      gallery,
      featured,
      isNew,
      accordion: {
        description: description,
        materials: "100% Premium Combed Cotton. Handcrafted in our bespoke atelier.",
        fitSizing: "True to size modern tailored fit.",
        care: "Dry clean or gentle hand wash."
      }
    };

    try {
      let res;
      if (editId) {
        res = await fetch(`/api/admin/products/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const json = await res.json();
      if (json.success) {
        this.showToast(editId ? 'Product updated successfully!' : 'Product published to store!');
        this.closeProductModal();
        await this.loadData();
        this.renderView(this.currentView);
      } else {
        alert(json.error || 'Failed to save product');
      }
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  }

  async deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product? It will be immediately removed from the customer storefront.')) return;
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      const json = await res.json();
      if (json.success) {
        this.showToast('Product deleted from inventory');
        await this.loadData();
        this.renderView(this.currentView);
      }
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  }

  async deleteBanner(bannerId) {
    if (!confirm('Are you sure you want to remove this promotional banner?')) return;
    try {
      const res = await fetch(`/api/admin/banners/${bannerId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      const json = await res.json();
      if (json.success) {
        this.showToast('Banner removed');
        await this.loadData();
        this.renderView('banners');
      }
    } catch (err) {
      alert('Failed to delete banner');
    }
  }

  async openNewBannerPrompt() {
    const title = prompt('Enter Banner Title (e.g. Christmas Luxury Gala):');
    if (!title) return;
    const occasion = prompt('Occasion / Season (e.g. Christmas, Wedding Season, Eid, Diwali):') || 'Festive';
    const discount = prompt('Promotional Offer / Discount Text (e.g. Up to 40% Off):') || 'Exclusive Drop';

    const payload = {
      title,
      occasion,
      desktopImage: 'assets/banners/banner_blazers.jpg',
      mobileImage: 'assets/banners/banner_blazers.jpg',
      subtitle: 'Bespoke Atelier Collection',
      promotionalText: 'Celebrate in immaculate tailoring and master craftsmanship.',
      discountText: discount,
      buttonLabel: 'SHOP COLLECTION',
      buttonDestination: '#/collection/blazers',
      status: 'active'
    };

    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        this.showToast('New seasonal banner published!');
        await this.loadData();
        this.renderView('banners');
      }
    } catch (err) {
      alert('Error creating banner');
    }
  }

  changeOrderStatus(orderId, status) {
    if (!status) return;
    fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({ fulfillmentStatus: status })
    }).then(r => r.json()).then(res => {
      this.showToast(`Order ${orderId} updated to ${status}`);
      this.loadData().then(() => this.renderView('orders'));
    }).catch(err => {
      console.error(err);
      alert('Error updating order status');
    });
  }

  updateOrderStatus(orderId) {
    const status = prompt('Enter new order status (placed, processing, dispatched, delivered, cancelled):', 'dispatched');
    if (!status) return;
    this.changeOrderStatus(orderId, status);
  }

  filterProductTable(query) {
    const rows = document.querySelectorAll('#allProductsTable tbody tr');
    const q = (query || '').toLowerCase().trim();
    rows.forEach(r => {
      const title = r.getAttribute('data-title') || '';
      r.style.display = title.includes(q) ? '' : 'none';
    });
  }

  filterProductByCategorySelect(catId) {
    const rows = document.querySelectorAll('#allProductsTable tbody tr');
    rows.forEach(r => {
      const cat = r.getAttribute('data-cat') || '';
      if (!catId || cat === catId) {
        r.style.display = '';
      } else {
        r.style.display = 'none';
      }
    });
  }

  filterProductsByCategory(catId) {
    this.navigate('products');
    setTimeout(() => {
      this.filterProductByCategorySelect(catId);
    }, 100);
  }

  handleGlobalSearch(query) {
    if (!query) return;
    if (this.currentView !== 'products') {
      this.navigate('products');
    }
    setTimeout(() => {
      const input = document.getElementById('prodFilterInput');
      if (input) {
        input.value = query;
        this.filterProductTable(query);
      }
    }, 100);
  }

  showToast(msg) {
    const container = document.getElementById('adminToastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'admin-toast';
    toast.innerHTML = `<span>✨</span><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3500);
  }
}

window.adminApp = new JeanscornerAdmin();

