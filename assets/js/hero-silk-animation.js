/**
 * GENSCORNAR - Premium 3D Flowing Silk Banner Animation
 * Photorealistic champagne-beige silk fabric simulation using WebGL & GLSL.
 * 
 * Features:
 * - Continuous, organic 3D silk wave drapery flowing diagonally (top-left to bottom-right).
 * - Multi-octave cloth wave domain warping with soft, natural fold ridges.
 * - Anisotropic specular sheen highlighting fiber ridges in radiant golden cream.
 * - Warm ivory highlights and deep luxury bronze fold shadows.
 * - Fully independent background canvas: foreground model & typography remain 100% sharp and stable.
 * - Infinite seamless time loop (zero reset seams or jumps).
 * - Battery-friendly: pauses when out of view or tab inactive.
 * - Accessibility: respects prefers-reduced-motion.
 */

(function (global) {
  'use strict';

  let animationFrameId = null;
  let observer = null;
  let currentGl = null;

  const VERTEX_SHADER_SRC = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const FRAGMENT_SHADER_SRC = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_reduced_motion;

    mat2 rot(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c, -s, s, c);
    }

    // Procedural 3D Silk Fabric Heightfield
    // Generates natural flowing folds, cascading drapery, and soft ripples
    float silkHeight(vec2 p, float t) {
      // Flow diagonally at ~30 degrees matching luxury fashion reference
      vec2 q = rot(0.52) * p;

      float flow = t * 0.40;

      // Primary domain warping: creates organic undulating billowing cloth curves
      vec2 warp = vec2(
        sin(q.y * 1.25 + flow * 0.72) * 0.36 + cos(q.x * 0.65 - flow * 0.42) * 0.20,
        cos(q.x * 0.92 + flow * 0.62) * 0.28 + sin(q.y * 0.75 + flow * 0.32) * 0.16
      );
      vec2 uv = q + warp;

      // 1. Primary sweeping draped folds (long smooth silky ridges with natural drape)
      float w1 = sin(uv.x * 1.15 - flow);
      float fold1 = 1.0 - pow(abs(w1), 1.45);

      // 2. Cascading secondary diagonal folds
      float w2 = sin(uv.x * 2.12 + uv.y * 0.48 - flow * 1.28);
      float fold2 = pow(1.0 - abs(w2), 2.0) * 0.46;

      // 3. Gentle undulating swells
      float w3 = cos(uv.x * 0.58 - uv.y * 1.25 - flow * 0.62);
      float fold3 = sin(w3 * 2.2) * 0.30;

      // 4. Subtle secondary soft wave
      float w4 = sin(uv.x * 3.35 - uv.y * 0.82 + flow * 0.88) * 0.12;

      return fold1 * 0.72 + fold2 + fold3 + w4;
    }

    // Analytical normal calculation via finite differences for accurate lighting
    vec3 calcNormal(vec2 p, float t) {
      float eps = 0.0075;
      float hC = silkHeight(p, t);
      float hR = silkHeight(p + vec2(eps, 0.0), t);
      float hU = silkHeight(p + vec2(0.0, eps), t);

      vec3 dX = vec3(eps, 0.0, (hR - hC) * 2.15);
      vec3 dY = vec3(0.0, eps, (hU - hC) * 2.15);
      return normalize(cross(dX, dY));
    }

    void main() {
      vec2 st = gl_FragCoord.xy / u_resolution.xy;
      float aspect = u_resolution.x / u_resolution.y;

      // Panoramic coordinate space scaled for ultra-wide hero banner
      vec2 p = (st - 0.5) * vec2(aspect, 1.0) * 2.25;

      // Subtle mouse interaction
      p += (u_mouse - 0.5) * 0.12;

      // Time progression (disabled if user prefers reduced motion)
      float t = (u_reduced_motion > 0.5) ? 1.5 : (u_time * 0.90);

      vec3 N = calcNormal(p, t);
      vec3 V = vec3(0.0, 0.0, 1.0);

      // Key light: Directional warm champagne sunlight from top-left
      vec3 L1 = normalize(vec3(-0.62, 0.74, 0.76));
      // Fill light: Ambient bronze bounce from lower right
      vec3 L2 = normalize(vec3(0.52, -0.42, 0.46));

      // Wrapped diffuse lighting (simulates translucent silk subsurface scattering)
      float diffuseWrap = max(0.0, (dot(N, L1) + 0.45) / 1.45);
      float NdotL2 = max(0.0, (dot(N, L2) + 0.32) / 1.32);

      // Silk Anisotropic Specular:
      // Silk microfibers reflect along tangent to the fold curves
      vec3 T = normalize(cross(N, vec3(0.35, 0.94, 0.0)));
      vec3 H1 = normalize(L1 + V);
      float TdotH = dot(T, H1);
      float sinTH = sqrt(max(0.0, 1.0 - TdotH * TdotH));
      // Broad lustrous satin sheen
      float satinSheen = pow(sinTH, 14.0) * max(0.0, dot(N, L1));
      // Crisp golden crest highlight
      float crestHighlight = pow(sinTH, 36.0) * max(0.0, dot(N, L1));

      // Fresnel grazing rim glow (silk shines at angled viewing angles)
      float fresnel = pow(1.0 - max(0.0, dot(N, V)), 2.4);

      // Champagne-Gold Luxury Color Palette (matched exactly to reference video)
      vec3 cCrevice  = vec3(0.32, 0.24, 0.17); // Deepest bronze crevice (#523D2B)
      vec3 cShadow   = vec3(0.52, 0.42, 0.32); // Warm taupe bronze shadow (#856B52)
      vec3 cMidTone  = vec3(0.78, 0.70, 0.58); // Muted warm champagne (#C7B394)
      vec3 cBeige    = vec3(0.89, 0.83, 0.73); // Radiant champagne beige (#E3D4BA)
      vec3 cIvory    = vec3(0.96, 0.92, 0.85); // Warm ivory highlight (#F5EBD9)
      vec3 cGoldPeak = vec3(1.00, 0.98, 0.93); // Soft golden cream peak (#FFFBF0)
      vec3 cGoldTint = vec3(1.00, 0.89, 0.71); // Golden luster (#FFE3B5)

      float h = silkHeight(p, t);

      // Smooth color gradations across the folds
      vec3 base = mix(cCrevice, cShadow, smoothstep(-0.40, 0.0, h));
      base = mix(base, cMidTone, smoothstep(0.0, 0.35, h));
      base = mix(base, cBeige, smoothstep(0.35, 0.65, h));
      base = mix(base, cIvory, smoothstep(0.65, 0.95, h));

      // Apply diffuse lighting with ambient fill
      vec3 color = base * (diffuseWrap * 0.82 + 0.22);
      color += cShadow * NdotL2 * 0.28;

      // Apply silk satin sheen & golden crest highlights
      color += cGoldTint * satinSheen * 0.45;
      color += cGoldPeak * crestHighlight * 0.55;

      // Apply golden Fresnel rim sheen
      color += cGoldTint * fresnel * 0.38;

      // Soft vignette to keep focus centered and text readable
      float vignette = smoothstep(1.8, 0.45, length(st - 0.5));
      color *= (vignette * 0.15 + 0.85);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function createShader(gl, type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[SilkShader] Shader compile error:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function initHeroSilkShader() {
    destroyHeroSilkShader();

    const canvas = document.getElementById('heroSilkCanvas');
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' }) ||
               canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('[SilkShader] WebGL not supported, falling back gracefully.');
      return;
    }
    currentGl = gl;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('[SilkShader] Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Quad geometry covering viewport
    const posLoc = gl.getAttribLocation(program, 'position');
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const reducedLoc = gl.getUniformLocation(program, 'u_reduced_motion');

    let mouseX = 0.5, mouseY = 0.5;
    let targetMouseX = 0.5, targetMouseY = 0.5;

    const bannerSection = canvas.closest('.hero-section') || canvas.parentElement;
    if (bannerSection) {
      bannerSection.addEventListener('mousemove', (e) => {
        const rect = bannerSection.getBoundingClientRect();
        targetMouseX = (e.clientX - rect.left) / rect.width;
        targetMouseY = (e.clientY - rect.top) / rect.height;
      }, { passive: true });
    }

    function resize() {
      if (!canvas || !currentGl) return;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || canvas.parentElement?.clientWidth || window.innerWidth;
      const height = rect.height || canvas.parentElement?.clientHeight || 720;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const renderW = Math.round(width * dpr);
      const renderH = Math.round(height * dpr);

      if (canvas.width !== renderW || canvas.height !== renderH) {
        canvas.width = renderW;
        canvas.height = renderH;
        gl.viewport(0, 0, renderW, renderH);
        gl.uniform2f(resLoc, renderW, renderH);
      }
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gl.uniform1f(reducedLoc, prefersReducedMotion ? 1.0 : 0.0);

    let isVisible = true;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 });
      observer.observe(canvas);
    }

    let startTime = performance.now();
    function animate(currentTime) {
      if (!currentGl) return;

      if (isVisible) {
        const elapsedTime = (currentTime - startTime) * 0.001;

        // Smooth mouse lerp
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        gl.uniform1f(timeLoc, elapsedTime);
        gl.uniform2f(mouseLoc, mouseX, mouseY);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  function destroyHeroSilkShader() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    currentGl = null;
  }

  global.initHeroSilkShader = initHeroSilkShader;
  global.destroyHeroSilkShader = destroyHeroSilkShader;

})(window);

