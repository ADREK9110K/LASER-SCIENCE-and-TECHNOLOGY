/**
 * LASER SCIENCE & TECHNOLOGY — VIRTUAL INTERACTIVE LABORATORY
 * High-DPI 2D Optical Bench Renderer & Smooth Touch/Mouse Controller (v2.0)
 * Features:
 *  - CAD-quality optical component rendering
 *  - Flexible Bezier Optical Fiber with draggable IN / C1 / C2 / OUT handles & TIR glow
 *  - Upright, perfectly aligned Circular Protractor degree labels
 *  - Clash-of-Clans smooth touch (1-finger tap/drag/pan with inertia, 2-finger pinch-zoom + pan)
 *  - Smooth animated fitToView()
 */
(function (global) {
  'use strict';

  const M = global.OpticsMath;
  const Vec = M.Vec;
  const Bezier = M.Bezier;

  class OpticalCanvas2D {
    constructor(canvasEl, options = {}) {
      this.canvas = canvasEl;
      this.ctx = canvasEl.getContext('2d');

      this.components = [];
      this.rays = [];
      this.annotations = [];
      this.selectedComponent = null;
      this.hoveredComponent = null;

      this.settings = options.settings || {
        showGrid: true,
        snapToGrid: false,
        gridSpacing: 25,
        maxRayDepth: 10,
        showFocalPoints: true,
        showNormalLines: false,
        showAngles: false,
        laserRayDensity: 3,
        isDarkMode: true,
      };

      this.onSelectComponent = options.onSelectComponent || (() => {});
      this.onUpdateComponent = options.onUpdateComponent || (() => {});
      this.onUndoSave = options.onUndoSave || (() => {});
      this.onPointerCoords = options.onPointerCoords || (() => {});
      this.onRayStats = options.onRayStats || (() => {});

      // Camera transform (screen = world * zoom + pan)
      this.zoom = 1.0;
      this.pan = { x: 0, y: 0 };

      // Smooth inertia velocity & camera animation target
      this._vel = { x: 0, y: 0 };
      this._camAnim = null;

      // Interaction state
      this._drag = {
        mode: null,       // 'pan' | 'move' | 'rotate' | 'fiber-pt'
        fiberPtIdx: -1,
        startScreen: { x: 0, y: 0 },
        lastScreen: { x: 0, y: 0 },
        startPan: { x: 0, y: 0 },
        offsetWorld: { x: 0, y: 0 },
        fiberStartPts: null,
        moved: false,
      };

      // Multi-touch state
      this._touch = {
        mode: null,       // 'tap' | 'pan' | 'move' | 'rotate' | 'fiber-pt' | 'pinch'
        pendingComp: null,
        pendingFiberPt: -1,
        startX: 0, startY: 0,
        lastX: 0, lastY: 0,
        startPan: { x: 0, y: 0 },
        offsetWorld: { x: 0, y: 0 },
        fiberStartPts: null,
        pinchDist0: 0,
        pinchZoom0: 1,
        pinchWorldMid: { x: 0, y: 0 },
        moved: false,
      };

      this._dpr = Math.min(window.devicePixelRatio || 1, 2);
      this._resizeCanvas();
      this._bindEvents();
      this._startLoop();
    }

    /* ═══════════════════════════════════════════════════════════
       PUBLIC API
    ═══════════════════════════════════════════════════════════ */
    setComponents(comps) {
      this.components = comps || [];
      if (this.selectedComponent) {
        const still = this.components.find((c) => c.id === this.selectedComponent.id);
        this.selectedComponent = still || null;
      }
      this.retrace();
    }

    retrace() {
      const res = global.RayTracer.traceAll(this.components, this.settings);
      this.rays = res.rays;
      this.annotations = res.annotations;
      this.onRayStats(this.components.length, this.rays.length, this._getDetectorPower());
    }

    _getDetectorPower() {
      let maxP = 0, active = false;
      for (let i = 0; i < this.components.length; i++) {
        const c = this.components[i];
        if ((c.type === 'detector' || c.type === 'screen') && c._receivedPower > 0) {
          active = true;
          if (c._receivedPower > maxP) maxP = c._receivedPower;
        }
      }
      return { active, power: maxP };
    }

    screenToWorld(clientX, clientY) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: (clientX - rect.left - this.pan.x) / this.zoom,
        y: (clientY - rect.top - this.pan.y) / this.zoom,
      };
    }

    worldToScreen(wx, wy) {
      return {
        x: wx * this.zoom + this.pan.x,
        y: wy * this.zoom + this.pan.y,
      };
    }

    fitToView(padding = 90, instant = false) {
      this._resizeCanvas();
      const rect = this.canvas.getBoundingClientRect();
      const W = rect.width || 900;
      const H = rect.height || 580;

      if (!this.components || this.components.length === 0) {
        this._setCameraTarget(1.0, W * 0.5 - 450, H * 0.5 - 280, instant);
        return;
      }

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (let i = 0; i < this.components.length; i++) {
        const c = this.components[i];
        if (c.type === 'fiber') {
          const pts = Bezier.getFiberPoints(c);
          pts.forEach((p) => {
            minX = Math.min(minX, p.x - 30);
            maxX = Math.max(maxX, p.x + 30);
            minY = Math.min(minY, p.y - 30);
            maxY = Math.max(maxY, p.y + 30);
          });
        } else {
          const p = c.position || { x: 450, y: 280 };
          const r = this._getApproxRadius(c);
          minX = Math.min(minX, p.x - r);
          maxX = Math.max(maxX, p.x + r);
          minY = Math.min(minY, p.y - r);
          maxY = Math.max(maxY, p.y + r);
        }
      }

      const bw = Math.max(240, maxX - minX);
      const bh = Math.max(180, maxY - minY);
      const scaleX = (W - padding * 2) / bw;
      const scaleY = (H - padding * 2) / bh;
      const targetZoom = M.clamp(Math.min(scaleX, scaleY, 1.35), 0.35, 1.5);
      const cx = (minX + maxX) * 0.5;
      const cy = (minY + maxY) * 0.5;
      const targetPanX = W * 0.5 - cx * targetZoom;
      const targetPanY = H * 0.5 - cy * targetZoom;

      this._setCameraTarget(targetZoom, targetPanX, targetPanY, instant);
    }

    _setCameraTarget(zoom, px, py, instant) {
      this._vel.x = 0;
      this._vel.y = 0;
      if (instant) {
        this.zoom = zoom;
        this.pan.x = px;
        this.pan.y = py;
        this._camAnim = null;
      } else {
        this._camAnim = { targetZoom: zoom, targetX: px, targetY: py };
      }
    }

    createComponent(type, subtype, pos) {
      const id = `comp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const base = { id, type, position: { x: Math.round(pos.x), y: Math.round(pos.y) }, rotation: 0 };

      if (type === 'laser') {
        const wlMap = { red: 650, green: 532, violet: 405 };
        const nameMap = { red: 'Red Laser 650nm', green: 'Green Laser 532nm', violet: 'Violet Laser 405nm' };
        return { ...base, name: nameMap[subtype] || 'He-Ne Laser', wavelength: wlMap[subtype] || 632.8, power: 5, beamWidth: 12, beamDivergence: 0, isOn: true };
      }
      if (type === 'white_light') {
        return { ...base, name: 'Light Lamp Source', power: 10, beamWidth: 16, rayCount: 3, lampColor: 'white', isOn: true };
      }
      if (type === 'gain_medium') {
        const mType = subtype || 'ruby';
        const specs = (global.RayTracer && global.RayTracer.GAIN_MEDIA) || {};
        const sp = specs[mType] || { label: 'Ruby (Cr³⁺:Al₂O₃)', gain: 1.5 };
        return { ...base, name: sp.label, mediumType: mType, width: 160, height: 50, gainCoefficient: sp.gain || 1.5, pumpActive: false };
      }
      if (type === 'mirror') {
        const mType = subtype || 'plane';
        return {
          ...base,
          name: mType === 'partial' ? 'Beam Splitter 50/50' : `${mType[0].toUpperCase() + mType.slice(1)} Mirror`,
          mirrorType: mType,
          width: 130,
          reflectivity: mType === 'partial' ? 0.5 : 0.99,
          focalLength: 160,
          rotation: (mType === 'concave' || mType === 'convex') ? 270 : 45,
        };
      }
      if (type === 'lens') {
        const lType = subtype || 'convex';
        return { ...base, name: `${lType} Lens`, lensType: lType, focalLength: 180, diameter: 96, refractiveIndex: 1.52 };
      }
      if (type === 'prism') {
        const pType = subtype || 'triangular';
        return { ...base, name: `${pType} Prism`, prismType: pType, size: 110, refractiveIndex: 1.58 };
      }
      if (type === 'medium') {
        const isAbs = subtype === 'absorbing';
        return { ...base, name: isAbs ? 'Absorbing Medium' : 'Refractive Glass Slab', width: 150, height: 100, refractiveIndex: 1.52, absorptionCoefficient: isAbs ? 1.2 : 0 };
      }
      if (type === 'fiber') {
        const cx = Math.round(pos.x), cy = Math.round(pos.y);
        return {
          ...base,
          name: 'Flexible Optical Fiber',
          coreIndex: 1.50,
          claddingIndex: 1.44,
          coreDiameter: 20,
          claddingDiameter: 36,
          points: [
            { x: cx - 140, y: cy },
            { x: cx - 50, y: cy - 55 },
            { x: cx + 50, y: cy + 55 },
            { x: cx + 140, y: cy },
          ],
        };
      }
      if (type === 'grating') return { ...base, name: 'Diffraction Grating', rotation: 90, width: 120, gratingDensity: 600 };
      if (type === 'single_slit') return { ...base, name: 'Single Slit', rotation: 90, width: 120, slitWidth: 16 };
      if (type === 'double_slit') return { ...base, name: 'Double Slit (Young)', rotation: 90, width: 120, slitWidth: 10, slitSpacing: 26 };
      if (type === 'aperture') return { ...base, name: 'Circular Aperture', rotation: 90, width: 120, slitWidth: 26 };
      if (type === 'detector') return { ...base, name: 'Photodetector', rotation: 90, width: 84 };
      if (type === 'screen') return { ...base, name: 'Observation Screen', rotation: 90, width: 150 };
      if (type === 'ruler') return { ...base, name: 'Optical Ruler', length: 220 };
      if (type === 'protractor') return { ...base, name: 'Circular Protractor', radius: 105 };
      return base;
    }

    handleDrop(e) {
      const type = e.dataTransfer.getData('optical-type');
      const subtype = e.dataTransfer.getData('optical-subtype');
      if (!type) return;
      const world = this.screenToWorld(e.clientX, e.clientY);
      const comp = this.createComponent(type, subtype, world);
      this.components.push(comp);
      this.selectedComponent = comp;
      this.retrace();
      this.onSelectComponent(comp);
      this.onUndoSave();
    }

    resize() {
      this._resizeCanvas();
    }

    _resizeCanvas() {
      const parent = this.canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth || 800;
      const h = parent.clientHeight || 560;
      this._dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (this.canvas.width !== Math.round(w * this._dpr) || this.canvas.height !== Math.round(h * this._dpr)) {
        this.canvas.width = Math.round(w * this._dpr);
        this.canvas.height = Math.round(h * this._dpr);
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
      }
    }

    /* ═══════════════════════════════════════════════════════════
       HIT TESTING & GIZMO GEOMETRY
    ═══════════════════════════════════════════════════════════ */
    _getApproxRadius(comp) {
      if (comp.type === 'mirror' || comp.type === 'grating' || comp.type === 'single_slit' || comp.type === 'double_slit' || comp.type === 'aperture' || comp.type === 'screen' || comp.type === 'detector') {
        return (comp.width || 110) * 0.55;
      }
      if (comp.type === 'lens') return (comp.diameter || 90) * 0.55;
      if (comp.type === 'prism') return (comp.size || 100) * 0.65;
      if (comp.type === 'medium') return Math.hypot(comp.width || 150, comp.height || 100) * 0.5;
      if (comp.type === 'protractor') return (comp.radius || 105) + 12;
      if (comp.type === 'ruler') return (comp.length || 200) * 0.5;
      return 48;
    }

    _getRotateHandleWorld(comp) {
      if (!comp || comp.type === 'fiber') return null;
      const r = Math.max(44, this._getApproxRadius(comp) + 16);
      const rad = M.degToRad(comp.rotation || 0);
      return {
        x: comp.position.x + r * Math.cos(rad),
        y: comp.position.y + r * Math.sin(rad),
      };
    }

    _hitTestFiberHandle(worldPt, comp, tolWorld) {
      if (!comp || comp.type !== 'fiber') return -1;
      const pts = Bezier.getFiberPoints(comp);
      for (let i = 0; i < 4; i++) {
        if (Vec.dist(worldPt, pts[i]) <= tolWorld) return i;
      }
      return -1;
    }

    _hitTestComponents(worldPt, touchPad = 0) {
      for (let i = this.components.length - 1; i >= 0; i--) {
        const c = this.components[i];
        if (c.type === 'fiber') {
          const pts = Bezier.getFiberPoints(c);
          const { pts: samples } = Bezier.sample(pts[0], pts[1], pts[2], pts[3], 36);
          const d = Bezier.distToCurve(worldPt, samples);
          if (d <= (c.claddingDiameter || 36) * 0.55 + touchPad) return c;
          continue;
        }

        const local = M.globalToLocal(worldPt, c.position, c.rotation || 0);
        let hit = false;
        if (c.type === 'laser' || c.type === 'white_light') {
          hit = local.x >= -34 - touchPad && local.x <= 30 + touchPad && Math.abs(local.y) <= 18 + touchPad;
        } else if (c.type === 'mirror' || c.type === 'grating' || c.type === 'single_slit' || c.type === 'double_slit' || c.type === 'aperture' || c.type === 'detector' || c.type === 'screen') {
          const W = c.width || 110;
          hit = Math.abs(local.x) <= W * 0.5 + touchPad && Math.abs(local.y) <= 14 + touchPad;
        } else if (c.type === 'lens') {
          const D = c.diameter || 90;
          hit = Math.abs(local.x) <= 16 + touchPad && Math.abs(local.y) <= D * 0.5 + touchPad;
        } else if (c.type === 'prism') {
          const S = c.size || 100;
          hit = Math.abs(local.x) <= S * 0.55 + touchPad && Math.abs(local.y) <= S * 0.55 + touchPad;
        } else if (c.type === 'medium' || c.type === 'gain_medium') {
          const W = c.width || (c.type === 'gain_medium' ? 160 : 150);
          const H = c.height || (c.type === 'gain_medium' ? 52 : 100);
          hit = Math.abs(local.x) <= W * 0.5 + touchPad && Math.abs(local.y) <= H * 0.5 + touchPad;
        } else if (c.type === 'ruler') {
          const L = c.length || 200;
          hit = local.x >= -6 - touchPad && local.x <= L + 6 + touchPad && Math.abs(local.y) <= 16 + touchPad;
        } else if (c.type === 'protractor') {
          const R = c.radius || 105;
          const dist = Vec.len(local);
          hit = dist <= R + touchPad && local.y <= 10 + touchPad;
        }
        if (hit) return c;
      }
      return null;
    }

    _snapPoint(pt) {
      if (!this.settings.snapToGrid) return pt;
      const g = this.settings.gridSpacing || 25;
      return { x: Math.round(pt.x / g) * g, y: Math.round(pt.y / g) * g };
    }

    /* ═══════════════════════════════════════════════════════════
       MOUSE & TOUCH EVENTS (ULTRA-SMOOTH CLASH-OF-CLANS FEEL)
    ═══════════════════════════════════════════════════════════ */
    _bindEvents() {
      const c = this.canvas;
      c.addEventListener('contextmenu', (e) => e.preventDefault());
      c.addEventListener('mousedown', (e) => this._onMouseDown(e));
      window.addEventListener('mousemove', (e) => this._onMouseMove(e));
      window.addEventListener('mouseup', () => this._onMouseUp());
      c.addEventListener('wheel', (e) => this._onWheel(e), { passive: false });

      c.addEventListener('dragover', (e) => e.preventDefault());
      c.addEventListener('drop', (e) => this.handleDrop(e));

      c.addEventListener('touchstart', (e) => this._onTouchStart(e), { passive: false });
      c.addEventListener('touchmove', (e) => this._onTouchMove(e), { passive: false });
      c.addEventListener('touchend', (e) => this._onTouchEnd(e), { passive: false });
      c.addEventListener('touchcancel', (e) => this._onTouchEnd(e), { passive: false });
    }

    _onMouseDown(e) {
      this._camAnim = null;
      this._vel.x = 0;
      this._vel.y = 0;

      const world = this.screenToWorld(e.clientX, e.clientY);
      const D = this._drag;
      D.startScreen = { x: e.clientX, y: e.clientY };
      D.lastScreen = { x: e.clientX, y: e.clientY };
      D.moved = false;

      // Middle/Right click or Shift+Left -> Pan
      if (e.button === 1 || e.button === 2 || e.shiftKey) {
        D.mode = 'pan';
        D.startPan = { ...this.pan };
        this.canvas.style.cursor = 'grabbing';
        return;
      }

      // 1. Check handles of currently selected component first
      const handleTol = 14 / this.zoom;
      if (this.selectedComponent) {
        if (this.selectedComponent.type === 'fiber') {
          const ptIdx = this._hitTestFiberHandle(world, this.selectedComponent, handleTol);
          if (ptIdx >= 0) {
            D.mode = 'fiber-pt';
            D.fiberPtIdx = ptIdx;
            this.canvas.style.cursor = 'grabbing';
            return;
          }
        } else {
          const rotH = this._getRotateHandleWorld(this.selectedComponent);
          if (rotH && Vec.dist(world, rotH) <= handleTol) {
            D.mode = 'rotate';
            this.canvas.style.cursor = 'crosshair';
            return;
          }
        }
      }

      // 2. Check component hit
      const hit = this._hitTestComponents(world, 4 / this.zoom);
      if (hit) {
        this.selectedComponent = hit;
        this.onSelectComponent(hit);
        // Also check if user clicked directly on a fiber handle of newly selected fiber
        if (hit.type === 'fiber') {
          const ptIdx = this._hitTestFiberHandle(world, hit, handleTol);
          if (ptIdx >= 0) {
            D.mode = 'fiber-pt';
            D.fiberPtIdx = ptIdx;
            this.canvas.style.cursor = 'grabbing';
            return;
          }
          D.fiberStartPts = Bezier.getFiberPoints(hit).map((p) => ({ ...p }));
          D.offsetWorld = { ...world };
        } else {
          D.offsetWorld = Vec.sub(hit.position, world);
        }
        D.mode = 'move';
        this.canvas.style.cursor = 'grabbing';
      } else {
        // Empty space -> deselect & pan smoothly!
        this.selectedComponent = null;
        this.onSelectComponent(null);
        D.mode = 'pan';
        D.startPan = { ...this.pan };
        this.canvas.style.cursor = 'grabbing';
      }
    }

    _onMouseMove(e) {
      const world = this.screenToWorld(e.clientX, e.clientY);
      this.onPointerCoords({ x: Math.round(world.x), y: Math.round(world.y) });

      const D = this._drag;
      if (!D.mode) {
        const hit = this._hitTestComponents(world, 3 / this.zoom);
        this.hoveredComponent = hit;
        this.canvas.style.cursor = hit ? 'grab' : 'default';
        return;
      }

      const dx = e.clientX - D.lastScreen.x;
      const dy = e.clientY - D.lastScreen.y;
      if (Math.hypot(e.clientX - D.startScreen.x, e.clientY - D.startScreen.y) > 3) D.moved = true;

      if (D.mode === 'pan') {
        this.pan.x = D.startPan.x + (e.clientX - D.startScreen.x);
        this.pan.y = D.startPan.y + (e.clientY - D.startScreen.y);
        this._vel.x = dx * 0.85;
        this._vel.y = dy * 0.85;
      } else if (D.mode === 'move' && this.selectedComponent) {
        if (this.selectedComponent.type === 'fiber' && D.fiberStartPts) {
          const dWorld = Vec.sub(world, D.offsetWorld);
          this.selectedComponent.points = D.fiberStartPts.map((p) => this._snapPoint({ x: p.x + dWorld.x, y: p.y + dWorld.y }));
          this._syncFiberCenter(this.selectedComponent);
        } else {
          this.selectedComponent.position = this._snapPoint(Vec.add(world, D.offsetWorld));
        }
        this.retrace();
        this.onUpdateComponent(this.selectedComponent);
      } else if (D.mode === 'fiber-pt' && this.selectedComponent && this.selectedComponent.type === 'fiber') {
        const pts = Bezier.getFiberPoints(this.selectedComponent);
        pts[D.fiberPtIdx] = this._snapPoint(world);
        this._syncFiberCenter(this.selectedComponent);
        this.retrace();
        this.onUpdateComponent(this.selectedComponent);
      } else if (D.mode === 'rotate' && this.selectedComponent) {
        const ang = M.radToDeg(Math.atan2(world.y - this.selectedComponent.position.y, world.x - this.selectedComponent.position.x));
        const res = this._snapAngle(ang, e.shiftKey);
        this.selectedComponent.rotation = res.angle;
        this._angleSnapped = res.snapped;
        this.retrace();
        this.onUpdateComponent(this.selectedComponent);
      }

      D.lastScreen = { x: e.clientX, y: e.clientY };
    }

    _onMouseUp() {
      const D = this._drag;
      if (D.mode && D.moved && (D.mode === 'move' || D.mode === 'rotate' || D.mode === 'fiber-pt')) {
        this.onUndoSave();
      }
      D.mode = null;
      this.canvas.style.cursor = this.hoveredComponent ? 'grab' : 'default';
    }

    _onWheel(e) {
      e.preventDefault();
      this._camAnim = null;
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      const nextZoom = M.clamp(this.zoom * factor, 0.2, 4.5);
      const rect = this.canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      const scale = nextZoom / this.zoom;
      this.pan.x = cx - (cx - this.pan.x) * scale;
      this.pan.y = cy - (cy - this.pan.y) * scale;
      this.zoom = nextZoom;
    }

    /* ─── MULTI-TOUCH (CLASH OF CLANS FEEL) ─────────────────── */
    _onTouchStart(e) {
      e.preventDefault();
      this._camAnim = null;
      this._vel.x = 0;
      this._vel.y = 0;

      const touches = e.touches;
      const T = this._touch;

      if (touches.length === 1) {
        const t = touches[0];
        const world = this.screenToWorld(t.clientX, t.clientY);
        T.startX = t.clientX;
        T.startY = t.clientY;
        T.lastX = t.clientX;
        T.lastY = t.clientY;
        T.startPan = { ...this.pan };
        T.moved = false;
        T.pendingComp = null;
        T.pendingFiberPt = -1;

        const handleTol = 26 / this.zoom;

        // 1. Check handles of selected component first (generous touch radius)
        if (this.selectedComponent) {
          if (this.selectedComponent.type === 'fiber') {
            const ptIdx = this._hitTestFiberHandle(world, this.selectedComponent, handleTol);
            if (ptIdx >= 0) {
              T.mode = 'fiber-pt';
              T.pendingFiberPt = ptIdx;
              return;
            }
          } else {
            const rotH = this._getRotateHandleWorld(this.selectedComponent);
            if (rotH && Vec.dist(world, rotH) <= handleTol) {
              T.mode = 'rotate';
              return;
            }
          }
        }

        // 2. Check component body hit
        const hit = this._hitTestComponents(world, 14 / this.zoom);
        if (hit) {
          T.pendingComp = hit;
          T.mode = 'tap-comp';
          if (hit.type === 'fiber') {
            T.fiberStartPts = Bezier.getFiberPoints(hit).map((p) => ({ ...p }));
            T.offsetWorld = { ...world };
          } else {
            T.offsetWorld = Vec.sub(hit.position, world);
          }
        } else {
          T.mode = 'tap-empty';
        }
      } else if (touches.length === 2) {
        // Two fingers -> Simultaneous Pinch-Zoom + Pan anchored to exact world midpoint!
        const t0 = touches[0], t1 = touches[1];
        const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
        const midX = (t0.clientX + t1.clientX) * 0.5;
        const midY = (t0.clientY + t1.clientY) * 0.5;
        T.mode = 'pinch';
        T.pinchDist0 = Math.max(10, dist);
        T.pinchZoom0 = this.zoom;
        T.pinchWorldMid = this.screenToWorld(midX, midY);
      }
    }

    _onTouchMove(e) {
      e.preventDefault();
      const touches = e.touches;
      const T = this._touch;

      if (touches.length === 2) {
        const t0 = touches[0], t1 = touches[1];
        const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
        const midX = (t0.clientX + t1.clientX) * 0.5;
        const midY = (t0.clientY + t1.clientY) * 0.5;
        if (T.mode !== 'pinch') {
          T.mode = 'pinch';
          T.pinchDist0 = Math.max(10, dist);
          T.pinchZoom0 = this.zoom;
          T.pinchWorldMid = this.screenToWorld(midX, midY);
          return;
        }
        const newZoom = M.clamp(T.pinchZoom0 * (dist / T.pinchDist0), 0.2, 4.5);
        const rect = this.canvas.getBoundingClientRect();
        this.zoom = newZoom;
        this.pan.x = (midX - rect.left) - T.pinchWorldMid.x * newZoom;
        this.pan.y = (midY - rect.top) - T.pinchWorldMid.y * newZoom;
        return;
      }

      if (touches.length !== 1) return;
      const t = touches[0];
      const world = this.screenToWorld(t.clientX, t.clientY);
      const totalDist = Math.hypot(t.clientX - T.startX, t.clientY - T.startY);
      const dx = t.clientX - T.lastX;
      const dy = t.clientY - T.lastY;

      if (!T.moved && totalDist > 7) {
        T.moved = true;
        if (T.mode === 'tap-empty') {
          T.mode = 'pan';
        } else if (T.mode === 'tap-comp' && T.pendingComp) {
          this.selectedComponent = T.pendingComp;
          this.onSelectComponent(T.pendingComp);
          T.mode = 'move';
        }
      }

      if (T.mode === 'pan') {
        this.pan.x = T.startPan.x + (t.clientX - T.startX);
        this.pan.y = T.startPan.y + (t.clientY - T.startY);
        this._vel.x = dx * 0.9;
        this._vel.y = dy * 0.9;
      } else if (T.mode === 'move' && this.selectedComponent) {
        if (this.selectedComponent.type === 'fiber' && T.fiberStartPts) {
          const dWorld = Vec.sub(world, T.offsetWorld);
          this.selectedComponent.points = T.fiberStartPts.map((p) => this._snapPoint({ x: p.x + dWorld.x, y: p.y + dWorld.y }));
          this._syncFiberCenter(this.selectedComponent);
        } else {
          this.selectedComponent.position = this._snapPoint(Vec.add(world, T.offsetWorld));
        }
        this.retrace();
        this.onUpdateComponent(this.selectedComponent);
      } else if (T.mode === 'fiber-pt' && this.selectedComponent && this.selectedComponent.type === 'fiber') {
        const pts = Bezier.getFiberPoints(this.selectedComponent);
        pts[T.pendingFiberPt] = this._snapPoint(world);
        this._syncFiberCenter(this.selectedComponent);
        this.retrace();
        this.onUpdateComponent(this.selectedComponent);
      } else if (T.mode === 'rotate' && this.selectedComponent) {
        const ang = M.radToDeg(Math.atan2(world.y - this.selectedComponent.position.y, world.x - this.selectedComponent.position.x));
        const res = this._snapAngle(ang, false);
        this.selectedComponent.rotation = res.angle;
        this._angleSnapped = res.snapped;
        this.retrace();
        this.onUpdateComponent(this.selectedComponent);
      }

      T.lastX = t.clientX;
      T.lastY = t.clientY;
    }

    _onTouchEnd(e) {
      e.preventDefault();
      const T = this._touch;
      if (e.touches.length === 1 && T.mode === 'pinch') {
        // Seamless transition from 2-finger pinch to 1-finger pan without any jump!
        const t = e.touches[0];
        T.mode = 'pan';
        T.moved = true;
        T.startX = t.clientX;
        T.startY = t.clientY;
        T.lastX = t.clientX;
        T.lastY = t.clientY;
        T.startPan = { ...this.pan };
        return;
      }
      if (e.touches.length === 0) {
        if (!T.moved) {
          if (T.mode === 'tap-comp' && T.pendingComp) {
            this.selectedComponent = T.pendingComp;
            this.onSelectComponent(T.pendingComp);
          } else if (T.mode === 'tap-empty') {
            this.selectedComponent = null;
            this.onSelectComponent(null);
          }
        } else if (T.mode === 'move' || T.mode === 'rotate' || T.mode === 'fiber-pt') {
          this.onUndoSave();
        }
        T.mode = null;
        T.pendingComp = null;
        this._angleSnapped = false;
      }
    }

    _snapAngle(rawDeg, hardStep15 = false) {
      const norm = ((rawDeg % 360) + 360) % 360;
      if (hardStep15) {
        return { angle: (Math.round(norm / 15) * 15) % 360, snapped: true };
      }
      const keyAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];
      const threshold = 4.2; // gentle magnetic snap zone
      for (let i = 0; i < keyAngles.length; i++) {
        if (Math.abs(norm - keyAngles[i]) <= threshold) {
          return { angle: keyAngles[i] % 360, snapped: true };
        }
      }
      return { angle: Math.round(norm * 2) / 2, snapped: false };
    }

    _syncFiberCenter(comp) {
      const pts = comp.points;
      if (!pts || pts.length !== 4) return;
      comp.position = {
        x: Math.round((pts[0].x + pts[3].x) * 0.5),
        y: Math.round((pts[0].y + pts[3].y) * 0.5),
      };
    }

    /* ═══════════════════════════════════════════════════════════
       ANIMATION LOOP & RENDERING
    ═══════════════════════════════════════════════════════════ */
    _startLoop() {
      const tick = () => {
        // Apply smooth camera inertia when panning released
        if (!this._drag.mode && !this._touch.mode) {
          if (Math.abs(this._vel.x) > 0.15 || Math.abs(this._vel.y) > 0.15) {
            this.pan.x += this._vel.x;
            this.pan.y += this._vel.y;
            this._vel.x *= 0.90;
            this._vel.y *= 0.90;
          } else {
            this._vel.x = 0;
            this._vel.y = 0;
          }
        }

        // Smooth animated fitToView
        if (this._camAnim) {
          const ease = 0.18;
          this.zoom += (this._camAnim.targetZoom - this.zoom) * ease;
          this.pan.x += (this._camAnim.targetX - this.pan.x) * ease;
          this.pan.y += (this._camAnim.targetY - this.pan.y) * ease;
          if (
            Math.abs(this._camAnim.targetZoom - this.zoom) < 0.002 &&
            Math.abs(this._camAnim.targetX - this.pan.x) < 0.5 &&
            Math.abs(this._camAnim.targetY - this.pan.y) < 0.5
          ) {
            this.zoom = this._camAnim.targetZoom;
            this.pan.x = this._camAnim.targetX;
            this.pan.y = this._camAnim.targetY;
            this._camAnim = null;
          }
        }

        this.render();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    render() {
      this._resizeCanvas();
      const ctx = this.ctx;
      const dpr = this._dpr;
      const W = this.canvas.width / dpr;
      const H = this.canvas.height / dpr;
      const isDark = this.settings.isDarkMode !== false;

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Background (optical table surface)
      ctx.fillStyle = isDark ? '#070c16' : '#f1f5f9';
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.translate(this.pan.x, this.pan.y);
      ctx.scale(this.zoom, this.zoom);

      // 2. Metric optical breadboard grid
      if (this.settings.showGrid) {
        this._drawGrid(ctx, W, H, isDark);
      }

      // 3. Draw background tools (protractors, rulers) underneath rays
      for (let i = 0; i < this.components.length; i++) {
        const c = this.components[i];
        if (c.type === 'protractor' || c.type === 'ruler') {
          this._drawComponent(ctx, c, isDark);
        }
      }

      // 4. Draw flexible fibers body (underneath internal TIR rays so rays shine clearly inside!)
      for (let i = 0; i < this.components.length; i++) {
        const c = this.components[i];
        if (c.type === 'fiber') {
          this._drawFiber(ctx, c, isDark);
        }
      }

      // 5. Draw optical rays with physical glow
      this._drawRays(ctx, isDark);

      // 6. Draw all other optical components on top of rays
      for (let i = 0; i < this.components.length; i++) {
        const c = this.components[i];
        if (c.type !== 'protractor' && c.type !== 'ruler' && c.type !== 'fiber') {
          this._drawComponent(ctx, c, isDark);
        }
      }

      // 7. Draw normal & angle annotations
      if (this.settings.showNormalLines || this.settings.showAngles) {
        this._drawAnnotations(ctx, isDark);
      }

      // 8. Draw selection gizmos / fiber control handles on very top
      if (this.selectedComponent) {
        this._drawSelectionGizmo(ctx, this.selectedComponent, isDark);
      }

      ctx.restore();
      ctx.restore();
    }

    _drawGrid(ctx, W, H, isDark) {
      const step = this.settings.gridSpacing || 25;
      const major = step * 4;
      const tl = this.screenToWorld(0, 0);
      const br = this.screenToWorld(W, H);
      const startX = Math.floor(tl.x / step) * step;
      const startY = Math.floor(tl.y / step) * step;

      // Minor grid lines
      ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.055)' : 'rgba(15, 23, 42, 0.06)';
      ctx.lineWidth = 1 / this.zoom;
      ctx.beginPath();
      for (let x = startX; x <= br.x; x += step) {
        ctx.moveTo(x, tl.y);
        ctx.lineTo(x, br.y);
      }
      for (let y = startY; y <= br.y; y += step) {
        ctx.moveTo(tl.x, y);
        ctx.lineTo(br.x, y);
      }
      ctx.stroke();

      // Major breadboard lines + tapped hole dots
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.09)' : 'rgba(15, 23, 42, 0.12)';
      ctx.beginPath();
      const mStartX = Math.floor(tl.x / major) * major;
      const mStartY = Math.floor(tl.y / major) * major;
      for (let x = mStartX; x <= br.x; x += major) {
        ctx.moveTo(x, tl.y);
        ctx.lineTo(x, br.y);
      }
      for (let y = mStartY; y <= br.y; y += major) {
        ctx.moveTo(tl.x, y);
        ctx.lineTo(br.x, y);
      }
      ctx.stroke();

      // M6 optical table mounting holes at major intersections
      ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(15, 23, 42, 0.18)';
      const dotR = 1.6 / this.zoom;
      for (let x = mStartX; x <= br.x; x += major) {
        for (let y = mStartY; y <= br.y; y += major) {
          ctx.beginPath();
          ctx.arc(x, y, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    _drawRays(ctx, isDark) {
      if (!this.rays || this.rays.length === 0) return;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (isDark) ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < this.rays.length; i++) {
        const ray = this.rays[i];
        const segs = ray.segments;
        if (!segs || segs.length === 0) continue;

        for (let s = 0; s < segs.length; s++) {
          const seg = segs[s];
          const i0 = M.clamp(seg.intensityStart ?? 1, 0.02, 1);
          const i1 = M.clamp(seg.intensityEnd ?? i0, 0.02, 1);
          const avgI = (i0 + i1) * 0.5;
          const isFading = Math.abs(i0 - i1) > 0.03;

          const col = seg.isWhite ? (isDark ? '#ffffff' : '#64748b') : seg.color;
          const invSqrtZ = 1 / Math.sqrt(this.zoom);

          // Helper to build strokeStyle (solid or fading Beer-Lambert gradient)
          const makeStroke = (alphaScale) => {
            if (!isFading) {
              ctx.globalAlpha = M.clamp(avgI * alphaScale, 0.02, 1);
              return col;
            }
            ctx.globalAlpha = 1;
            const g = ctx.createLinearGradient(seg.a.x, seg.a.y, seg.b.x, seg.b.y);
            const rgb = this._colorToRGBA(col);
            g.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${M.clamp(i0 * alphaScale, 0.02, 1).toFixed(3)})`);
            g.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},${M.clamp(i1 * alphaScale, 0.02, 1).toFixed(3)})`);
            return g;
          };

          ctx.beginPath();
          ctx.moveTo(seg.a.x, seg.a.y);
          ctx.lineTo(seg.b.x, seg.b.y);

          // Pass 1: Soft outer optical bloom (scales with local intensity!)
          ctx.strokeStyle = makeStroke(isDark ? 0.28 : 0.2);
          ctx.lineWidth = (2.5 + 5.5 * avgI) * invSqrtZ;
          ctx.stroke();

          // Pass 2: Main laser beam
          ctx.strokeStyle = makeStroke(0.95);
          ctx.lineWidth = (1.1 + 1.4 * avgI) * invSqrtZ;
          ctx.stroke();

          // Pass 3: Bright coherent white-hot core (only for high-intensity segments)
          if (isDark && avgI > 0.45) {
            ctx.strokeStyle = '#ffffff';
            ctx.globalAlpha = (avgI - 0.35) * 0.65;
            ctx.lineWidth = 0.85 * invSqrtZ;
            ctx.stroke();
          }
        }
      }

      ctx.restore();
    }

    _colorToRGBA(col) {
      if (col === '#ffffff' || col === '#fff') return { r: 255, g: 255, b: 255 };
      if (col && col.startsWith('rgb')) {
        const m = col.match(/\d+/g);
        if (m && m.length >= 3) return { r: +m[0], g: +m[1], b: +m[2] };
      }
      return { r: 255, g: 120, b: 80 };
    }

    /* ═══════════════════════════════════════════════════════════
       FLEXIBLE CURVED OPTICAL FIBER RENDERER
    ═══════════════════════════════════════════════════════════ */
    _drawFiber(ctx, comp, isDark) {
      const pts = Bezier.getFiberPoints(comp);
      const isSelected = this.selectedComponent && this.selectedComponent.id === comp.id;
      const coreD = comp.coreDiameter || 20;
      const cladD = comp.claddingDiameter || 36;

      ctx.save();
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'round';

      const traceBezier = () => {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        ctx.bezierCurveTo(pts[1].x, pts[1].y, pts[2].x, pts[2].y, pts[3].x, pts[3].y);
      };

      // 1. Outer protective jacket (amber/gold polymer)
      traceBezier();
      ctx.strokeStyle = isSelected ? '#38bdf8' : '#d97706';
      ctx.lineWidth = cladD + 6;
      ctx.stroke();

      // 2. Dark jacket body
      traceBezier();
      ctx.strokeStyle = isDark ? '#1c1917' : '#fef3c7';
      ctx.lineWidth = cladD + 2;
      ctx.stroke();

      // 3. Silica cladding
      traceBezier();
      ctx.strokeStyle = isDark ? 'rgba(245, 158, 11, 0.22)' : 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = cladD - 2;
      ctx.stroke();

      // 4. Inner glass core (dark transparent pipe so internal TIR zig-zag laser beams are crystal clear!)
      traceBezier();
      ctx.strokeStyle = comp.isGuiding
        ? (isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(30, 41, 59, 0.85)')
        : (isDark ? '#0f172a' : '#e2e8f0');
      ctx.lineWidth = coreD;
      ctx.stroke();

      // Core-cladding boundary dashed walls (shows where TIR happens!)
      const { pts: samples } = Bezier.sample(pts[0], pts[1], pts[2], pts[3], 48);
      ctx.strokeStyle = comp.isGuiding ? 'rgba(56, 189, 248, 0.6)' : 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      for (const side of [-1, 1]) {
        ctx.beginPath();
        for (let i = 0; i < samples.length; i++) {
          const s = samples[i];
          const wx = s.x + s.nor.x * (side * coreD * 0.5);
          const wy = s.y + s.nor.y * (side * coreD * 0.5);
          if (i === 0) ctx.moveTo(wx, wy); else ctx.lineTo(wx, wy);
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // 5. Metallic FC/PC ferrules at Input (p0) and Output (p3)
      const drawFerrule = (pt, tan, label, accent) => {
        const ang = Math.atan2(tan.y, tan.x);
        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(ang);
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(-8, -cladD * 0.56, 16, cladD * 1.12, 3);
        ctx.fill();
        ctx.stroke();

        // Connector collar ring
        ctx.fillStyle = accent;
        ctx.fillRect(-2, -cladD * 0.56, 4, cladD * 1.12);
        ctx.restore();

        // Upright IN/OUT badge
        ctx.save();
        ctx.font = '600 9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = accent;
        ctx.fillText(label, pt.x, pt.y - cladD * 0.72);
        ctx.restore();
      };

      const tan0 = Bezier.tangent(pts[0], pts[1], pts[2], pts[3], 0);
      const tan1 = Bezier.tangent(pts[0], pts[1], pts[2], pts[3], 1);
      drawFerrule(pts[0], tan0, 'IN', '#22c55e');
      drawFerrule(pts[3], tan1, 'OUT', '#f08833');

      // 6. Numerical Aperture label at midpoint
      const mid = Bezier.point(pts[0], pts[1], pts[2], pts[3], 0.5);
      const n1 = comp.coreIndex || 1.50;
      const n2 = comp.claddingIndex || 1.44;
      const na = Math.sqrt(Math.max(0, n1 * n1 - n2 * n2)).toFixed(2);
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = isDark ? '#fbbf24' : '#b45309';
      ctx.fillText(`NA=${na}`, mid.x, mid.y - cladD * 0.75);

      ctx.restore();
    }

    /* ═══════════════════════════════════════════════════════════
       CAD-QUALITY OPTICAL COMPONENT RENDERERS
    ═══════════════════════════════════════════════════════════ */
    _drawComponent(ctx, comp, isDark) {
      const isSelected = this.selectedComponent && this.selectedComponent.id === comp.id;
      const selCol = '#38bdf8';
      const textCol = isDark ? '#cbd5e1' : '#334155';

      ctx.save();
      ctx.translate(comp.position.x, comp.position.y);
      ctx.rotate(M.degToRad(comp.rotation || 0));

      // ── LASER SOURCE & LAMP ──────────────────────────────────
      if (comp.type === 'laser' || comp.type === 'white_light') {
        const isLamp = comp.type === 'white_light';
        const lampMap = (global.RayTracer && global.RayTracer.LAMP_COLOR_MAP) || {};
        const lampInfo = isLamp ? (lampMap[comp.lampColor || 'white'] || { isWhite: true, color: '#ffffff', wl: 550 }) : null;
        const beamCol = isLamp ? lampInfo.color : M.wavelengthToColor(comp.wavelength || 632.8);
        const on = comp.isOn !== false;

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.roundRect(-29, -12, 54, 28, 5);
        ctx.fill();

        // Anodized aluminum housing
        const grad = ctx.createLinearGradient(0, -14, 0, 14);
        grad.addColorStop(0, '#334155');
        grad.addColorStop(0.4, '#1e293b');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.strokeStyle = isSelected ? selCol : '#64748b';
        ctx.lineWidth = isSelected ? 2.2 : 1.4;
        ctx.beginPath();
        ctx.roundRect(-30, -14, 52, 28, 5);
        ctx.fill();
        ctx.stroke();

        // Heat-sink fins
        ctx.strokeStyle = 'rgba(148,163,184,0.28)';
        ctx.lineWidth = 1.2;
        for (let x = -22; x <= -8; x += 4.5) {
          ctx.beginPath();
          ctx.moveTo(x, -11);
          ctx.lineTo(x, 11);
          ctx.stroke();
        }

        // Brass/steel aperture emitter nose
        ctx.fillStyle = '#475569';
        ctx.fillRect(22, -7, 6, 14);
        ctx.fillStyle = on ? beamCol : '#334155';
        ctx.fillRect(26, -4, 3, 8);

        // Status LED or Spectrum Bar
        if (isLamp && lampInfo.isWhite) {
          const sp = ctx.createLinearGradient(2, -6, 16, -6);
          sp.addColorStop(0, '#8b5cf6');
          sp.addColorStop(0.35, '#22c55e');
          sp.addColorStop(0.65, '#eab308');
          sp.addColorStop(1, '#ef4444');
          ctx.fillStyle = sp;
          ctx.fillRect(2, -4, 15, 8);
        } else {
          ctx.beginPath();
          ctx.arc(10, 0, 4.2, 0, Math.PI * 2);
          ctx.fillStyle = on ? beamCol : '#334155';
          ctx.fill();
          if (on) {
            ctx.strokeStyle = 'rgba(255,255,255,0.6)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Upright wavelength readout below source
        ctx.restore();
        ctx.save();
        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = (isLamp && lampInfo.isWhite) ? textCol : beamCol;
        const lbl = isLamp
          ? (lampInfo.isWhite ? 'WHITE LAMP' : `${(comp.lampColor || 'lamp').toUpperCase()} ${lampInfo.wl}nm`)
          : `${Math.round(comp.wavelength || 632.8)} nm`;
        ctx.fillText(lbl, comp.position.x, comp.position.y + 28);
        ctx.restore();
        return;
      }

      // ── MIRROR / BEAM SPLITTER ───────────────────────────────
      if (comp.type === 'mirror') {
        const W = comp.width || 120;
        const mType = comp.mirrorType || 'plane';
        const isBS = mType === 'partial';

        if (isBS) {
          // Translucent optical beam splitter plate
          ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
          ctx.strokeStyle = isSelected ? selCol : '#38bdf8';
          ctx.lineWidth = isSelected ? 2.2 : 1.5;
          ctx.fillRect(-W * 0.5, -4, W, 8);
          ctx.strokeRect(-W * 0.5, -4, W, 8);

          // 50/50 dielectric coating dashed plane
          ctx.strokeStyle = '#e0f2fe';
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          ctx.moveTo(-W * 0.5, 0);
          ctx.lineTo(W * 0.5, 0);
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          // Concave: bowl curves inward (+Y) opening toward front reflective face (-Y) -> CONVERGES rays
          // Convex: dome bulges outward (-Y) toward front reflective face (-Y) -> DIVERGES rays
          const curveAmt = mType === 'concave' ? 18 : (mType === 'convex' ? -18 : 0);

          // Anti-reflective metallic backing substrate
          ctx.strokeStyle = isDark ? '#334155' : '#64748b';
          ctx.lineWidth = 7;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(-W * 0.5, 2.5);
          ctx.quadraticCurveTo(0, 2.5 + curveAmt, W * 0.5, 2.5);
          ctx.stroke();

          // Precision hatched backing ticks following the mirror curve
          ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.4)' : 'rgba(51,65,85,0.45)';
          ctx.lineWidth = 1;
          for (let x = -W * 0.44; x <= W * 0.44; x += 10) {
            const u = x / (W * 0.5);
            const yOff = 0.5 * curveAmt * (1 - u * u);
            ctx.beginPath();
            ctx.moveTo(x, 4.5 + yOff);
            ctx.lineTo(x - 4, 10 + yOff);
            ctx.stroke();
          }

          // Silvered high-reflectivity front surface
          ctx.strokeStyle = isSelected ? selCol : '#f8fafc';
          ctx.lineWidth = 2.8;
          ctx.beginPath();
          ctx.moveTo(-W * 0.5, -1);
          ctx.quadraticCurveTo(0, -1 + curveAmt, W * 0.5, -1);
          ctx.stroke();

          // Focal point marker for curved mirrors
          if (this.settings.showFocalPoints && (mType === 'concave' || mType === 'convex')) {
            const f = comp.focalLength || 160;
            const fy = mType === 'concave' ? -f : f;
            ctx.fillStyle = '#f08833';
            ctx.beginPath();
            ctx.arc(0, fy, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = '600 9px "JetBrains Mono", monospace';
            ctx.fillText('F', 6, fy + 3);
          }
        }
      }

      // ── OPTICAL LENS ─────────────────────────────────────────
      else if (comp.type === 'lens') {
        const D = comp.diameter || 96;
        const lType = comp.lensType || 'convex';
        const halfD = D * 0.5;
        const bulge = 14;

        const grad = ctx.createLinearGradient(-12, 0, 12, 0);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
        grad.addColorStop(0.5, 'rgba(186, 230, 253, 0.14)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0.28)');

        ctx.fillStyle = grad;
        ctx.strokeStyle = isSelected ? selCol : '#7dd3fc';
        ctx.lineWidth = isSelected ? 2.2 : 1.6;

        ctx.beginPath();
        if (lType === 'concave' || lType === 'plano-concave') {
          const leftIn = lType === 'plano-concave' ? 0 : 7;
          ctx.moveTo(-9, -halfD);
          ctx.lineTo(9, -halfD);
          ctx.quadraticCurveTo(2, 0, 9, halfD);
          ctx.lineTo(-9, halfD);
          ctx.quadraticCurveTo(-9 + leftIn, 0, -9, -halfD);
        } else {
          const leftBulge = lType === 'plano-convex' ? 0 : -bulge;
          ctx.moveTo(0, -halfD);
          ctx.quadraticCurveTo(bulge, 0, 0, halfD);
          ctx.quadraticCurveTo(leftBulge, 0, 0, -halfD);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Principal plane axis line
        ctx.strokeStyle = 'rgba(125, 211, 252, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(0, -halfD - 8);
        ctx.lineTo(0, halfD + 8);
        ctx.stroke();
        ctx.setLineDash([]);

        // Focal points F & F'
        if (this.settings.showFocalPoints) {
          const f = Math.abs(comp.focalLength || 180);
          ctx.fillStyle = '#f08833';
          for (const side of [-1, 1]) {
            ctx.beginPath();
            ctx.arc(side * f, 0, 3.2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.font = '600 9px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText('F', -f, -7);
          ctx.fillText("F'", f, -7);
        }
      }

      // ── PRISM ────────────────────────────────────────────────
      else if (comp.type === 'prism') {
        const verts = global.RayTracer.getPrismVerticesLocal(comp);
        const grad = ctx.createLinearGradient(-40, -40, 40, 40);
        grad.addColorStop(0, 'rgba(125, 211, 252, 0.24)');
        grad.addColorStop(0.5, 'rgba(224, 242, 254, 0.10)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0.26)');

        ctx.fillStyle = grad;
        ctx.strokeStyle = isSelected ? selCol : '#7dd3fc';
        ctx.lineWidth = isSelected ? 2.4 : 1.7;

        ctx.beginPath();
        verts.forEach((v, idx) => (idx === 0 ? ctx.moveTo(v.x, v.y) : ctx.lineTo(v.x, v.y)));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.font = '600 9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = textCol;
        ctx.fillText(`n=${(comp.refractiveIndex || 1.52).toFixed(2)}`, 0, 12);
      }

      // ── ACTIVE LASER GAIN MEDIUM (Ruby, Nd:YAG, Er:YAG, Yb:YAG, He-Ne, CO₂) ──
      else if (comp.type === 'gain_medium') {
        const W = comp.width || 160, H = comp.height || 52;
        const specs = (global.RayTracer && global.RayTracer.GAIN_MEDIA) || {};
        const sp = specs[comp.mediumType || 'ruby'] || { label: 'Ruby', tint: 'rgba(244,63,94,0.34)', stroke: '#fb7185', wlNm: 694.3 };
        const pumped = !!comp._isPumped;

        // Excited glow aura when pumped
        if (pumped) {
          ctx.save();
          ctx.shadowColor = sp.stroke;
          ctx.shadowBlur = 18;
          ctx.fillStyle = sp.tint;
          ctx.beginPath();
          ctx.roundRect(-W * 0.5, -H * 0.5, W, H, 6);
          ctx.fill();
          ctx.restore();
        }

        // Crystal rod / gas plasma tube body
        ctx.fillStyle = sp.tint;
        ctx.strokeStyle = isSelected ? selCol : sp.stroke;
        ctx.lineWidth = isSelected ? 2.4 : 1.8;
        ctx.beginPath();
        ctx.roundRect(-W * 0.5, -H * 0.5, W, H, 6);
        ctx.fill();
        ctx.stroke();

        // Helical flashlamp / electrical pump coils along rod
        ctx.strokeStyle = pumped ? 'rgba(255, 255, 255, 0.55)' : 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 1.2;
        for (let x = -W * 0.38; x <= W * 0.38; x += 18) {
          ctx.beginPath();
          ctx.moveTo(x - 5, -H * 0.48);
          ctx.lineTo(x + 5, H * 0.48);
          ctx.stroke();
        }

        // End Brewster/AR crystal end-caps
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fillRect(-W * 0.5, -H * 0.42, 3, H * 0.84);
        ctx.fillRect(W * 0.5 - 3, -H * 0.42, 3, H * 0.84);

        // Upright label above rod
        ctx.restore();
        ctx.save();
        ctx.font = '700 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = pumped ? sp.stroke : textCol;
        const statusTag = pumped ? ' [LASING]' : ' [PUMP OFF]';
        ctx.fillText(sp.label + statusTag, comp.position.x, comp.position.y - H * 0.5 - 10);
        ctx.restore();
        return;
      }

      // ── REFRACTIVE / ABSORBING MEDIUM ────────────────────────
      else if (comp.type === 'medium') {
        const W = comp.width || 150, H = comp.height || 100;
        const alpha = comp.absorptionCoefficient || 0;
        ctx.fillStyle = alpha > 0
          ? `rgba(100, 116, 139, ${M.clamp(0.22 + alpha * 0.14, 0.22, 0.65)})`
          : 'rgba(56, 189, 248, 0.14)';
        ctx.strokeStyle = isSelected ? selCol : (alpha > 0 ? '#94a3b8' : '#38bdf8');
        ctx.lineWidth = isSelected ? 2.2 : 1.5;
        ctx.beginPath();
        ctx.roundRect(-W * 0.5, -H * 0.5, W, H, 4);
        ctx.fill();
        ctx.stroke();

        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = textCol;
        const label = alpha > 0 ? `n=${(comp.refractiveIndex || 1.5).toFixed(2)}  α=${alpha.toFixed(1)}` : `n = ${(comp.refractiveIndex || 1.52).toFixed(2)}`;
        ctx.fillText(label, 0, -H * 0.5 + 15);
      }

      // ── DIFFRACTION GRATING / SLITS / APERTURE ───────────────
      else if (comp.type === 'grating' || comp.type === 'single_slit' || comp.type === 'double_slit' || comp.type === 'aperture') {
        const W = comp.width || 120;
        ctx.strokeStyle = isSelected ? selCol : '#94a3b8';
        ctx.lineWidth = 4;
        ctx.lineCap = 'butt';

        if (comp.type === 'grating') {
          ctx.strokeStyle = isSelected ? selCol : '#a855f7';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-W * 0.5, 0);
          ctx.lineTo(W * 0.5, 0);
          ctx.stroke();
          // Fine grating grooves
          ctx.strokeStyle = '#e9d5ff';
          ctx.lineWidth = 1;
          for (let x = -W * 0.45; x <= W * 0.45; x += 6) {
            ctx.beginPath();
            ctx.moveTo(x, -5);
            ctx.lineTo(x, 5);
            ctx.stroke();
          }
        } else if (comp.type === 'single_slit' || comp.type === 'aperture') {
          const gap = Math.max(8, comp.slitWidth || 16);
          ctx.beginPath();
          ctx.moveTo(-W * 0.5, 0);
          ctx.lineTo(-gap * 0.5, 0);
          ctx.moveTo(gap * 0.5, 0);
          ctx.lineTo(W * 0.5, 0);
          ctx.stroke();
        } else if (comp.type === 'double_slit') {
          const d = Math.max(12, Math.min(80, comp.slitSpacing || 26));
          const a = Math.max(6, comp.slitWidth || 10);
          ctx.beginPath();
          ctx.moveTo(-W * 0.5, 0);
          ctx.lineTo(-d * 0.5 - a * 0.5, 0);
          ctx.moveTo(-d * 0.5 + a * 0.5, 0);
          ctx.lineTo(d * 0.5 - a * 0.5, 0);
          ctx.moveTo(d * 0.5 + a * 0.5, 0);
          ctx.lineTo(W * 0.5, 0);
          ctx.stroke();
        }
      }

      // ── PHOTODETECTOR & OBSERVATION SCREEN ───────────────────
      else if (comp.type === 'detector' || comp.type === 'screen') {
        const W = comp.width || (comp.type === 'detector' ? 84 : 150);
        const isDet = comp.type === 'detector';
        const hitActive = (comp._receivedPower || 0) > 0;

        // Backing body
        ctx.fillStyle = isDet ? '#0f172a' : '#1e293b';
        ctx.strokeStyle = isSelected ? selCol : (hitActive ? '#22c55e' : '#64748b');
        ctx.lineWidth = isSelected ? 2.2 : 1.6;
        ctx.beginPath();
        ctx.roundRect(-W * 0.5, -2, W, 12, 3);
        ctx.fill();
        ctx.stroke();

        // Active photodiode sensor strip
        ctx.fillStyle = hitActive ? '#22c55e' : (isDet ? '#334155' : '#475569');
        ctx.fillRect(-W * 0.44, -2.5, W * 0.88, 3);

        // Glowing hit spots on screen
        if (comp._hits && comp._hits.length > 0) {
          for (let h = 0; h < comp._hits.length; h++) {
            const ht = comp._hits[h];
            const lx = (ht.u - 0.5) * W;
            ctx.fillStyle = ht.color;
            ctx.beginPath();
            ctx.arc(lx, -2, 3.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Upright power readout badge placed cleanly OUTSIDE behind the detector at any rotation
        if (isDet) {
          const badgePos = M.localToGlobal({ x: 0, y: 30 }, comp.position, comp.rotation || 0);
          ctx.restore();
          ctx.save();
          const pStr = hitActive ? `${comp._receivedPower.toFixed(2)} mW` : '0.00 mW';
          ctx.font = '700 10.5px "JetBrains Mono", monospace';
          const tw = ctx.measureText(pStr).width;
          const bw = tw + 14;
          const bh = 20;

          // Clean pill background so readout is always crisp and outside the detector body
          ctx.fillStyle = isDark ? 'rgba(11, 17, 32, 0.92)' : 'rgba(255, 255, 255, 0.94)';
          ctx.strokeStyle = hitActive ? '#22c55e' : 'rgba(148, 163, 184, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.roundRect(badgePos.x - bw * 0.5, badgePos.y - bh * 0.5, bw, bh, 5);
          ctx.fill();
          ctx.stroke();

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = hitActive ? '#4ade80' : textCol;
          ctx.fillText(pStr, badgePos.x, badgePos.y + 0.5);
          ctx.restore();
          return;
        }
      }

      // ── OPTICAL RULER ────────────────────────────────────────
      else if (comp.type === 'ruler') {
        const L = comp.length || 220;
        ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.82)' : 'rgba(241, 245, 249, 0.9)';
        ctx.strokeStyle = isSelected ? selCol : '#f08833';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(0, -10, L, 20, 3);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = textCol;
        ctx.fillStyle = textCol;
        ctx.font = '500 8px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        for (let x = 0; x <= L; x += 10) {
          const isMaj = x % 50 === 0;
          ctx.lineWidth = isMaj ? 1.2 : 0.7;
          ctx.beginPath();
          ctx.moveTo(x, -10);
          ctx.lineTo(x, isMaj ? 0 : -4);
          ctx.stroke();
          if (isMaj && x > 0 && x < L) {
            ctx.fillText(`${x}`, x, 8);
          }
        }
      }

      // ── CIRCULAR PROTRACTOR (FIXED UPRIGHT DEGREE LABELS!) ───
      else if (comp.type === 'protractor') {
        const R = comp.radius || 105;

        // Translucent graduated semicircle
        ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.05)' : 'rgba(14, 165, 233, 0.06)';
        ctx.strokeStyle = isSelected ? selCol : 'rgba(240, 136, 51, 0.75)';
        ctx.lineWidth = isSelected ? 2.2 : 1.5;

        ctx.beginPath();
        ctx.arc(0, 0, R, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner reference arc
        ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.18)' : 'rgba(51, 65, 85, 0.18)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, R - 26, Math.PI, 0);
        ctx.stroke();

        // Degree ticks (every 5°, major every 10°, bold every 30°)
        for (let deg = 0; deg <= 180; deg += 5) {
          const rad = M.degToRad(180 - deg);
          const is30 = deg % 30 === 0;
          const is10 = deg % 10 === 0;
          const tickLen = is30 ? 12 : (is10 ? 8 : 4);

          ctx.strokeStyle = is30
            ? 'rgba(240, 136, 51, 0.85)'
            : (isDark ? 'rgba(148, 163, 184, 0.42)' : 'rgba(51, 65, 85, 0.42)');
          ctx.lineWidth = is30 ? 1.4 : 0.9;

          const x1 = R * Math.cos(rad);
          const y1 = -R * Math.sin(rad);
          const x2 = (R - tickLen) * Math.cos(rad);
          const y2 = -(R - tickLen) * Math.sin(rad);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Always upright, perfectly centered numbers every 30° (clean & readable!)
          if (is30) {
            const labelR = R - 21;
            const lx = labelR * Math.cos(rad);
            const ly = -labelR * Math.sin(rad);
            ctx.save();
            ctx.translate(lx, ly);
            // Counter-rotate by component rotation so numbers are ALWAYS upright on screen!
            ctx.rotate(-M.degToRad(comp.rotation || 0));
            ctx.font = '600 9.5px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = isDark ? '#e2e8f0' : '#0f172a';
            ctx.fillText(`${deg}°`, 0, 0);
            ctx.restore();
          }
        }

        // 90° vertical normal reference line
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -R);
        ctx.stroke();
        ctx.setLineDash([]);

        // Center optical crosshair
        ctx.strokeStyle = '#f08833';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-7, 0);
        ctx.lineTo(7, 0);
        ctx.moveTo(0, -7);
        ctx.lineTo(0, 3);
        ctx.stroke();
      }

      ctx.restore();
    }

    _drawAnnotations(ctx, isDark) {
      for (let i = 0; i < this.annotations.length; i++) {
        const a = this.annotations[i];
        if (this.settings.showNormalLines) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(a.point.x - a.normal.x * 45, a.point.y - a.normal.y * 45);
          ctx.lineTo(a.point.x + a.normal.x * 45, a.point.y + a.normal.y * 45);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        if (this.settings.showAngles) {
          ctx.font = '600 10px "JetBrains Mono", monospace';
          ctx.fillStyle = isDark ? '#fbbf24' : '#b45309';
          ctx.fillText(`${a.angleDeg.toFixed(1)}°`, a.point.x + a.normal.x * 24 + 6, a.point.y + a.normal.y * 24);
        }
      }
    }

    _drawSelectionGizmo(ctx, comp) {
      if (comp.type === 'fiber') {
        const pts = Bezier.getFiberPoints(comp);
        // Dashed tangent guide lines
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 1.2 / this.zoom;
        ctx.setLineDash([4 / this.zoom, 4 / this.zoom]);
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        ctx.lineTo(pts[1].x, pts[1].y);
        ctx.moveTo(pts[3].x, pts[3].y);
        ctx.lineTo(pts[2].x, pts[2].y);
        ctx.stroke();
        ctx.setLineDash([]);

        const handleSpecs = [
          { pt: pts[0], col: '#22c55e', lbl: 'IN' },
          { pt: pts[1], col: '#38bdf8', lbl: 'C1' },
          { pt: pts[2], col: '#38bdf8', lbl: 'C2' },
          { pt: pts[3], col: '#f08833', lbl: 'OUT' },
        ];
        const r = 8 / this.zoom;
        for (let i = 0; i < handleSpecs.length; i++) {
          const h = handleSpecs[i];
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = h.col;
          ctx.lineWidth = 2.4 / this.zoom;
          ctx.beginPath();
          ctx.arc(h.pt.x, h.pt.y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
        return;
      }

      const rotH = this._getRotateHandleWorld(comp);
      if (!rotH) return;

      ctx.save();
      // Dashed ring around selected component
      const rad = Math.max(44, this._getApproxRadius(comp) + 16);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.2 / this.zoom;
      ctx.setLineDash([4 / this.zoom, 4 / this.zoom]);
      ctx.beginPath();
      ctx.arc(comp.position.x, comp.position.y, rad, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Line to rotation handle
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(comp.position.x, comp.position.y);
      ctx.lineTo(rotH.x, rotH.y);
      ctx.stroke();

      // Rotation handle knob
      const isRotating = this._drag.mode === 'rotate' || this._touch.mode === 'rotate';
      const knobCol = (isRotating && this._angleSnapped) ? '#22c55e' : '#f08833';
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = knobCol;
      ctx.lineWidth = 2.4 / this.zoom;
      ctx.beginPath();
      ctx.arc(rotH.x, rotH.y, 7.5 / this.zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Live angle badge while rotating (highlights green on magnetic snap: 0°, 30°, 45°, 60°, 90°, 180°...)
      if (isRotating) {
        const degText = `${Math.round((comp.rotation || 0) * 10) / 10}°`;
        const bx = rotH.x;
        const by = rotH.y - 20 / this.zoom;
        ctx.font = `700 ${11 / this.zoom}px "JetBrains Mono", monospace`;
        const tw = ctx.measureText(degText).width;
        const pw = tw + 12 / this.zoom;
        const ph = 18 / this.zoom;
        ctx.fillStyle = 'rgba(11, 17, 32, 0.94)';
        ctx.strokeStyle = knobCol;
        ctx.lineWidth = 1.4 / this.zoom;
        ctx.beginPath();
        ctx.roundRect(bx - pw * 0.5, by - ph * 0.5, pw, ph, 4 / this.zoom);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = knobCol;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(degText, bx, by);
      }
      ctx.restore();
    }
  }

  global.OpticalCanvas2D = OpticalCanvas2D;
})(typeof window !== 'undefined' ? window : global);
