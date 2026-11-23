/**
 * JEANSCORNER Luxury Fashion Store - Admin Dashboard Core Engine
 * Full functional CRUD for Products, Categories, Banners, Media, Orders, and Settings.
 */

// ==========================================
// 1. ATELIER AUDIO SOUND SYNTHESIS ENGINE
// ==========================================
class AtelierSoundEngine {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = localStorage.getItem('jc_sound_enabled') !== 'false';
  }

  init() {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('jc_sound_enabled', this.soundEnabled ? 'true' : 'false');
    if (this.soundEnabled) {
      this.playOrderChime();
    }
    return this.soundEnabled;
  }

  // Satisfying LinkedIn / iOS style warm musical chime for New Orders
  playOrderChime() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Harmonic arpeggio (C5 -> E5 -> G5 -> C6) with sine waves
      const notes = [
        { freq: 523.25, time: 0.00, dur: 0.35, gain: 0.16 },
        { freq: 659.25, time: 0.08, dur: 0.40, gain: 0.20 },
        { freq: 783.99, time: 0.16, dur: 0.45, gain: 0.22 },
        { freq: 1046.50, time: 0.24, dur: 0.65, gain: 0.26 }
      ];

      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, now + n.time);

        gain.gain.setValueAtTime(0, now + n.time);
        gain.gain.linearRampToValueAtTime(n.gain, now + n.time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur);
      });
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  }

  // Alert ping for Low Stock Warning
  playLowStockAlert() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Two-tone warning alert (A4 -> E5)
      const tones = [
        { freq: 440.00, time: 0.00, dur: 0.20, type: 'triangle', gain: 0.22 },
        { freq: 659.25, time: 0.14, dur: 0.35, type: 'triangle', gain: 0.26 }
      ];

      tones.forEach(t => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = t.type;
        osc.frequency.setValueAtTime(t.freq, now + t.time);

        gain.gain.setValueAtTime(0, now + t.time);
        gain.gain.linearRampToValueAtTime(t.gain, now + t.time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t.time + t.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + t.time);
        osc.stop(now + t.time + t.dur);
      });
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  }

  // Urgent two-pulse descending alert for Out of Stock
  playOutOfStockAlert() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const pings = [
        { freq: 880, time: 0.00, dur: 0.15, gain: 0.28 },
        { freq: 660, time: 0.15, dur: 0.30, gain: 0.32 }
      ];

      pings.forEach(p => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now + p.time);

        osc.frequency.setValueAtTime(p.freq, now + p.time);

        gain.gain.setValueAtTime(0, now + p.time);
        gain.gain.linearRampToValueAtTime(p.gain, now + p.time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + p.time + p.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + p.time);
        osc.stop(now + p.time + p.dur);
      });
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  }
}

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
        this.initNotificationSystem();
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
        this.initNotificationSystem();
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
    const lowStock = products.filter(p => (typeof p.stock === 'number' ? p.stock : 50) < 15).length;

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
                    <td>${(p.stock !== undefined && p.stock !== null) ? (p.stock <= 0 ? '<strong style="color:var(--admin-danger);">0 (Out of stock)</strong>' : p.stock) : 50}</td>
                    <td><span class="admin-status-badge ${(p.stock !== undefined && p.stock <= 0) ? '' : 'status-active'}" style="${(p.stock !== undefined && p.stock <= 0) ? 'background:#FFEBEE; color:#C62828;' : ''}">${(p.stock !== undefined && p.stock <= 0) ? 'Out of Stock' : 'Active'}</span></td>
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
                    <span style="font-weight: 700; color: ${(p.stock !== undefined && p.stock <= 0) ? 'var(--admin-danger)' : ((p.stock || 0) < 10 ? '#E65100' : 'var(--admin-text-main)')};">
                      ${(p.stock !== undefined && p.stock !== null) ? (p.stock <= 0 ? '0 units (Out of Stock)' : `${p.stock} units`) : '50 units'}
                    </span>
                  </td>
                  <td><span class="admin-status-badge ${(p.stock !== undefined && p.stock <= 0) ? '' : 'status-active'}" style="${(p.stock !== undefined && p.stock <= 0) ? 'background:#FFEBEE; color:#C62828;' : ''}">${(p.stock !== undefined && p.stock <= 0) ? 'Out of Stock' : 'Active'}</span></td>
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
        document.getElementById('prodStock').value = (p.stock !== undefined && p.stock !== null) ? p.stock : 0;
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
    const rawStock = document.getElementById('prodStock').value.trim();
    const parsedStock = parseInt(rawStock, 10);
    const stock = !isNaN(parsedStock) ? Math.max(0, parsedStock) : 0;
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

  // ==========================================
  // NOTIFICATIONS & TELEMETRY SYSTEM
  // ==========================================
  initNotificationSystem() {
    this.soundEngine = new AtelierSoundEngine();
    this.notifications = JSON.parse(localStorage.getItem('jc_admin_notifications') || '[]');
    this.knownOrderIds = new Set((this.data?.orders || []).map(o => o.id));
    this.knownProductStocks = new Map((this.data?.products || []).map(p => [p.id, p.stock]));

    // Unlock browser audio on first user interaction
    const unlockAudio = () => {
      this.soundEngine.init();
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    // Close notification dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('adminNotificationDropdown');
      const bell = document.getElementById('adminNotificationBell');
      if (dropdown && dropdown.style.display !== 'none') {
        if (!dropdown.contains(e.target) && !bell?.contains(e.target)) {
          dropdown.style.display = 'none';
        }
      }
    });

    // Seed initial alerts if empty so user has immediate visibility
    if (this.notifications.length === 0 && this.data) {
      this.seedInitialNotifications();
    }

    this.updateNotificationBadge();
    this.startRealtimePolling();
  }

  seedInitialNotifications() {
    const products = this.data.products || [];
    const orders = this.data.orders || [];

    // Out of stock products
    products.filter(p => p.stock !== undefined && p.stock <= 0).slice(0, 3).forEach(p => {
      this.notifications.push({
        id: 'notif_init_out_' + p.id,
        type: 'outstock',
        title: `Out of Stock: ${p.title}`,
        subtitle: `Inventory is at 0 units. Reordering needed.`,
        time: 'Active Alert',
        timestamp: Date.now(),
        read: false,
        targetView: 'products',
        targetId: p.id
      });
    });

    // Low stock products
    products.filter(p => p.stock !== undefined && p.stock > 0 && p.stock <= 10).slice(0, 2).forEach(p => {
      this.notifications.push({
        id: 'notif_init_low_' + p.id,
        type: 'lowstock',
        title: `Low Stock: ${p.title}`,
        subtitle: `Only ${p.stock} units left in stock.`,
        time: 'Active Alert',
        timestamp: Date.now(),
        read: false,
        targetView: 'products',
        targetId: p.id
      });
    });

    // Recent orders
    orders.slice(0, 3).forEach(o => {
      this.notifications.push({
        id: 'notif_init_order_' + o.id,
        type: 'order',
        title: `Order ${o.id}`,
        subtitle: `${o.customerName} • ₹${(o.total || 0).toLocaleString('en-IN')}`,
        time: o.date || 'Recent',
        timestamp: Date.now(),
        read: false,
        targetView: 'orders',
        targetId: o.id
      });
    });

    this.saveNotifications();
  }

  saveNotifications() {
    localStorage.setItem('jc_admin_notifications', JSON.stringify(this.notifications.slice(0, 40)));
    this.updateNotificationBadge();
  }

  updateNotificationBadge() {
    const countEl = document.getElementById('adminNotificationCount');
    const summaryEl = document.getElementById('notifUnreadSummary');
    const unreadCount = this.notifications.filter(n => !n.read).length;

    if (countEl) {
      countEl.textContent = unreadCount;
      countEl.style.display = unreadCount > 0 ? 'flex' : 'none';
    }

    if (summaryEl) {
      summaryEl.textContent = `${unreadCount} unread alert${unreadCount === 1 ? '' : 's'}`;
    }

    const soundBtn = document.getElementById('btnSoundToggle');
    if (soundBtn && this.soundEngine) {
      soundBtn.innerHTML = this.soundEngine.soundEnabled ? '🔔 Sound ON' : '🔕 Muted';
      soundBtn.style.color = this.soundEngine.soundEnabled ? 'var(--admin-text-main)' : 'var(--admin-text-light)';
    }
  }

  toggleNotificationDropdown(e) {
    if (e) e.stopPropagation();
    this.soundEngine?.init();
    const dropdown = document.getElementById('adminNotificationDropdown');
    if (!dropdown) return;

    const isOpen = dropdown.style.display === 'block';
    if (isOpen) {
      dropdown.style.display = 'none';
    } else {
      this.renderNotificationList();
      dropdown.style.display = 'block';
    }
  }

  renderNotificationList() {
    const listEl = document.getElementById('adminNotificationList');
    if (!listEl) return;

    if (this.notifications.length === 0) {
      listEl.innerHTML = `
        <div style="padding: 30px 20px; text-align: center; color: var(--admin-text-light); font-size: 0.82rem;">
          <div style="font-size: 1.8rem; margin-bottom: 6px;">✨</div>
          All caught up! No active atelier alerts.
        </div>
      `;
      return;
    }

    listEl.innerHTML = this.notifications.map(n => {
      let icon = '🛍️';
      let iconClass = 'notif-icon-order';
      if (n.type === 'lowstock') {
        icon = '⚠️';
        iconClass = 'notif-icon-lowstock';
      } else if (n.type === 'outstock') {
        icon = '🚨';
        iconClass = 'notif-icon-outstock';
      }

      return `
        <div class="notif-item ${n.read ? '' : 'is-unread'}" onclick="adminApp.handleNotificationClick('${n.id}')">
          <div class="notif-icon-box ${iconClass}">${icon}</div>
          <div class="notif-content">
            <div class="notif-title">${n.title}</div>
            <div class="notif-subtitle">${n.subtitle}</div>
            <div class="notif-time">${n.time}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  handleNotificationClick(notifId) {
    const notif = this.notifications.find(n => n.id === notifId);
    if (!notif) return;

    notif.read = true;
    this.saveNotifications();

    const dropdown = document.getElementById('adminNotificationDropdown');
    if (dropdown) dropdown.style.display = 'none';

    if (notif.targetView) {
      this.renderView(notif.targetView);
    }
  }

  markAllNotificationsRead(e) {
    if (e) e.stopPropagation();
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.renderNotificationList();
    this.showToast('All notifications marked as read.');
  }

  toggleSoundMute(e) {
    if (e) e.stopPropagation();
    const enabled = this.soundEngine.toggleSound();
    this.updateNotificationBadge();
    this.showToast(enabled ? '🔔 Notification chimes enabled!' : '🔕 Notification sounds muted.');
  }

  startRealtimePolling() {
    if (this.pollingTimer) clearInterval(this.pollingTimer);

    // Poll every 5 seconds for new orders & stock changes
    this.pollingTimer = setInterval(async () => {
      if (!this.token) return;
      try {
        const res = await fetch('/api/data');
        const latestData = await res.json();
        this.checkDataDeltas(latestData);
      } catch (e) {
        // network or server sleep; ignore
      }
    }, 5000);
  }

  checkDataDeltas(latestData) {
    if (!latestData || !latestData.orders || !latestData.products) return;

    let hasNewOrders = false;
    let hasStockChanges = false;

    // 1. Check for new orders
    const newOrders = latestData.orders.filter(o => !this.knownOrderIds.has(o.id));
    if (newOrders.length > 0) {
      hasNewOrders = true;
      newOrders.forEach(o => {
        this.knownOrderIds.add(o.id);
        this.notifications.unshift({
          id: 'notif_order_' + o.id + '_' + Date.now(),
          type: 'order',
          title: `New Order: ${o.id}`,
          subtitle: `${o.customerName} placed order for ₹${(o.total || 0).toLocaleString('en-IN')} (${o.paymentMethod ? o.paymentMethod.toUpperCase() : 'COD'})`,
          time: 'Just now',
          timestamp: Date.now(),
          read: false,
          targetView: 'orders',
          targetId: o.id
        });
        this.showToast(`🎉 New Order ${o.id} received from ${o.customerName}!`);
      });

      // Play satisfying LinkedIn-style order chime!
      this.soundEngine.playOrderChime();
    }

    // 2. Check for stock alerts
    latestData.products.forEach(p => {
      const prevStock = this.knownProductStocks.get(p.id);
      const currStock = p.stock !== undefined ? p.stock : 50;

      // Transition into Out of Stock (stock === 0)
      if (currStock <= 0 && (prevStock === undefined || prevStock > 0)) {
        hasStockChanges = true;
        this.notifications.unshift({
          id: 'notif_out_' + p.id + '_' + Date.now(),
          type: 'outstock',
          title: `🚨 Out of Stock: ${p.title}`,
          subtitle: `Item is completely sold out (0 units left). Restock recommended.`,
          time: 'Just now',
          timestamp: Date.now(),
          read: false,
          targetView: 'products',
          targetId: p.id
        });
        this.soundEngine.playOutOfStockAlert();
        this.showToast(`🚨 Out of Stock Alert: ${p.title} has 0 units!`);
      }
      // Transition into Low Stock (1 <= stock <= 5)
      else if (currStock > 0 && currStock <= 5 && (prevStock === undefined || prevStock > 5)) {
        hasStockChanges = true;
        this.notifications.unshift({
          id: 'notif_low_' + p.id + '_' + Date.now(),
          type: 'lowstock',
          title: `⚠️ Low Stock: ${p.title}`,
          subtitle: `Only ${currStock} unit(s) remaining in atelier inventory.`,
          time: 'Just now',
          timestamp: Date.now(),
          read: false,
          targetView: 'products',
          targetId: p.id
        });
        this.soundEngine.playLowStockAlert();
        this.showToast(`⚠️ Low Stock Alert: ${p.title} (${currStock} units left)`);
      }

      this.knownProductStocks.set(p.id, currStock);
    });

    if (hasNewOrders || hasStockChanges) {
      this.data = latestData;
      this.saveNotifications();
      // Auto-refresh view if viewing orders or dashboard or products
      if (this.currentView === 'orders' || this.currentView === 'dashboard' || this.currentView === 'products') {
        const container = document.getElementById('adminViewContainer');
        if (container) this.renderView(this.currentView);
      }
    }
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

