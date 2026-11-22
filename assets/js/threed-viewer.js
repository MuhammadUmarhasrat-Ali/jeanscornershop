// GENSCORNAR Luxury 3D Product Presentation Engine
// Delivers realistic tailored invisible-mannequin shirt presentation directly matching
// the user's luxury craftsmanship banner with architectural alcove, pedestal,
// 360° mouse drag rotation, zoom, floating dynamics, glowing orbit lines, and live color changing.

class Genscornar3DViewer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentColorKey = 'olive';
    this.colorTextures = {
      olive: 'assets/products/hero_shirt_olive.png',
      white: 'assets/products/hero_shirt_white.png',
      black: 'assets/products/hero_shirt_black.png',
      navy: 'assets/products/hero_shirt_navy.png'
    };

    this.isRotating = true;
    this.isInteracting = false;
    this.targetRotationY = 0;
    this.targetRotationX = 0;
    this.currentRotationY = 0;
    this.currentRotationX = 0;
    this.zoomLevel = 1.0;
    this.targetZoom = 1.0;
    this.clock = new THREE.Clock();

    this.shirtRoot = null;
    this.shirtMesh = null;
    this.orbitGroup = null;
    this.loadedTextures = {};

    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded, rendering high-res fallback.');
      this.renderFallback();
      return;
    }

    try {
      this.setupScene();
      this.setupStudioLights();
      this.preloadTextures(() => {
        this.buildCurvedTailoredShirt();
        this.buildOrbitalLines();
        this.setupInteraction();
        this.animate();
      });
    } catch (e) {
      console.error('Error initializing 3D viewer:', e);
      this.renderFallback();
    }
  }

  setupScene() {
    const width = this.container.clientWidth || 460;
    const height = this.container.clientHeight || 350;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(0, 0.05, 3.6);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);
  }

  setupStudioLights() {
    // Warm atelier ambient light
    const ambientLight = new THREE.AmbientLight(0xfff7ee, 1.8);
    this.scene.add(ambientLight);

    // Key light highlighting shoulders and collar
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(2.0, 3.0, 3.0);
    this.scene.add(keyLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xe8d8c4, 1.2);
    fillLight.position.set(-2.5, 1.5, 2.0);
    this.scene.add(fillLight);

    // Rim light for clean silhouette separation
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rimLight.position.set(0, 2.5, -2.5);
    this.scene.add(rimLight);
  }

  preloadTextures(onComplete) {
    const loader = new THREE.TextureLoader();
    let loadedCount = 0;
    const keys = Object.keys(this.colorTextures);

    keys.forEach((key) => {
      loader.load(
        this.colorTextures[key],
        (tex) => {
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          this.loadedTextures[key] = tex;
          loadedCount++;
          if (loadedCount === keys.length && onComplete) {
            onComplete();
          }
        },
        undefined,
        (err) => {
          console.warn(`Could not load texture for ${key}, proceeding.`, err);
          loadedCount++;
          if (loadedCount === keys.length && onComplete) {
            onComplete();
          }
        }
      );
    });
  }

  buildCurvedTailoredShirt() {
    this.shirtRoot = new THREE.Group();

    // High quality curved 3D plane that forms anatomical chest depth and sleeve curves
    const width = 2.30;
    const height = 2.22;
    const segmentsX = 48;
    const segmentsY = 48;

    const geo = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
    const pos = geo.attributes.position;

    // Displace vertices to form natural 3D curvature, folded sleeve contours, and athletic waist taper
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      const normX = x / (width * 0.5); // -1 to +1
      const normY = y / (height * 0.5); // -1 to +1

      // Cylindrical chest curvature
      let z = Math.cos(normX * 1.35) * 0.28 - 0.28;

      // Pectoral projection forward
      if (normY > -0.1 && normY < 0.6) {
        z += Math.cos(normX * 1.5) * 0.08 * (1.0 - Math.abs(normY - 0.25) * 2.0);
      }

      // Natural sleeve curve backwards
      if (Math.abs(normX) > 0.52) {
        const sleeveDist = Math.abs(normX) - 0.52;
        z -= sleeveDist * 0.38;
      }

      // Curved bottom hem flare
      if (normY < -0.6) {
        z += (normY + 0.6) * 0.06;
      }

      pos.setZ(i, z);
    }
    geo.computeVertexNormals();

    const initialTex = this.loadedTextures[this.currentColorKey];
    this.shirtMaterial = new THREE.MeshStandardMaterial({
      map: initialTex,
      transparent: true,
      alphaTest: 0.02,
      roughness: 0.60,
      metalness: 0.08,
      side: THREE.DoubleSide
    });

    this.shirtMesh = new THREE.Mesh(geo, this.shirtMaterial);
    this.shirtMesh.position.set(0, 0.08, 0.05);
    this.shirtRoot.add(this.shirtMesh);

    // Realistic Floating Drop Shadow onto the Pedestal
    const shadowGeo = new THREE.PlaneGeometry(2.1, 0.75);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
    grad.addColorStop(0, 'rgba(145, 122, 98, 0.55)');
    grad.addColorStop(0.5, 'rgba(195, 175, 150, 0.25)');
    grad.addColorStop(1, 'rgba(245, 224, 199, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.90
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -1.05, -0.1);
    this.shirtRoot.add(shadowMesh);

    this.scene.add(this.shirtRoot);
  }

  buildOrbitalLines() {
    this.orbitGroup = new THREE.Group();

    // Matching glowing circular orbit lines in the craftsmanship presentation
    const orbitMat1 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85
    });

    const orbitMat2 = new THREE.MeshBasicMaterial({
      color: 0xdfd4c5,
      transparent: true,
      opacity: 0.55
    });

    // Primary central waist orbit ring
    const ringGeo1 = new THREE.TorusGeometry(1.22, 0.0055, 16, 120);
    ringGeo1.rotateX(Math.PI / 2.3);
    const ring1 = new THREE.Mesh(ringGeo1, orbitMat1);
    ring1.position.set(0, -0.05, 0.02);
    this.orbitGroup.add(ring1);

    // Secondary lower orbit ring
    const ringGeo2 = new THREE.TorusGeometry(1.42, 0.004, 16, 120);
    ringGeo2.rotateX(Math.PI / 2.2);
    ringGeo2.rotateY(0.25);
    const ring2 = new THREE.Mesh(ringGeo2, orbitMat2);
    ring2.position.set(0, -0.45, 0.0);
    this.orbitGroup.add(ring2);

    this.scene.add(this.orbitGroup);
  }

  setupInteraction() {
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    const el = this.renderer.domElement;

    // Mouse drag rotation
    el.addEventListener('mousedown', (e) => {
      isDragging = true;
      this.isInteracting = true;
      this.isRotating = false;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        setTimeout(() => {
          this.isInteracting = false;
          this.isRotating = true;
        }, 1200);
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;

      this.targetRotationY += deltaX * 0.011;
      this.targetRotationX = Math.max(-0.25, Math.min(0.25, this.targetRotationX + deltaY * 0.005));

      prevX = e.clientX;
      prevY = e.clientY;
    });

    // Touch support for mobile devices
    let touchStartX = 0;
    let touchStartY = 0;

    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        this.isInteracting = true;
        this.isRotating = false;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;

      this.targetRotationY += deltaX * 0.013;
      this.targetRotationX = Math.max(-0.25, Math.min(0.25, this.targetRotationX + deltaY * 0.006));

      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    el.addEventListener('touchend', () => {
      isDragging = false;
      setTimeout(() => {
        this.isInteracting = false;
        this.isRotating = true;
      }, 1500);
    });

    // Wheel zoom inspection
    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.targetZoom = Math.max(0.85, Math.min(1.45, this.targetZoom - e.deltaY * 0.0012));
    }, { passive: false });

    // Double click to toggle auto-rotation
    el.addEventListener('dblclick', () => {
      this.isRotating = !this.isRotating;
    });

    // Window resize handling
    window.addEventListener('resize', () => {
      if (!this.container || !this.camera || !this.renderer) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  setColor(hexColor) {
    const map = {
      0x4C4B37: 'olive',
      0xFAF8F5: 'white',
      0x141312: 'black',
      0x1B2A4A: 'navy'
    };
    this.setColorKey(map[hexColor] || 'olive');
  }

  setColorKey(key) {
    this.currentColorKey = key;
    const tex = this.loadedTextures[key];
    if (tex && this.shirtMaterial) {
      this.shirtMaterial.map = tex;
      this.shirtMaterial.needsUpdate = true;
    }
  }

  rotateStep(direction) {
    this.isRotating = false;
    this.targetRotationY += direction * 0.65;
    setTimeout(() => {
      if (!this.isInteracting) this.isRotating = true;
    }, 2000);
  }

  resetView() {
    this.targetRotationX = 0;
    this.targetRotationY = 0;
    this.targetZoom = 1.0;
    this.isRotating = true;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Floating levitation micro-animation above pedestal
    if (this.shirtRoot) {
      const floatY = Math.sin(elapsedTime * 1.8) * 0.035;
      this.shirtRoot.position.y = floatY;

      // Subtle breathing motion
      const breath = 1.0 + Math.sin(elapsedTime * 1.4) * 0.006;

      // Smooth zoom interpolation
      this.zoomLevel += (this.targetZoom - this.zoomLevel) * 0.1;
      this.shirtRoot.scale.set(breath * this.zoomLevel, breath * this.zoomLevel, breath * this.zoomLevel);

      // Auto rotation when not dragging
      if (this.isRotating) {
        this.targetRotationY += 0.0075;
      }

      // Smooth damping / interpolation for responsive natural feel
      this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.09;
      this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.09;

      this.shirtRoot.rotation.y = this.currentRotationY;
      this.shirtRoot.rotation.x = this.currentRotationX;
    }

    // Counter-orbital motion for futuristic fashion presentation
    if (this.orbitGroup) {
      this.orbitGroup.rotation.y -= 0.0035;
      this.orbitGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.015;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  renderFallback() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:url('assets/products/alcove_arch_bg.png') no-repeat center center; background-size:cover; border-radius:20px; overflow:hidden;">
        <img src="assets/products/hero_shirt_olive.png" alt="JEANSCORNER Tailored Shirt" style="max-height:88%; object-fit:contain;" />
      </div>
    `;
  }
}

window.Genscornar3DViewer = Genscornar3DViewer;
