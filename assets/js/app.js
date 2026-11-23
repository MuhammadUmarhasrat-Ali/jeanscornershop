// GENSCORNAR Storefront Core Engine
// Handles Navigation, Filter & Sort, Shopping Bag / Cart Drawer, Toast Notifications, and Dynamic Views

class GenscornarStore {
  constructor() {
    this.data = window.GENSCORNAR_DATA || {};
    this.cart = this.loadCart();
    this.currentView = 'home';
    this.activeFilters = {
      priceMax: 10000,
      sizes: [],
      colors: [],
      sortBy: 'featured'
    };
    this.selectedProduct = null;
    this.activeVariant = {
      color: null,
      size: 'M',
      quantity: 1
    };
    this.viewer3D = null;
    
    this.init();
  }

  init() {
    // Attempt dynamic fetch from server API to stay 100% in sync with Admin changes
    fetch('/api/data')
      .then(res => res.json())
      .then(serverData => {
        if (serverData && serverData.products) {
          this.data = serverData;
          window.GENSCORNAR_DATA = serverData;
          this.renderCurrentView();
        }
      })
      .catch(() => {});

    this.updateCartBadge();
    this.bindGlobalEvents();
    this.renderCurrentView();
  }

  loadCart() {
    try {
      const stored = localStorage.getItem('genscornar_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('genscornar_cart', JSON.stringify(this.cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
    this.updateCartBadge();
    this.renderCartDrawer();
  }

  updateCartBadge() {
    const totalCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
      badge.classList.remove('badge-pop');
      void badge.offsetWidth;
      badge.classList.add('badge-pop');
    });
  }

  bindGlobalEvents() {
    // Header Sticky Effect
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header?.classList.add('is-scrolled');
      } else {
        header?.classList.remove('is-scrolled');
      }
    });

    // Cart Drawer Toggle
    const cartToggles = document.querySelectorAll('[data-action="open-cart"]');
    cartToggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCart();
      });
    });

    const closeCartBtn = document.getElementById('closeCartBtn');
    closeCartBtn?.addEventListener('click', () => this.closeCart());

    // Master close handler for backdrop and escape key
    const closeAllActiveDrawersAndModals = () => {
      this.closeCart();
      this.closeSearch();
      this.closeMobileNav();
      this.closeMobileFilters();
      this.closeAccountModal();
      this.closeCheckoutModal();
      this.closeSizeGuide();
      this.closeInfoModal();
    };

    const backdrop = document.getElementById('drawerBackdrop');
    backdrop?.addEventListener('click', closeAllActiveDrawersAndModals);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllActiveDrawersAndModals();
      }
    });

    // Payment method selector delegation
    document.addEventListener('change', (e) => {
      if (e.target && e.target.name === 'paymentMethod') {
        document.querySelectorAll('.payment-option-label').forEach(lbl => lbl.classList.remove('active'));
        e.target.closest('.payment-option-label')?.classList.add('active');
        const cardBox = document.getElementById('cardInputsBox');
        if (cardBox) {
          cardBox.style.display = e.target.value === 'card' ? 'block' : 'none';
        }
      }
    });

    // Search Toggle
    const searchToggles = document.querySelectorAll('[data-action="open-search"]');
    searchToggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSearch();
      });
    });

    const closeSearchBtn = document.getElementById('closeSearchBtn');
    closeSearchBtn?.addEventListener('click', () => this.closeSearch());

    const searchInput = document.getElementById('siteSearchInput');
    searchInput?.addEventListener('input', (e) => this.handleSearch(e.target.value));

    // Mobile Navigation Toggle
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    mobileNavToggle?.addEventListener('click', () => this.openMobileNav());

    const closeMobileNavBtn = document.getElementById('closeMobileNavBtn');
    closeMobileNavBtn?.addEventListener('click', () => this.closeMobileNav());

    // Listen for hash changes (browser back/forward & direct URL changes)
    window.addEventListener('hashchange', () => {
      const routeInfo = this.parseCurrentUrlRoute();
      this.navigateTo(routeInfo.view, routeInfo.param, false);
    });

    window.addEventListener('popstate', () => {
      const routeInfo = this.parseCurrentUrlRoute();
      this.navigateTo(routeInfo.view, routeInfo.param, false);
    });

    // Navigation links routing
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-route]');
      if (link) {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        const param = link.getAttribute('data-param');
        this.navigateTo(route, param, true);
      }
    });
  }

  parseCurrentUrlRoute() {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('collection') || searchParams.has('category')) {
      return { view: 'collection', param: searchParams.get('collection') || searchParams.get('category') };
    }
    if (searchParams.has('subcollection') || searchParams.has('subcat')) {
      return { view: 'subcollection', param: searchParams.get('subcollection') || searchParams.get('subcat') };
    }
    if (searchParams.has('product') || searchParams.has('id')) {
      return { view: 'product', param: searchParams.get('product') || searchParams.get('id') };
    }

    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (!hash || hash === 'home') {
      return { view: 'home', param: null };
    }

    const parts = hash.split('/').filter(Boolean);
    if (parts.length === 0 || parts[0] === 'home') {
      return { view: 'home', param: null };
    }

    if (parts[0] === 'collection' || parts[0] === 'category') {
      return { view: 'collection', param: parts[1] || 'shirts' };
    }

    if (parts[0] === 'subcollection' || parts[0] === 'subcategory') {
      return { view: 'subcollection', param: parts[1] || 'casual_shirts' };
    }

    if (parts[0] === 'product') {
      return { view: 'product', param: parts[1] || 'olive-green-casual-shirt' };
    }

    // Direct slug: e.g. #jackets, #blazers, #new_arrivals, #sale
    const validCategoryIds = [
      'new_arrivals', 'shirts', 'tshirts', 'pants', 'jackets',
      'hoodies', 'blazers', 'kurtas', 'trackpants', 'sale'
    ];
    if (validCategoryIds.includes(parts[0])) {
      return { view: 'collection', param: parts[0] };
    }

    if (['casual_shirts', 'formal_shirts', 'checked_shirts', 'plain_shirts'].includes(parts[0])) {
      return { view: 'subcollection', param: parts[0] };
    }

    if (this.data.products && this.data.products.some(p => p.id === parts[0])) {
      return { view: 'product', param: parts[0] };
    }

    return { view: 'home', param: null };
  }

  navigateTo(view, param = null, updateUrl = true) {
    this.currentView = view;
    this.currentParam = param;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL hash without page reload
    if (updateUrl) {
      let targetHash = '#/';
      if (view === 'collection' && param) {
        targetHash = `#/collection/${param}`;
      } else if (view === 'subcollection' && param) {
        targetHash = `#/subcollection/${param}`;
      } else if (view === 'product' && param) {
        targetHash = `#/product/${param}`;
      }
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }
    }

    // Update active nav styling
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkRoute = link.getAttribute('data-route');
      const linkParam = link.getAttribute('data-param');
      const isActive = (linkRoute === view) && (!param || linkParam === param);
      link.classList.toggle('active', isActive);
    });

    this.closeMobileNav();

    // Reset filters on page switch so the collection opens clean
    this.activeFilters.priceMax = 10000;
    this.activeFilters.colors = [];
    this.activeFilters.sizes = [];

    if (view === 'home') {
      this.renderHome();
    } else {
      if (window.destroyHeroSilkShader) {
        window.destroyHeroSilkShader();
      }
      if (view === 'collection') {
        this.renderCollection(param || 'shirts');
      } else if (view === 'subcollection') {
        this.renderSubcollection(param || 'casual_shirts');
      } else if (view === 'product') {
        this.renderProduct(param || 'olive-green-casual-shirt');
      }
    }
  }

  openCart() {
    this.renderCartDrawer();
    document.getElementById('cartDrawer')?.classList.add('is-open');
    document.getElementById('drawerBackdrop')?.classList.add('is-open');
  }

  closeCart() {
    document.getElementById('cartDrawer')?.classList.remove('is-open');
    document.getElementById('drawerBackdrop')?.classList.remove('is-open');
  }

  openSearch() {
    const modal = document.getElementById('searchModal');
    modal?.classList.add('is-open');
    document.getElementById('drawerBackdrop')?.classList.add('is-open');
    setTimeout(() => {
      document.getElementById('siteSearchInput')?.focus();
    }, 100);
  }

  closeSearch() {
    document.getElementById('searchModal')?.classList.remove('is-open');
    document.getElementById('drawerBackdrop')?.classList.remove('is-open');
  }

  openMobileNav() {
    document.getElementById('mobileNavDrawer')?.classList.add('is-open');
    document.getElementById('drawerBackdrop')?.classList.add('is-open');
  }

  closeMobileNav() {
    document.getElementById('mobileNavDrawer')?.classList.remove('is-open');
    document.getElementById('drawerBackdrop')?.classList.remove('is-open');
  }

  toggleMobileFilters() {
    const sidebar = document.querySelector('.collection-sidebar');
    const backdrop = document.getElementById('drawerBackdrop');
    if (!sidebar) return;
    const isOpen = sidebar.classList.contains('mobile-drawer-open');
    if (isOpen) {
      this.closeMobileFilters();
    } else {
      sidebar.classList.add('mobile-drawer-open');
      backdrop?.classList.add('is-open');
    }
  }

  closeMobileFilters() {
    const sidebar = document.querySelector('.collection-sidebar');
    sidebar?.classList.remove('mobile-drawer-open');
    document.getElementById('drawerBackdrop')?.classList.remove('is-open');
  }

  showToast(message) {
    let toast = document.getElementById('storeToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'storeToast';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>✓</span><span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Cart operations
  addToCart(productId, size, color, quantity = 1) {
    const prod = this.data.products.find(p => p.id === productId);
    if (!prod) return;

    const existingIndex = this.cart.findIndex(
      item => item.id === productId && item.size === size && item.color === color
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: prod.id,
        title: prod.title,
        price: prod.price,
        image: prod.gallery ? prod.gallery[0] : prod.image,
        size: size || 'M',
        color: color || (prod.colors ? prod.colors[0].name : 'Default'),
        quantity: quantity
      });
    }

    this.saveCart();
    this.showToast(`Added ${prod.title} (${size}) to your bag`);
    this.openCart();
  }

  updateQuantity(index, delta) {
    if (this.cart[index]) {
      this.cart[index].quantity += delta;
      if (this.cart[index].quantity <= 0) {
        this.cart.splice(index, 1);
      }
      this.saveCart();
    }
  }

  removeFromCart(index) {
    if (this.cart[index]) {
      const title = this.cart[index].title;
      this.cart.splice(index, 1);
      this.saveCart();
      this.showToast(`Removed ${title} from bag`);
    }
  }

  renderCartDrawer() {
    const container = document.getElementById('cartDrawerItems');
    const subtotalEl = document.getElementById('cartSubtotal');
    if (!container) return;

    if (this.cart.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 48px 12px; color: var(--color-text-secondary);">
          <div style="font-size: 3rem; margin-bottom: 12px; opacity:0.6;">🛍️</div>
          <h4 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 6px; color: var(--color-text-main);">Your bag is currently empty</h4>
          <p style="font-size: 0.88rem; margin-bottom: 24px;">Discover versatile staples and timeless essentials.</p>
          <button class="btn-primary" onclick="storeApp.closeCart(); storeApp.navigateTo('collection', 'shirts');">Explore Shirts</button>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = `$0.00`;
      return;
    }

    let subtotal = 0;
    container.innerHTML = `
      <div class="cart-items-list">
        ${this.cart.map((item, idx) => {
          const lineTotal = item.price * item.quantity;
          subtotal += lineTotal;
          return `
            <div class="cart-item-row">
              <div class="cart-item-img">
                <img src="${item.image}" alt="${item.title}" />
              </div>
              <div>
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-meta">Size: <strong>${item.size}</strong> | Color: <strong>${item.color}</strong></div>
                <div style="font-weight:700; font-size:0.92rem; color: var(--color-text-highlight);">$${item.price.toFixed(2)}</div>
                <div class="qty-control" style="margin-top:6px; scale: 0.85; transform-origin: left;">
                  <button class="qty-btn" onclick="storeApp.updateQuantity(${idx}, -1)">-</button>
                  <span class="qty-input">${item.quantity}</span>
                  <button class="qty-btn" onclick="storeApp.updateQuantity(${idx}, 1)">+</button>
                </div>
              </div>
              <div style="text-align:right;">
                <button onclick="storeApp.removeFromCart(${idx})" style="color: #999; font-size:1.1rem; padding: 4px;" title="Remove">✕</button>
                <div style="font-size:0.92rem; font-weight:700; margin-top:28px;">$${lineTotal.toFixed(2)}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  }

  handleSearch(query) {
    const resultsContainer = document.getElementById('searchResultsArea');
    if (!resultsContainer) return;

    const trimmed = (query || '').trim().toLowerCase();
    if (!trimmed) {
      resultsContainer.innerHTML = `<div style="text-align:center; padding: 30px; color: var(--color-text-secondary);">Start typing to search products, styles, and categories...</div>`;
      return;
    }

    const matches = this.data.products.filter(p => 
      p.title.toLowerCase().includes(trimmed) ||
      p.category.toLowerCase().includes(trimmed) ||
      p.shortDesc.toLowerCase().includes(trimmed)
    );

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align:center; padding: 36px; color: var(--color-text-secondary);">
          <p>No products matched "<strong>${trimmed}</strong>".</p>
          <p style="font-size:0.85rem; margin-top:4px;">Try searching for "Shirt", "Black", "Olive", or "Kurta".</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-top: 20px;">
        ${matches.map(p => `
          <div class="product-card" style="cursor:pointer;" onclick="storeApp.closeSearch(); storeApp.navigateTo('product', '${p.id}')">
            <div class="product-image-wrap" style="aspect-ratio: 1/1.2;">
              <img src="${p.image}" alt="${p.title}" />
            </div>
            <div class="product-card-body" style="padding:12px;">
              <h4 style="font-size:0.92rem; margin-bottom:4px;">${p.title}</h4>
              <div style="font-weight:700; font-size:0.95rem; color: var(--color-text-highlight);">$${p.price.toFixed(2)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderCurrentView() {
    const routeInfo = this.parseCurrentUrlRoute();
    this.navigateTo(routeInfo.view, routeInfo.param, false);
  }

  // Page 1: Homepage
  renderHome() {
    const main = document.getElementById('mainContentArea');
    if (!main) return;

    main.innerHTML = `
      <!-- Section A: Hero Banner with Uploaded Reference Video as the Complete Banner -->
      <section class="hero-section hero-silk-section">
        <!-- Exact Uploaded Flowing Silk Reference Video Container -->
        <div class="hero-video-stage">
          <video 
            id="heroSilkVideo" 
            class="hero-silk-video" 
            autoplay 
            loop 
            muted 
            playsinline 
            webkit-playsinline 
            preload="auto"
            poster="assets/banners/hero_silk_poster.jpg">
            <source src="assets/banners/hero_silk_bg.mp4" type="video/mp4" />
          </video>
          <!-- Precisely aligned, fully clickable transparent SHOP NOW button matching video button coordinates -->
          <a href="#/collection/new_arrivals" 
             data-route="collection" 
             data-param="new_arrivals" 
             class="hero-video-shopnow-button" 
             aria-label="Shop New Arrivals Collection" 
             title="Shop Now"></a>
        </div>
      </section>

      <!-- Premium 5-Category Cards Section (Featured Collections Bar) -->
      <section class="quick-categories-bar premium-categories-bar">
        <div class="container" style="position:relative;">
          <div class="quick-cats-wrapper">
            <div class="quick-cats-list premium-cats-grid" id="quickCatsList">
              <a href="#/collection/shirts" data-route="collection" data-param="shirts" class="quick-cat-item premium-cat-card" aria-label="Explore Shirts Category">
                <div class="premium-cat-card-media">
                  <img src="assets/categories/premium/cat_card_shirts.png" alt="Shirts Collection" loading="lazy" />
                </div>
              </a>
              <a href="#/collection/tshirts" data-route="collection" data-param="tshirts" class="quick-cat-item premium-cat-card" aria-label="Explore T-Shirts Category">
                <div class="premium-cat-card-media">
                  <img src="assets/categories/premium/cat_card_tshirts.png" alt="T-Shirts Collection" loading="lazy" />
                </div>
              </a>
              <a href="#/collection/pants" data-route="collection" data-param="pants" class="quick-cat-item premium-cat-card" aria-label="Explore Pants Category">
                <div class="premium-cat-card-media">
                  <img src="assets/categories/premium/cat_card_pants.png" alt="Pants Collection" loading="lazy" />
                </div>
              </a>
              <a href="#/collection/jackets" data-route="collection" data-param="jackets" class="quick-cat-item premium-cat-card" aria-label="Explore Jackets Category">
                <div class="premium-cat-card-media">
                  <img src="assets/categories/premium/cat_card_jackets.png" alt="Jackets Collection" loading="lazy" />
                </div>
              </a>
              <a href="#/collection/hoodies" data-route="collection" data-param="hoodies" class="quick-cat-item premium-cat-card" aria-label="Explore Hoodies Category">
                <div class="premium-cat-card-media">
                  <img src="assets/categories/premium/cat_card_hoodies.png" alt="Hoodies Collection" loading="lazy" />
                </div>
              </a>
            </div>

            <!-- Animated Right Chevron Indicator Button -->
            <button class="cat-scroll-arrow-btn" id="catScrollArrowBtn" aria-label="Scroll to next categories" title="Explore more categories">
              <svg class="cat-scroll-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </section>

      <!-- Section B: Shop by Collection (Find Your Occasion) - 8 Arched Cards -->
      <section class="shop-by-collection">
        <div class="container-wide">
          <div class="section-header">
            <h2 class="section-title">Find your <em>occasion</em></h2>
            <p class="section-subtitle">From everyday wear to standout style, every piece is crafted for you.</p>
            <a href="#/collection/shirts" data-route="collection" data-param="shirts" class="section-action-link">VIEW ALL COLLECTIONS →</a>
          </div>

          <div class="collections-arch-grid">
            ${this.data.categories.filter(c => c.id !== 'new_arrivals' && c.id !== 'sale').map(cat => `
              <a href="#/collection/${cat.id}" data-route="collection" data-param="${cat.id}" class="arch-card">
                <div class="arch-card-image-box">
                  <img src="${cat.image}" alt="${cat.title}" loading="lazy" />
                </div>
                <h3 class="arch-card-title">${cat.title}</h3>
                <p class="arch-card-desc">${cat.subtitle}</p>
                <span class="arch-card-cta">SHOP NOW →</span>
              </a>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Interactive 3D Showcase Callout (Styled exactly to Reference Image 2) -->
      <section class="threed-feature-section">
        <div class="container">
          <div class="threed-feature-wrapper">
            <!-- Left: Card matching reference image 2 -->
            <div class="threed-luxury-card">
              <div class="threed-stage-viewport" id="threedStageViewport">
                <!-- Realistic Craftsmanship Product Stage: Exactly ONE centered shirt with orbit rings -->
                <div class="craftsmanship-stage-content">
                  <img id="craftsmanshipShirtImg" src="assets/products/craftsmanship_olive_stage_single.png" alt="GENSCORNAR Tailored Casual Shirt" class="craftsmanship-stage-img" />
                </div>
              </div>

              <!-- Bottom Bar: SELECT COLOR with Pill Rings matching reference image 2 -->
              <div class="threed-bottom-bar">
                <span class="threed-color-label">SELECT COLOR:</span>
                <div class="threed-color-swatches">
                  <button class="threed-color-pill active" style="--swatch-hex: #4C4B37;" data-color-key="olive" title="Olive Green"></button>
                  <button class="threed-color-pill" style="--swatch-hex: #FAF8F5;" data-color-key="white" title="Textured White"></button>
                  <button class="threed-color-pill" style="--swatch-hex: #141312;" data-color-key="black" title="Classic Black"></button>
                  <button class="threed-color-pill" style="--swatch-hex: #1B2A4A;" data-color-key="navy" title="Navy Blue"></button>
                </div>
              </div>
            </div>

            <div>
              <span class="section-tag" style="letter-spacing:0.25em;">PREMIUM CRAFTSMANSHIP</span>
              <h2 class="section-title" style="text-align:left; font-size: 2.7rem; line-height: 1.15; margin-bottom: 14px;">Redefining<br><em style="font-style:italic; color:var(--color-text-highlight);">Everyday Style</em></h2>
              <p style="color:var(--color-text-secondary); margin-bottom:24px; line-height:1.7; font-size: 1.05rem;">
                Experience premium comfort, modern design, and timeless elegance in every detail.
              </p>
              <ul style="list-style:none; display:flex; flex-direction:column; gap:14px; margin-bottom:32px;">
                <li style="display:flex; align-items:center; gap:10px; font-size:0.94rem; font-weight:600; color:var(--color-text-main);">
                  <span style="color:var(--color-accent-gold); font-size:1.25rem;">✓</span> 100% Long-Staple Combed Cotton
                </li>
                <li style="display:flex; align-items:center; gap:10px; font-size:0.94rem; font-weight:600; color:var(--color-text-main);">
                  <span style="color:var(--color-accent-gold); font-size:1.25rem;">✓</span> Breathable & Lightweight
                </li>
                <li style="display:flex; align-items:center; gap:10px; font-size:0.94rem; font-weight:600; color:var(--color-text-main);">
                  <span style="color:var(--color-accent-gold); font-size:1.25rem;">✓</span> Custom Horn-Effect Contrast Buttons
                </li>
              </ul>
              <div style="display:flex; gap:16px; flex-wrap:wrap;">
                <a href="#" data-route="product" data-param="olive-green-casual-shirt" class="btn-primary" style="padding: 14px 34px;">VIEW OLIVE SHIRT</a>
                <a href="#" data-route="collection" data-param="shirts" class="btn-secondary" style="padding: 14px 34px;">EXPLORE ALL SHIRTS</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section C: New Arrivals Grid -->
      <section style="padding: 72px 0; background: var(--color-bg-primary);">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">New Drops</span>
            <h2 class="section-title">New <em>Arrivals</em></h2>
            <p class="section-subtitle">Freshly tailored garments cut from premium fabrics for the discerning gentleman.</p>
          </div>

          <div class="products-grid">
            ${this.renderProductCards(this.data.products.slice(0, 4))}
          </div>
        </div>
      </section>

      <!-- Section E: Editorial Fashion Banner -->
      <section class="editorial-section">
        <div class="container">
          <div class="editorial-layout">
            <div class="editorial-image-frame">
              <img src="assets/categories/cat_blazers.jpg" alt="Editorial Fashion - Style That Speaks" />
            </div>
            <div class="editorial-copy">
              <span class="editorial-tag">Editorial FW26</span>
              <h2 class="editorial-heading">Style That <em>Speaks</em></h2>
              <p class="editorial-text">
                Discover timeless essentials designed for everyday confidence. At JEANSCORNER, we believe true sophistication lies in restraint: tailored silhouettes, immaculate natural textiles, and muted, grounded earth tones that command silent respect.
              </p>
              <a href="#" data-route="collection" data-param="blazers" class="btn-primary">Shop Tailored Collection</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Section G: Brand Statement -->
      <section class="brand-statement-section">
        <div class="container">
          <div class="brand-statement-inner">
            <span class="section-tag">Our Ethos</span>
            <h2 class="brand-statement-title">Redefining Everyday Style</h2>
            <p class="brand-statement-text">
              JEANSCORNER brings together modern design, versatile essentials, and timeless style for the contemporary man. Each piece is designed to be effortlessly combined, elevating your everyday ritual with unyielding poise.
            </p>
          </div>
        </div>
      </section>

      <!-- Section H: Newsletter -->
      <section class="newsletter-section">
        <div class="container">
          <div class="newsletter-box">
            <span class="section-tag">Exclusive Access</span>
            <h2 class="section-title">Stay in <em>Style</em></h2>
            <p class="section-subtitle">Sign up for updates on new arrivals, collections, and seasonal private previews.</p>
            <form class="newsletter-form" onsubmit="event.preventDefault(); storeApp.showToast('Thank you for subscribing to JEANSCORNER private updates.'); this.reset();">
              <input type="email" required placeholder="Enter your email address" class="newsletter-input" aria-label="Email Address" />
              <button type="submit" class="btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    `;

    // Initialize craftsmanship colorways, video playback, and category scroll arrow
    setTimeout(() => {
      this.initCraftsmanshipColorways();
      this.initCategoryScrollArrow();
      const heroVideo = document.getElementById('heroSilkVideo');
      if (heroVideo) {
        heroVideo.play().catch(err => {
          console.log('Autoplay deferred until user interaction:', err);
        });
      }
    }, 50);
  }

  initCategoryScrollArrow() {
    const list = document.getElementById('quickCatsList');
    const arrowBtn = document.getElementById('catScrollArrowBtn');
    if (!list || !arrowBtn) return;

    const updateArrowVisibility = () => {
      const maxScrollLeft = list.scrollWidth - list.clientWidth;
      // If content isn't scrollable (e.g. wide desktop where all cards fit), hide arrow
      if (maxScrollLeft <= 8) {
        arrowBtn.classList.add('is-hidden');
        return;
      }
      // If user has scrolled within 10px of the end, fade out
      if (list.scrollLeft >= maxScrollLeft - 10) {
        arrowBtn.classList.add('is-hidden');
      } else {
        arrowBtn.classList.remove('is-hidden');
      }
    };

    arrowBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Scroll by approximately one card width + gap
      const firstCard = list.querySelector('.premium-cat-card');
      const step = firstCard ? (firstCard.offsetWidth + 16) : 180;
      list.scrollBy({ left: step, behavior: 'smooth' });
    });

    list.addEventListener('scroll', updateArrowVisibility, { passive: true });
    window.addEventListener('resize', updateArrowVisibility, { passive: true });

    // Initial check
    setTimeout(updateArrowVisibility, 100);
  }

  initCraftsmanshipColorways() {
    const shirtImg = document.getElementById('craftsmanshipShirtImg');
    const colorMap = {
      olive: 'assets/products/craftsmanship_olive_stage_single.png',
      white: 'assets/products/craftsmanship_white_stage_single.png',
      black: 'assets/products/craftsmanship_black_stage_single.png',
      navy: 'assets/products/craftsmanship_navy_stage_single.png'
    };

    document.querySelectorAll('.threed-color-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.threed-color-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const colorKey = btn.getAttribute('data-color-key') || 'olive';
        if (shirtImg && colorMap[colorKey]) {
          shirtImg.src = colorMap[colorKey];
        }
      });
    });
  }

  // Collection Landing Page (Supports all categories: shirts, tshirts, pants, jackets, hoodies, blazers, kurtas, trackpants, new_arrivals, sale)
  renderCollection(categoryId = 'shirts') {
    const main = document.getElementById('mainContentArea');
    if (!main) return;

    let category = this.data.categories.find(c => c.id === categoryId);
    if (!category) {
      category = this.data.categories.find(c => c.id === 'shirts') || this.data.categories[0];
    }

    let categoryProducts = [];
    if (categoryId === 'new_arrivals') {
      categoryProducts = this.data.products.filter(p => p.isNew || p.featured);
    } else if (categoryId === 'sale') {
      categoryProducts = this.data.products.filter(p => p.discount || (p.compareAtPrice && p.compareAtPrice > p.price));
    } else {
      categoryProducts = this.data.products.filter(p => p.category === categoryId);
    }

    const bannerSrc = category.banner || 'assets/banners/banner_shirts.jpg';

    main.innerHTML = `
      <!-- Breadcrumbs -->
      <div class="container">
        <div class="breadcrumbs-bar">
          <a href="#" data-route="home">Home</a>
          <span class="separator">></span>
          <span class="current">${category.title}</span>
        </div>
      </div>

      <!-- Collection Hero Banner -->
      <section class="collection-hero-banner">
        <img src="${bannerSrc}" alt="${category.title} - Jeanscorner Luxury Collection" />
      </section>

      <!-- Subcategories (Displayed for shirts) -->
      ${categoryId === 'shirts' ? `
      <section class="subcategories-section">
        <div class="container">
          <div class="subcategories-grid">
            ${this.data.shirtSubcategories.map(sub => `
              <div class="subcat-card">
                <img src="${sub.image}" alt="${sub.title}" />
                <div class="subcat-card-overlay">
                  <h3 class="subcat-card-title">${sub.title}</h3>
                  <a href="#/subcollection/${sub.id}" data-route="subcollection" data-param="${sub.id}" class="subcat-card-link">SHOP NOW →</a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Collection Products & Filtering Area -->
      <section style="padding: 30px 0 60px 0;">
        <div class="container">
          <div class="collection-toolbar">
            <div style="font-size: 0.95rem; color: var(--color-text-secondary);">
              Showing <strong style="color: var(--color-text-main);" id="filteredProductsCount">${categoryProducts.length}</strong> items in <strong>${category.title}</strong>
            </div>

            <div style="display:flex; align-items:center; gap: 10px;">
              <button class="mobile-filter-trigger-btn" onclick="storeApp.toggleMobileFilters()">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                <span>Filters</span>
              </button>

              <label for="collectionSort" class="sort-label-text" style="font-size:0.85rem; font-weight:600; text-transform:uppercase;">Sort by:</label>
              <select id="collectionSort" class="toolbar-sort-select" onchange="storeApp.applyCatalogFilters('${categoryId}')">
                <option value="featured">Featured</option>
                <option value="best_selling">Best Selling</option>
                <option value="price_low_high">Price, low to high</option>
                <option value="price_high_low">Price, high to low</option>
                <option value="alpha_az">Alphabetically, A–Z</option>
                <option value="alpha_za">Alphabetically, Z–A</option>
              </select>
            </div>
          </div>

          <div class="collection-main-layout">
            <!-- Left Sidebar Filters -->
            <aside class="collection-sidebar">
              <div class="filter-block">
                <div class="filter-title">Availability</div>
                <div class="filter-options">
                  <label class="filter-checkbox-label">
                    <input type="checkbox" id="filterInStock" checked onchange="storeApp.applyCatalogFilters('${categoryId}')" /> In Stock (${categoryProducts.length})
                  </label>
                </div>
              </div>

              <div class="filter-block">
                <div class="filter-title">Price Range</div>
                <div style="display:flex; gap:8px; align-items:center;">
                  <span style="font-size:0.85rem; color:var(--color-text-secondary);">$500</span>
                  <input type="range" id="priceRangeSlider" min="500" max="5000" step="100" value="${this.activeFilters.priceMax < 10000 ? this.activeFilters.priceMax : 5000}" oninput="storeApp.handlePriceSlider(this.value, '${categoryId}')" style="flex-grow:1; accent-color:var(--color-text-main); cursor:pointer;" />
                  <span style="font-size:0.85rem; font-weight:700;" id="priceFilterVal">$${this.activeFilters.priceMax < 10000 ? this.activeFilters.priceMax : 5000}</span>
                </div>
              </div>

              <div class="filter-block">
                <div class="filter-title">Size</div>
                <div class="filter-options">
                  <label class="filter-checkbox-label"><input type="checkbox" class="filter-size-cb" value="S" checked onchange="storeApp.applyCatalogFilters('${categoryId}')" /> S</label>
                  <label class="filter-checkbox-label"><input type="checkbox" class="filter-size-cb" value="M" checked onchange="storeApp.applyCatalogFilters('${categoryId}')" /> M</label>
                  <label class="filter-checkbox-label"><input type="checkbox" class="filter-size-cb" value="L" checked onchange="storeApp.applyCatalogFilters('${categoryId}')" /> L</label>
                  <label class="filter-checkbox-label"><input type="checkbox" class="filter-size-cb" value="XL" checked onchange="storeApp.applyCatalogFilters('${categoryId}')" /> XL</label>
                  <label class="filter-checkbox-label"><input type="checkbox" class="filter-size-cb" value="XXL" checked onchange="storeApp.applyCatalogFilters('${categoryId}')" /> XXL</label>
                </div>
              </div>

              <div class="filter-block">
                <div class="filter-title">Color</div>
                <div class="color-swatch-list">
                  <button type="button" class="filter-swatch-btn ${this.activeFilters.colors.includes('olive') ? 'active' : ''}" data-color="olive" style="--swatch-hex:#4C4B37;" title="Olive" onclick="storeApp.toggleColorFilter(this, '${categoryId}')"></button>
                  <button type="button" class="filter-swatch-btn ${this.activeFilters.colors.includes('white') ? 'active' : ''}" data-color="white" style="--swatch-hex:#FAF8F5;" title="White" onclick="storeApp.toggleColorFilter(this, '${categoryId}')"></button>
                  <button type="button" class="filter-swatch-btn ${this.activeFilters.colors.includes('black') ? 'active' : ''}" data-color="black" style="--swatch-hex:#141312;" title="Black" onclick="storeApp.toggleColorFilter(this, '${categoryId}')"></button>
                  <button type="button" class="filter-swatch-btn ${this.activeFilters.colors.includes('navy') ? 'active' : ''}" data-color="navy" style="--swatch-hex:#1B2A4A;" title="Navy" onclick="storeApp.toggleColorFilter(this, '${categoryId}')"></button>
                </div>
              </div>

              <div style="margin-top:20px;">
                <button type="button" class="btn-secondary" style="width:100%; padding:10px 14px; font-size:0.8rem;" onclick="storeApp.resetCatalogFilters('${categoryId}')">
                  RESET FILTERS
                </button>
              </div>
            </aside>

            <!-- Main Product Grid -->
            <div>
              <div class="products-grid" id="categoryProductsGrid">
                ${this.renderProductCards(categoryProducts)}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // Page 4: Casual Shirts Subcollection Page
  renderSubcollection(subcatId = 'casual_shirts') {
    const main = document.getElementById('mainContentArea');
    if (!main) return;

    // Filter products belonging to casual_shirts (or shirts)
    const subcatProducts = this.data.products.filter(p => p.subCategory === subcatId || p.category === 'shirts');

    main.innerHTML = `
      <!-- Breadcrumb -->
      <div class="container">
        <div class="breadcrumbs-bar">
          <a href="#" data-route="home">Home</a>
          <span class="separator">></span>
          <a href="#" data-route="collection" data-param="shirts">Shirts</a>
          <span class="separator">></span>
          <span class="current">Casual Shirts</span>
        </div>
      </div>

      <!-- Casual Shirts Hero Banner (approved page 4 asset) -->
      <section class="collection-hero-banner">
        <img src="assets/banners/banner_casual_shirts.jpg" alt="Casual Shirts Relax in Style - Effortless fashion for every occasion" />
      </section>

      <!-- Casual Shirts Grid & Filter Toolbar (Page 4 Layout) -->
      <section style="padding: 24px 0 60px 0;">
        <div class="container">
          <div class="collection-toolbar">
            <div style="font-size: 0.95rem; color: var(--color-text-secondary);">
              Showing <strong style="color: var(--color-text-main);" id="filteredProductsCount">${subcatProducts.length}</strong> items in <strong>Casual Shirts</strong>
            </div>

            <div style="display:flex; align-items:center; gap: 10px;">
              <button class="mobile-filter-trigger-btn" onclick="storeApp.toggleMobileFilters()">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                <span>Filters</span>
              </button>

              <label for="subcatSort" class="sort-label-text" style="font-size:0.85rem; font-weight:600; text-transform:uppercase;">Sort by:</label>
              <select id="subcatSort" class="toolbar-sort-select" onchange="storeApp.applyCatalogFilters('casual_shirts')">
                <option value="best_selling">Best Selling</option>
                <option value="featured">Featured</option>
                <option value="price_low_high">Price, low to high</option>
                <option value="price_high_low">Price, high to low</option>
                <option value="alpha_az">Alphabetically, A–Z</option>
                <option value="alpha_za">Alphabetically, Z–A</option>
              </select>
            </div>
          </div>

          <div class="collection-main-layout">
            <!-- Left Sidebar (matching page 4 reference) -->
            <aside class="collection-sidebar">
              <div class="filter-block">
                <div class="filter-title">
                  <span>Price Range</span>
                </div>
                <div style="display:flex; gap:8px; align-items:center; margin-top:8px;">
                  <span style="font-size:0.85rem; color:var(--color-text-secondary);">$500</span>
                  <input type="range" id="priceRangeSlider" min="500" max="5000" step="100" value="${this.activeFilters.priceMax < 10000 ? this.activeFilters.priceMax : 5000}" oninput="storeApp.handlePriceSlider(this.value, 'casual_shirts')" style="flex-grow:1; accent-color:var(--color-text-main); cursor:pointer;" />
                  <span style="font-size:0.85rem; font-weight:700;" id="priceFilterVal">$${this.activeFilters.priceMax < 10000 ? this.activeFilters.priceMax : 5000}</span>
                </div>
              </div>

              <div class="filter-block">
                <div class="filter-title">
                  <span>Size</span>
                </div>
                <div class="filter-options">
                  <label class="filter-checkbox-label"><input type="checkbox" class="filter-size-cb" value="S" checked onchange="storeApp.applyCatalogFilters('casual_shirts')" /> S</label>
                  <label class="filter-checkbox-label"><input type="checkbox" class="filter-size-cb" value="M" checked onchange="storeApp.applyCatalogFilters('casual_shirts')" /> M</label>
                  <label class="filter-checkbox-label"><input type="checkbox" class="filter-size-cb" value="L" checked onchange="storeApp.applyCatalogFilters('casual_shirts')" /> L</label>
                  <label class="filter-checkbox-label"><input type="checkbox" class="filter-size-cb" value="XL" checked onchange="storeApp.applyCatalogFilters('casual_shirts')" /> XL</label>
                </div>
              </div>

              <div class="filter-block">
                <div class="filter-title">
                  <span>Color</span>
                </div>
                <div class="color-swatch-list">
                  <button type="button" class="filter-swatch-btn ${this.activeFilters.colors.includes('black') ? 'active' : ''}" data-color="black" style="--swatch-hex:#141312;" title="Black" onclick="storeApp.toggleColorFilter(this, 'casual_shirts')"></button>
                  <button type="button" class="filter-swatch-btn ${this.activeFilters.colors.includes('navy') ? 'active' : ''}" data-color="navy" style="--swatch-hex:#1B2A4A;" title="Navy" onclick="storeApp.toggleColorFilter(this, 'casual_shirts')"></button>
                  <button type="button" class="filter-swatch-btn ${this.activeFilters.colors.includes('white') ? 'active' : ''}" data-color="white" style="--swatch-hex:#FAF8F5;" title="White" onclick="storeApp.toggleColorFilter(this, 'casual_shirts')"></button>
                  <button type="button" class="filter-swatch-btn ${this.activeFilters.colors.includes('olive') ? 'active' : ''}" data-color="olive" style="--swatch-hex:#4C4B37;" title="Olive" onclick="storeApp.toggleColorFilter(this, 'casual_shirts')"></button>
                </div>
              </div>

              <div style="margin-top:20px;">
                <button type="button" class="btn-secondary" style="width:100%; padding:10px 14px; font-size:0.8rem;" onclick="storeApp.resetCatalogFilters('casual_shirts')">
                  RESET FILTERS
                </button>
              </div>
            </aside>

            <!-- Product Cards (The 4 verified reference shirts) -->
            <div>
              <div class="products-grid" id="subcatProductsGrid">
                ${this.renderProductCards(subcatProducts.slice(0, 4))}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // Page 5: Product Detail Page (PDP)
  renderProduct(productId = 'olive-green-casual-shirt') {
    const main = document.getElementById('mainContentArea');
    if (!main) return;

    const prod = this.data.products.find(p => p.id === productId) || this.data.products[0];
    this.selectedProduct = prod;
    this.activeVariant = {
      color: prod.colors ? prod.colors[0].name : 'Default',
      size: 'S',
      quantity: 1
    };

    const prodCategory = this.data.categories.find(c => c.id === prod.category) || { title: 'Shirts', id: 'shirts' };
    const hasSubcat = prod.subCategory === 'casual_shirts';

    main.innerHTML = `
      <div class="container">
        <div class="breadcrumbs-bar">
          <a href="#" data-route="home">Home</a>
          <span class="separator">></span>
          <a href="#/collection/${prodCategory.id}" data-route="collection" data-param="${prodCategory.id}">${prodCategory.title}</a>
          ${hasSubcat ? `
            <span class="separator">></span>
            <a href="#/subcollection/casual_shirts" data-route="subcollection" data-param="casual_shirts">Casual Shirts</a>
          ` : ''}
          <span class="separator">></span>
          <span class="current">${prod.title}</span>
        </div>
      </div>

      <section class="pdp-section">
        <div class="container">
          <div class="pdp-grid">
            <!-- Left Side: Thumbnails & Large Main Image -->
            <div class="pdp-gallery-container">
              <div class="pdp-thumbs-col">
                ${(prod.gallery || [prod.image]).map((img, i) => `
                  <div class="pdp-thumb-item ${i === 0 ? 'active' : ''}" onclick="storeApp.switchPdpImage('${img}', this)">
                    <img src="${img}" alt="${prod.title} View ${i + 1}" />
                  </div>
                `).join('')}
              </div>

              <div class="pdp-main-image-wrap">
                <img id="pdpMainImg" src="${prod.mainImage || prod.image}" alt="${prod.title}" />
                ${prod.discount ? `<span class="pdp-badge">${prod.discount}</span>` : ''}
              </div>
            </div>

            <!-- Right Side: Details, Selectors, Add to Cart -->
            <div class="pdp-info-panel">
              <h1 class="pdp-title">${prod.title}</h1>

              <div class="pdp-rating-row">
                <span class="stars">★★★★★</span>
                <span style="font-weight:700; color:var(--color-text-main);">${prod.rating}</span>
                <span>(${prod.reviewsCount.toLocaleString()} reviews)</span>
              </div>

              <div class="pdp-price-row">
                <span class="pdp-current-price">$${prod.price.toFixed(2)}</span>
                ${prod.compareAtPrice ? `<span class="pdp-compare-price">$${prod.compareAtPrice.toFixed(2)}</span>` : ''}
                ${prod.discount ? `<span class="pdp-discount-pill">${prod.discount}</span>` : ''}
              </div>

              <div class="pdp-tagline-quote">
                Elegant. Comfortable. Always in Style.
              </div>

              <!-- Color Selection -->
              ${prod.colors ? `
                <div class="pdp-option-group">
                  <div class="pdp-option-header">
                    <span>Color: <strong id="pdpSelectedColorName" style="color:var(--color-text-main);">${prod.colors[0].name}</strong></span>
                  </div>
                  <div class="color-swatch-list">
                    ${prod.colors.map((c, i) => `
                      <button class="filter-swatch ${i === 0 ? 'active' : ''}" 
                        style="background: ${c.hex}; width:32px; height:32px;" 
                        title="${c.name}"
                        onclick="storeApp.selectPdpColor('${c.name}', this)">
                      </button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Size Selection -->
              <div class="pdp-option-group">
                <div class="pdp-option-header">
                  <span>Size: <strong id="pdpSelectedSizeName">S</strong></span>
                  <span class="size-guide-btn" onclick="storeApp.showSizeGuide()">Size guide</span>
                </div>
                <div class="pdp-sizes-list">
                  ${prod.sizes.map(s => `
                    <button class="pdp-size-btn ${s.size === 'S' ? 'active' : ''} ${!s.available ? 'sold-out' : ''}"
                      ${!s.available ? 'disabled' : ''}
                      onclick="storeApp.selectPdpSize('${s.size}', this)">
                      ${s.size}
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Purchase Actions -->
              <div class="pdp-purchase-actions">
                <div class="pdp-qty-row">
                  <span style="font-size:0.85rem; font-weight:600; text-transform:uppercase;">Quantity:</span>
                  <div class="qty-control">
                    <button class="qty-btn" onclick="storeApp.changePdpQty(-1)">-</button>
                    <span class="qty-input" id="pdpQtyVal">1</span>
                    <button class="qty-btn" onclick="storeApp.changePdpQty(1)">+</button>
                  </div>
                </div>

                <button class="btn-add-to-cart" onclick="storeApp.handlePdpAddToCart()">
                  ADD TO CART
                </button>

                <button class="btn-buy-now" onclick="storeApp.handlePdpBuyNow()">
                  <span>🛍️</span>
                  <span>BUY IT NOW</span>
                </button>
              </div>

              <!-- Product Features Bar (as seen on Page 5 screenshot) -->
              <div class="pdp-features-row">
                <div class="pdp-feat-item">
                  <div class="pdp-feat-icon">🛡️</div>
                  <div class="pdp-feat-text">
                    <h5>Premium Quality</h5>
                    <p>100% fine cotton</p>
                  </div>
                </div>

                <div class="pdp-feat-item">
                  <div class="pdp-feat-icon">👔</div>
                  <div class="pdp-feat-text">
                    <h5>Perfect Fit</h5>
                    <p>Tailored silhouette</p>
                  </div>
                </div>

                <div class="pdp-feat-item">
                  <div class="pdp-feat-icon">🍃</div>
                  <div class="pdp-feat-text">
                    <h5>Breathable Fabric</h5>
                    <p>All-day ventilation</p>
                  </div>
                </div>
              </div>

              <!-- Collapsible Information Accordions -->
              <div class="accordion-wrapper">
                <div class="accordion-item open">
                  <div class="accordion-header" onclick="storeApp.toggleAccordion(this)">
                    <span>Description</span>
                    <span class="acc-icon">+</span>
                  </div>
                  <div class="accordion-content">
                    ${prod.accordion?.description || prod.shortDesc}
                  </div>
                </div>

                <div class="accordion-item">
                  <div class="accordion-header" onclick="storeApp.toggleAccordion(this)">
                    <span>Fabric and Materials</span>
                    <span class="acc-icon">+</span>
                  </div>
                  <div class="accordion-content">
                    ${prod.accordion?.materials || '100% Combed Cotton. Hand-stitched collar stand and reinforced placket.'}
                  </div>
                </div>

                <div class="accordion-item">
                  <div class="accordion-header" onclick="storeApp.toggleAccordion(this)">
                    <span>Fit and Sizing</span>
                    <span class="acc-icon">+</span>
                  </div>
                  <div class="accordion-content">
                    ${prod.accordion?.fitSizing || 'Tailored masculine cut. Designed to fit true to size.'}
                  </div>
                </div>

                <div class="accordion-item">
                  <div class="accordion-header" onclick="storeApp.toggleAccordion(this)">
                    <span>Care Instructions</span>
                    <span class="acc-icon">+</span>
                  </div>
                  <div class="accordion-content">
                    ${prod.accordion?.care || 'Machine wash cold with like colors. Warm iron.'}
                  </div>
                </div>

                <div class="accordion-item">
                  <div class="accordion-header" onclick="storeApp.toggleAccordion(this)">
                    <span>Shipping and Returns</span>
                    <span class="acc-icon">+</span>
                  </div>
                  <div class="accordion-content">
                    ${prod.accordion?.shipping} ${prod.accordion?.returns}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Related Products Section -->
          <div style="margin-top: 72px; padding-top: 48px; border-top: 1px solid var(--color-border);">
            <div class="section-header" style="text-align:left;">
              <span class="section-tag">Complete The Ensemble</span>
              <h2 class="section-title">Related <em>Styles</em></h2>
            </div>
            <div class="products-grid">
              ${this.renderProductCards(this.data.products.filter(p => p.id !== prod.id).slice(0, 4))}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  switchPdpImage(src, element) {
    document.querySelectorAll('.pdp-thumb-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    const mainImg = document.getElementById('pdpMainImg');
    if (mainImg) {
      mainImg.src = src;
    }
  }

  selectPdpColor(name, element) {
    document.querySelectorAll('.filter-swatch').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    this.activeVariant.color = name;
    const label = document.getElementById('pdpSelectedColorName');
    if (label) label.textContent = name;
  }

  selectPdpSize(size, element) {
    document.querySelectorAll('.pdp-size-btn').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    this.activeVariant.size = size;
    const label = document.getElementById('pdpSelectedSizeName');
    if (label) label.textContent = size;
  }

  changePdpQty(delta) {
    let next = this.activeVariant.quantity + delta;
    if (next < 1) next = 1;
    if (next > 20) next = 20;
    this.activeVariant.quantity = next;
    const qtyVal = document.getElementById('pdpQtyVal');
    if (qtyVal) qtyVal.textContent = next;
  }

  handlePdpAddToCart() {
    if (!this.selectedProduct) return;
    this.addToCart(
      this.selectedProduct.id,
      this.activeVariant.size,
      this.activeVariant.color,
      this.activeVariant.quantity
    );
  }

  handlePdpBuyNow() {
    if (!this.selectedProduct) return;
    this.addToCart(
      this.selectedProduct.id,
      this.activeVariant.size,
      this.activeVariant.color,
      this.activeVariant.quantity
    );
    this.openCheckoutModal();
  }

  openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const backdrop = document.getElementById('drawerBackdrop');
    if (!modal) return;

    this.closeCart();
    this.closeSearch();
    this.closeMobileNav();

    // Populate checkout items summary
    const itemsList = document.getElementById('checkoutItemsList');
    const subtotalEl = document.getElementById('chkSummarySubtotal');
    const totalEl = document.getElementById('chkSummaryTotal');
    const formContent = document.getElementById('checkoutFormContent');
    const successContent = document.getElementById('checkoutSuccessContent');

    if (formContent) formContent.style.display = 'block';
    if (successContent) successContent.style.display = 'none';

    // If cart is empty, add the selected or default product so user can experience full checkout
    if (this.cart.length === 0) {
      const prodToAdd = this.selectedProduct || this.data.products[0];
      this.cart.push({
        id: prodToAdd.id,
        title: prodToAdd.title,
        price: prodToAdd.price,
        image: prodToAdd.gallery ? prodToAdd.gallery[0] : prodToAdd.image,
        size: this.activeVariant?.size || 'M',
        color: this.activeVariant?.color || (prodToAdd.colors ? prodToAdd.colors[0].name : 'Default'),
        quantity: this.activeVariant?.quantity || 1
      });
      this.saveCart();
    }

    let subtotal = 0;
    if (itemsList) {
      itemsList.innerHTML = this.cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
          <div style="display:flex; align-items:center; gap:12px; padding:8px 0; border-bottom:1px solid rgba(0,0,0,0.06);">
            <img src="${item.image}" alt="${item.title}" style="width:48px; height:58px; object-fit:cover; border-radius:4px; border:1px solid var(--color-border);" />
            <div style="flex-grow:1; min-width:0;">
              <div style="font-weight:600; font-size:0.86rem; color:var(--color-text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.title}</div>
              <div style="font-size:0.75rem; color:var(--color-text-secondary);">Qty: ${item.quantity} · Size: ${item.size || 'M'} · ${item.color || 'Standard'}</div>
            </div>
            <div style="font-weight:700; font-size:0.88rem; color:var(--color-text-highlight);">₹${itemTotal.toLocaleString('en-IN')}</div>
          </div>
        `;
      }).join('');
    }

    const deliveryFee = subtotal >= 999 ? 0 : (subtotal > 0 ? 99 : 0);
    const total = subtotal + deliveryFee;

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    const shippingEl = document.getElementById('chkSummaryShipping');
    if (shippingEl) {
      shippingEl.innerHTML = deliveryFee === 0 
        ? '<span style="color:#2E7D32; font-weight:700;">FREE (Orders above ₹999)</span>' 
        : `<strong>₹${deliveryFee}</strong>`;
    }
    if (totalEl) totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;

    const placeBtn = document.getElementById('btnPlaceOrder');
    const btnText = document.getElementById('placeOrderText');
    if (placeBtn) placeBtn.disabled = false;
    if (btnText) btnText.textContent = `PLACE ORDER & CONFIRM (₹${total.toLocaleString('en-IN')})`;

    modal.classList.add('is-open');
    backdrop?.classList.add('is-open');
  }

  selectPaymentMethod(method, labelEl) {
    this.selectedPaymentMethod = method;
    document.querySelectorAll('.payment-option-label').forEach(el => el.classList.remove('active'));
    if (labelEl) {
      labelEl.classList.add('active');
      const radio = labelEl.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    }

    const cardBox = document.getElementById('cardInputsBox');
    const helperBox = document.getElementById('paymentHelperBox');

    if (cardBox) {
      cardBox.style.display = method === 'card' ? 'block' : 'none';
    }

    if (helperBox) {
      if (method === 'cod') {
        helperBox.innerHTML = '💵 <strong>Cash on Delivery:</strong> Pay with cash when your tailor-finished package arrives at your doorstep. Zero advance payment required.';
      } else if (method === 'whatsapp') {
        helperBox.innerHTML = '💬 <strong>WhatsApp Instant Order:</strong> Order will be instantly prepared and our executive will confirm your details on WhatsApp (<strong>+91 97306 54810</strong>).';
      } else if (method === 'upi') {
        helperBox.innerHTML = '📱 <strong>UPI / QR Code:</strong> Pay instantly via Google Pay, PhonePe, Paytm or any UPI app upon delivery or confirmation.';
      } else if (method === 'card') {
        helperBox.innerHTML = '💳 <strong>Credit / Debit Card:</strong> Pay securely using Visa, MasterCard, RuPay or Amex with 256-bit SSL encryption.';
      }
    }
  }

  closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    modal?.classList.remove('is-open');
    this.checkBackdropState();
  }

  async processOrder(form) {
    const placeBtn = document.getElementById('btnPlaceOrder');
    const btnText = document.getElementById('placeOrderText');
    const firstName = document.getElementById('chkFirstName')?.value.trim() || 'Valued';
    const lastName = document.getElementById('chkLastName')?.value.trim() || 'Client';
    const customerName = `${firstName} ${lastName}`.trim();
    const phone = document.getElementById('chkPhone')?.value.trim() || '';
    const email = document.getElementById('chkEmail')?.value.trim() || '';
    const address = document.getElementById('chkAddress')?.value.trim() || '';
    const city = document.getElementById('chkCity')?.value.trim() || 'Solapur';
    const postal = document.getElementById('chkPostal')?.value.trim() || '413001';

    const selectedRadio = document.querySelector('input[name="paymentMethod"]:checked');
    const paymentMethod = selectedRadio ? selectedRadio.value : (this.selectedPaymentMethod || 'cod');

    if (!phone) {
      this.showToast('Please enter your active WhatsApp / Phone number for delivery updates.');
      document.getElementById('chkPhone')?.focus();
      return;
    }

    if (!address) {
      this.showToast('Please enter your delivery street address.');
      document.getElementById('chkAddress')?.focus();
      return;
    }

    if (placeBtn) placeBtn.disabled = true;
    if (btnText) btnText.textContent = 'CONFIRMING BESPOKE ORDER...';

    // Calculate subtotal and delivery
    let subtotal = 0;
    this.cart.forEach(item => {
      subtotal += (item.price * item.quantity);
    });
    const deliveryFee = subtotal >= 999 ? 0 : (subtotal > 0 ? 99 : 0);
    const total = subtotal + deliveryFee;

    const payload = {
      customerName,
      customerEmail: email,
      phone,
      shippingAddress: address,
      city,
      postalCode: postal,
      paymentMethod,
      items: this.cart.map(i => ({
        id: i.id,
        title: i.title,
        price: i.price,
        size: i.size || 'M',
        color: i.color || 'Standard',
        quantity: i.quantity,
        image: i.image
      })),
      subtotal,
      deliveryFee,
      total
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.success && result.order) {
        const order = result.order;
        const formContent = document.getElementById('checkoutFormContent');
        const successContent = document.getElementById('checkoutSuccessContent');
        const confirmedName = document.getElementById('confirmedCustomerName');
        const confirmedOrder = document.getElementById('confirmedOrderNum');
        const shareBtn = document.getElementById('btnShareWhatsApp');

        if (confirmedName) confirmedName.textContent = customerName;
        if (confirmedOrder) confirmedOrder.textContent = order.id;

        // Construct WhatsApp Order Message
        const itemsSummary = this.cart.map((item, idx) => 
          `${idx + 1}. *${item.title}* (${item.size || 'M'}) x ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
        ).join('%0A');

        const waText = 
          `👑 *NEW ORDER - JEANSCORNER LUXURY ATELIER*%0A%0A` +
          `*Order ID:* ${order.id}%0A` +
          `*Customer:* ${encodeURIComponent(customerName)}%0A` +
          `*Phone:* ${encodeURIComponent(phone)}%0A` +
          `*Address:* ${encodeURIComponent(address)}, ${encodeURIComponent(city)} (${encodeURIComponent(postal)})%0A%0A` +
          `*Ordered Items:*%0A${itemsSummary}%0A%0A` +
          `*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}%0A` +
          `*Delivery:* ${deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee}%0A` +
          `*Total Bill:* ₹${total.toLocaleString('en-IN')}%0A` +
          `*Payment Method:* ${paymentMethod.toUpperCase()}%0A%0A` +
          `_Please confirm dispatch and delivery timeline._`;

        const waUrl = `https://wa.me/919730654810?text=${waText}`;

        if (shareBtn) {
          shareBtn.href = waUrl;
        }

        if (paymentMethod === 'whatsapp') {
          window.open(waUrl, '_blank');
        }

        if (formContent) formContent.style.display = 'none';
        if (successContent) successContent.style.display = 'block';

        this.cart = [];
        this.saveCart();
        this.renderCart();

        this.showToast(`Order ${order.id} registered! Tailoring dispatched.`);
      } else {
        alert(result.error || 'Failed to place order. Please try again.');
        if (placeBtn) placeBtn.disabled = false;
        if (btnText) btnText.textContent = `PLACE ORDER & CONFIRM (₹${total.toLocaleString('en-IN')})`;
      }
    } catch (err) {
      console.error('Order creation error:', err);
      alert('Network error connecting to atelier server. Please check your connection.');
      if (placeBtn) placeBtn.disabled = false;
      if (btnText) btnText.textContent = `PLACE ORDER & CONFIRM (₹${total.toLocaleString('en-IN')})`;
    }
  }

  toggleAccordion(header) {
    const item = header.closest('.accordion-item');
    if (item) {
      item.classList.toggle('open');
    }
  }

  showSizeGuide() {
    const modal = document.getElementById('sizeGuideModal');
    const backdrop = document.getElementById('drawerBackdrop');
    if (!modal) return;
    this.closeCart();
    this.closeSearch();
    this.closeMobileNav();
    modal.classList.add('is-open');
    backdrop?.classList.add('is-open');
  }

  closeSizeGuide() {
    const modal = document.getElementById('sizeGuideModal');
    modal?.classList.remove('is-open');
    this.checkBackdropState();
  }

  openAccountModal(tab = 'signin') {
    const modal = document.getElementById('accountModal');
    const backdrop = document.getElementById('drawerBackdrop');
    if (!modal) return;
    this.closeCart();
    this.closeSearch();
    this.closeMobileNav();
    modal.classList.add('is-open');
    backdrop?.classList.add('is-open');
    this.switchAccountTab(tab);
  }

  closeAccountModal() {
    const modal = document.getElementById('accountModal');
    modal?.classList.remove('is-open');
    this.checkBackdropState();
  }

  switchAccountTab(tabKey) {
    const tabs = document.querySelectorAll('#accountModal .modal-tab-btn');
    tabs.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-account-tab') === tabKey);
    });

    const signInForm = document.getElementById('accountSignInForm');
    const registerForm = document.getElementById('accountRegisterForm');
    const trackView = document.getElementById('accountTrackView');

    if (signInForm) signInForm.style.display = tabKey === 'signin' ? 'flex' : 'none';
    if (registerForm) registerForm.style.display = tabKey === 'register' ? 'flex' : 'none';
    if (trackView) trackView.style.display = tabKey === 'track' ? 'block' : 'none';
  }

  handleSignIn(form) {
    const email = document.getElementById('signInEmail')?.value || 'Alexander';
    const name = email.split('@')[0];
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    this.showToast(`Welcome back, ${capitalized}. Atelier VIP access activated.`);
    const statusDot = document.getElementById('accountStatusDot');
    if (statusDot) statusDot.style.display = 'block';
    this.closeAccountModal();
  }

  handleRegister(form) {
    const nameInput = document.getElementById('regFullName')?.value || 'Alexander';
    this.showToast(`Welcome to the Atelier Club, ${nameInput}. Your concierge benefits are now active.`);
    const statusDot = document.getElementById('accountStatusDot');
    if (statusDot) statusDot.style.display = 'block';
    this.closeAccountModal();
  }

  handleTrackLookup(form) {
    const resultBox = document.getElementById('trackResultBox');
    if (resultBox) {
      resultBox.style.display = 'block';
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  openInfoModal(tabKey = 'shipping') {
    const modal = document.getElementById('infoModal');
    const backdrop = document.getElementById('drawerBackdrop');
    if (!modal) return;
    this.closeCart();
    this.closeSearch();
    this.closeMobileNav();
    modal.classList.add('is-open');
    backdrop?.classList.add('is-open');
    this.switchInfoTab(tabKey);
  }

  closeInfoModal() {
    const modal = document.getElementById('infoModal');
    modal?.classList.remove('is-open');
    this.checkBackdropState();
  }

  checkBackdropState() {
    const anyModalOpen = document.querySelector('.luxury-modal.is-open') || 
                         document.querySelector('.cart-drawer.is-open') || 
                         document.querySelector('.search-modal.is-open') || 
                         document.querySelector('.mobile-nav-drawer.is-open') ||
                         document.querySelector('.collection-sidebar.mobile-drawer-open');
    const backdrop = document.getElementById('drawerBackdrop');
    if (!anyModalOpen && backdrop) {
      backdrop.classList.remove('is-open');
    }
  }

  switchInfoTab(tabKey) {
    const tabs = document.querySelectorAll('#infoModal .modal-tab-btn');
    tabs.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-info-tab') === tabKey);
    });

    const body = document.getElementById('infoModalBody');
    const title = document.getElementById('infoModalTitle');
    if (!body) return;

    const titles = {
      shipping: 'Complimentary Insured Shipping',
      returns: '14-Day Bespoke Returns & Exchanges',
      contact: 'Atelier Concierge Service',
      track: 'Real-Time Tailoring & Transit Tracker',
      privacy: 'Client Confidentiality & Privacy',
      terms: 'Terms of Atelier Service',
      faq: 'Frequently Asked Questions',
      stores: 'JEANSCORNER Flagship Boutiques'
    };

    if (title && titles[tabKey]) {
      title.textContent = titles[tabKey];
    }

    if (tabKey === 'shipping') {
      body.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:18px; line-height:1.65; color:var(--color-text-secondary); font-size:0.92rem;">
          <p>Every JEANSCORNER garment is individually inspected, hand-steamed, and wrapped in our signature organic linen presentation box with cedarwood wardrobe sachet.</p>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:14px; margin-top:6px;">
            <div style="background:#FAF5EE; padding:16px; border-radius:8px; border:1px solid var(--color-border);">
              <strong style="color:var(--color-text-main); display:block; margin-bottom:4px;">Domestic Priority</strong>
              <span style="font-size:0.82rem;">2-3 Business Days</span>
              <div style="color:#2E7D32; font-weight:700; margin-top:4px;">Complimentary on all orders</div>
            </div>
            <div style="background:#FAF5EE; padding:16px; border-radius:8px; border:1px solid var(--color-border);">
              <strong style="color:var(--color-text-main); display:block; margin-bottom:4px;">International Express</strong>
              <span style="font-size:0.82rem;">3-5 Business Days (DHL Express)</span>
              <div style="color:var(--color-text-highlight); font-weight:700; margin-top:4px;">Free over $150 · or $25 flat</div>
            </div>
            <div style="background:#FAF5EE; padding:16px; border-radius:8px; border:1px solid var(--color-border);">
              <strong style="color:var(--color-text-main); display:block; margin-bottom:4px;">Same-Day Atelier Courier</strong>
              <span style="font-size:0.82rem;">NYC Madison Ave & London Mayfair</span>
              <div style="color:var(--color-text-main); font-weight:700; margin-top:4px;">Available upon request</div>
            </div>
          </div>
          <p style="font-size:0.82rem; margin-top:8px;">All orders are dispatched from our centralized atelier with full insurance and signature required upon delivery.</p>
        </div>
      `;
    } else if (tabKey === 'returns') {
      body.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px; line-height:1.65; color:var(--color-text-secondary); font-size:0.92rem;">
          <p>We pride ourselves on the impeccable drape and sizing of our collections. If your garment does not exceed expectations, we offer complimentary 14-day domestic returns and exchanges.</p>
          <ul style="list-style:disc; padding-left:20px; display:flex; flex-direction:column; gap:8px;">
            <li>Garments must remain unworn, unwashed, and in original condition with atelier hangtags attached.</li>
            <li>A pre-printed prepaid DHL return label is included inside every presentation box.</li>
            <li>Exchanges for alternate sizing or colorways are dispatched immediately with zero additional fees.</li>
            <li>Refunds are credited to the original payment method within 3 business days of atelier intake.</li>
          </ul>
          <div style="margin-top:10px;">
            <button class="btn-primary" onclick="storeApp.switchInfoTab('contact')" style="padding:10px 24px; font-size:0.82rem;">Request Return Label</button>
          </div>
        </div>
      `;
    } else if (tabKey === 'contact') {
      body.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <p style="color:var(--color-text-secondary); font-size:0.9rem;">
            Our client advisors and bespoke tailoring concierge are available Monday to Saturday, 9:00 AM – 8:00 PM EST.
          </p>
          <form onsubmit="event.preventDefault(); storeApp.showToast('Your inquiry has been received. A senior concierge advisor will respond within 4 hours.'); this.reset();" style="display:flex; flex-direction:column; gap:14px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div>
                <label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; display:block; margin-bottom:4px;">Your Name</label>
                <input type="text" required placeholder="Lord Alexander" class="luxury-input" />
              </div>
              <div>
                <label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; display:block; margin-bottom:4px;">Email Address</label>
                <input type="email" required placeholder="alexander@domain.com" class="luxury-input" />
              </div>
            </div>
            <div>
              <label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; display:block; margin-bottom:4px;">Inquiry Topic</label>
              <select class="luxury-input">
                <option>Sizing Advice & Tailoring Consultation</option>
                <option>Order Status & Expedited Delivery</option>
                <option>Return & Exchange Assistance</option>
                <option>Private Showroom Appointment</option>
              </select>
            </div>
            <div>
              <label style="font-size:0.72rem; font-weight:700; text-transform:uppercase; display:block; margin-bottom:4px;">Message</label>
              <textarea required rows="3" placeholder="How may our concierge assist your wardrobe today?" class="luxury-input" style="resize:vertical;"></textarea>
            </div>
            <button type="submit" class="btn-primary" style="width:100%;">
              <span>SEND CONCIERGE MESSAGE</span>
              <span>→</span>
            </button>
          </form>
        </div>
      `;
    } else if (tabKey === 'track') {
      body.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <p style="color:var(--color-text-secondary); font-size:0.9rem;">Enter your Order Identifier (e.g. GC-84920) to check real-time workshop tailoring and carrier telemetry.</p>
          <form onsubmit="event.preventDefault(); document.getElementById('infoTrackResult').style.display = 'block';" style="display:flex; gap:10px;">
            <input type="text" required value="GC-84920" class="luxury-input" style="flex-grow:1;" />
            <button type="submit" class="btn-primary" style="padding:12px 24px; white-space:nowrap;">TRACK</button>
          </form>
          <div id="infoTrackResult" style="margin-top:14px; padding:18px; background:#FAF5EE; border:1px solid var(--color-border); border-radius:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <strong style="color:var(--color-text-main); font-size:1rem;">Order #GC-84920</strong>
              <span style="font-size:0.72rem; background:#641D2C; color:#fff; padding:3px 10px; border-radius:12px; font-weight:700;">OUT FOR DELIVERY</span>
            </div>
            <p style="font-size:0.86rem; color:var(--color-text-secondary); margin-bottom:6px;">Carrier: <strong>DHL Express Priority — Waybill #9842107421</strong></p>
            <p style="font-size:0.86rem; color:var(--color-text-main);">Signature required at address. Delivery courier ETA: <strong>Today by 4:30 PM</strong>.</p>
          </div>
        </div>
      `;
    } else if (tabKey === 'privacy' || tabKey === 'terms') {
      body.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:14px; line-height:1.65; color:var(--color-text-secondary); font-size:0.9rem;">
          <h4 style="font-family:var(--font-serif); font-size:1.1rem; color:var(--color-text-main);">Confidentiality & Sartorial Integrity</h4>
          <p>JEANSCORNER upholds the highest standards of discretion and client privacy. We never share, distribute, or monetize client measurement profiles, billing telemetry, or wardrobe preferences.</p>
          <p>All digital transactions are encrypted via 256-bit TLS/SSL architectures. Payment credentials are tokenized directly with Tier-1 banking gateways and never stored on localized servers.</p>
          <h4 style="font-family:var(--font-serif); font-size:1.1rem; color:var(--color-text-main); margin-top:8px;">Atelier Guarantee</h4>
          <p>Each piece is guaranteed against structural, stitching, or material defects for a full calendar year from the date of purchase. Complimentary repairs or replacements are performed by our master tailors.</p>
        </div>
      `;
    } else if (tabKey === 'faq') {
      body.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div class="accordion-item open" onclick="this.classList.toggle('open')">
            <div class="accordion-header" style="padding:12px 0; font-size:0.95rem; font-weight:600; cursor:pointer; display:flex; justify-content:space-between;">
              <span>How do JEANSCORNER shirts fit?</span>
              <span>▾</span>
            </div>
            <div class="accordion-body" style="padding-bottom:12px; font-size:0.88rem; color:var(--color-text-secondary); line-height:1.6;">
              Our shirts feature a modern tailored athletic cut. They offer clean, tapered lines across the torso with comfortable range of motion across the shoulders. For a relaxed or oversized drape, we recommend ordering one size up.
            </div>
          </div>
          <div class="accordion-item" onclick="this.classList.toggle('open')">
            <div class="accordion-header" style="padding:12px 0; font-size:0.95rem; font-weight:600; cursor:pointer; display:flex; justify-content:space-between;">
              <span>What fabrics are used in the Tailored Casual range?</span>
              <span>▾</span>
            </div>
            <div class="accordion-body" style="padding-bottom:12px; font-size:0.88rem; color:var(--color-text-secondary); line-height:1.6;">
              We utilize exclusively 100% long-staple combed Aegean and Egyptian cotton, pre-washed for velvety softness and woven with breathable twill or micro-pique structures.
            </div>
          </div>
          <div class="accordion-item" onclick="this.classList.toggle('open')">
            <div class="accordion-header" style="padding:12px 0; font-size:0.95rem; font-weight:600; cursor:pointer; display:flex; justify-content:space-between;">
              <span>Can I visit a boutique for custom fittings?</span>
              <span>▾</span>
            </div>
            <div class="accordion-body" style="padding-bottom:12px; font-size:0.88rem; color:var(--color-text-secondary); line-height:1.6;">
              Yes. Private measuring and personalized wardrobe curation are available by appointment at our New York and London flagship boutiques.
            </div>
          </div>
        </div>
      `;
    } else if (tabKey === 'stores') {
      body.innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:18px;">
          <div style="background:#FAF5EE; padding:18px; border-radius:8px; border:1px solid var(--color-border);">
            <span class="section-tag" style="font-size:0.68rem;">FLAGSHIP ATELIER</span>
            <h4 style="font-family:var(--font-serif); font-size:1.15rem; margin:6px 0 8px 0; color:var(--color-text-main);">Madison Avenue, New York</h4>
            <p style="font-size:0.85rem; color:var(--color-text-secondary); margin-bottom:10px; line-height:1.5;">
              742 Madison Avenue, 4th Floor<br>New York, NY 10021<br>+1 (212) 555-0194
            </p>
            <span style="font-size:0.75rem; color:var(--color-text-highlight); font-weight:700;">Open Mon–Sat: 10 AM – 7 PM</span>
          </div>
          <div style="background:#FAF5EE; padding:18px; border-radius:8px; border:1px solid var(--color-border);">
            <span class="section-tag" style="font-size:0.68rem;">EUROPEAN SUITE</span>
            <h4 style="font-family:var(--font-serif); font-size:1.15rem; margin:6px 0 8px 0; color:var(--color-text-main);">Mayfair, London</h4>
            <p style="font-size:0.85rem; color:var(--color-text-secondary); margin-bottom:10px; line-height:1.5;">
              28 Mount Street, Mayfair<br>London W1K 2RB, United Kingdom<br>+44 20 7946 0912
            </p>
            <span style="font-size:0.75rem; color:var(--color-text-highlight); font-weight:700;">Open Mon–Sat: 10 AM – 6:30 PM</span>
          </div>
        </div>
      `;
    }
  }

  handlePriceSlider(val, categoryId) {
    this.activeFilters.priceMax = parseFloat(val);
    const display = document.getElementById('priceFilterVal');
    if (display) display.textContent = `$${parseFloat(val).toLocaleString()}`;
    this.applyCatalogFilters(categoryId);
  }

  toggleColorFilter(el, categoryId) {
    el.classList.toggle('active');
    const color = el.getAttribute('data-color');
    if (el.classList.contains('active')) {
      if (!this.activeFilters.colors.includes(color)) {
        this.activeFilters.colors.push(color);
      }
    } else {
      this.activeFilters.colors = this.activeFilters.colors.filter(c => c !== color);
    }
    this.applyCatalogFilters(categoryId);
  }

  applyCatalogFilters(categoryId) {
    const checkedSizes = Array.from(document.querySelectorAll('.filter-size-cb:checked')).map(cb => cb.value);
    const inStockOnly = document.getElementById('filterInStock')?.checked ?? true;
    const priceMax = this.activeFilters.priceMax || 10000;
    const activeColors = this.activeFilters.colors;

    let prods = this.data.products.filter(p => {
      if (categoryId === 'casual_shirts') {
        if (p.subCategory !== 'casual_shirts' && p.category !== 'shirts') return false;
      } else if (categoryId === 'new_arrivals') {
        if (!p.isNew && !p.featured) return false;
      } else if (categoryId === 'sale') {
        if (!p.discount && !(p.compareAtPrice && p.compareAtPrice > p.price)) return false;
      } else if (p.category !== categoryId) {
        return false;
      }

      if (p.price > priceMax) return false;

      if (activeColors.length > 0) {
        const matchesColor = p.colors && p.colors.some(c => activeColors.includes(c.name.toLowerCase()));
        if (!matchesColor) return false;
      }

      if (checkedSizes.length > 0) {
        const hasSize = p.sizes && p.sizes.some(s => checkedSizes.includes(s.size) && s.available);
        if (!hasSize) return false;
      }

      return true;
    });

    const sortVal = document.getElementById(categoryId === 'casual_shirts' ? 'subcatSort' : 'collectionSort')?.value || 'featured';
    this.sortArray(prods, sortVal);

    const grid = document.getElementById(categoryId === 'casual_shirts' ? 'subcatProductsGrid' : 'categoryProductsGrid');
    const countEl = document.getElementById('filteredProductsCount');
    if (countEl) countEl.textContent = prods.length;

    if (grid) {
      if (prods.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align:center; padding: 48px 16px; color: var(--color-text-secondary);">
            <div style="font-size: 2.2rem; margin-bottom: 10px;">🔍</div>
            <h4 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--color-text-main); margin-bottom: 6px;">No garments match these filters</h4>
            <p style="font-size: 0.88rem; margin-bottom: 16px;">Try adjusting the price slider or resetting selected colors.</p>
            <button class="btn-primary" onclick="storeApp.resetCatalogFilters('${categoryId}')" style="padding: 10px 24px; font-size: 0.82rem;">Reset All Filters</button>
          </div>
        `;
      } else {
        grid.innerHTML = this.renderProductCards(prods);
      }
    }
  }

  resetCatalogFilters(categoryId) {
    this.activeFilters.priceMax = 10000;
    this.activeFilters.colors = [];
    this.activeFilters.sizes = [];

    const slider = document.getElementById('priceRangeSlider');
    if (slider) slider.value = 5000;
    const priceDisplay = document.getElementById('priceFilterVal');
    if (priceDisplay) priceDisplay.textContent = '$5,000';

    document.querySelectorAll('.filter-swatch-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.filter-size-cb').forEach(cb => cb.checked = true);
    const inStock = document.getElementById('filterInStock');
    if (inStock) inStock.checked = true;

    this.applyCatalogFilters(categoryId);
  }

  // Render Product Cards Helper
  renderProductCards(products) {
    return products.map(prod => `
      <div class="product-card">
        <div class="product-image-wrap">
          <a href="#" data-route="product" data-param="${prod.id}">
            <img src="${prod.image}" alt="${prod.title}" loading="lazy" />
          </a>
          ${prod.discount ? `<span class="product-badge">${prod.discount}</span>` : ''}
          <button class="product-quick-add-btn" title="Quick Add to Bag" onclick="storeApp.addToCart('${prod.id}', 'M', '${prod.colors ? prod.colors[0].name : 'Default'}', 1)">
            🛍️
          </button>
        </div>
        <div class="product-card-body">
          <a href="#" data-route="product" data-param="${prod.id}" class="product-title-link">${prod.title}</a>
          <div class="product-card-rating">
            <span class="stars">★★★★★</span>
            <span>${prod.rating}</span>
            <span>(${prod.reviewsCount})</span>
          </div>
          <div class="product-price-box">
            <span class="product-price">$${prod.price.toFixed(2)}</span>
            ${prod.compareAtPrice ? `<span class="product-compare-price">$${prod.compareAtPrice.toFixed(2)}</span>` : ''}
            ${prod.discount ? `<span class="product-discount-pill">${prod.discount}</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  handleSortChange(sortVal, categoryId) {
    const prods = this.data.products.filter(p => p.category === categoryId);
    this.sortArray(prods, sortVal);
    const grid = document.getElementById('categoryProductsGrid');
    if (grid) grid.innerHTML = this.renderProductCards(prods);
  }

  handleSubcatSort(sortVal) {
    const prods = this.data.products.filter(p => p.category === 'shirts');
    this.sortArray(prods, sortVal);
    const grid = document.getElementById('subcatProductsGrid');
    if (grid) grid.innerHTML = this.renderProductCards(prods.slice(0, 4));
  }

  sortArray(arr, criteria) {
    if (criteria === 'price_low_high') {
      arr.sort((a, b) => a.price - b.price);
    } else if (criteria === 'price_high_low') {
      arr.sort((a, b) => b.price - a.price);
    } else if (criteria === 'alpha_az') {
      arr.sort((a, b) => a.title.localeCompare(b.title));
    } else if (criteria === 'alpha_za') {
      arr.sort((a, b) => b.title.localeCompare(a.title));
    } else if (criteria === 'best_selling') {
      arr.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.storeApp = new GenscornarStore();
});
