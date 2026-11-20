/**
 * LASER SCIENCE & TECHNOLOGY — VIRTUAL INTERACTIVE LABORATORY (v2.0)
 * Main Application Controller
 * Connects: Welcome Screen, OpticalCanvas2D, Bench3D, 100 Experiments,
 * Law Box, Synced Slider+Keyboard Properties Inspector, Theory, Quiz, I18n
 */
(function (global) {
  'use strict';

  const M = global.OpticsMath;
  const I18n = global.LabI18n;

  global.labDragStart = function (e) {
    const card = e.currentTarget;
    e.dataTransfer.setData('optical-type', card.dataset.type);
    e.dataTransfer.setData('optical-subtype', card.dataset.subtype || '');
    e.dataTransfer.effectAllowed = 'copy';
  };

  global.labClickAdd = function (cardEl) {
    if (global.app) {
      global.app.addComponentToCenter(cardEl.dataset.type, cardEl.dataset.subtype || '');
      // Auto-close left drawer on small screens
      if (window.innerWidth <= 820) {
        document.getElementById('sidebar-left')?.classList.add('drawer-closed');
      }
    }
  };

  class LabApp {
    constructor() {
      this.canvas2d = null;
      this.bench3d = null;
      this.mode = '2d';
      this.activeExp = null;
      this.isFreeMode = false;
      this.selectedComp = null;

      this.history = [];
      this.histIdx = -1;

      this.settings = {
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
    }

    init() {
      I18n.setLang('ar');
      I18n.applyToDOM();

      const canvasEl = document.getElementById('lab-canvas');
      this.canvas2d = new global.OpticalCanvas2D(canvasEl, {
        settings: this.settings,
        onSelectComponent: (c) => this._onSelect(c),
        onUpdateComponent: (c) => this._onUpdate(c),
        onUndoSave: () => this._pushHistory(),
        onPointerCoords: ({ x, y }) => {
          const ex = document.getElementById('st-x');
          const ey = document.getElementById('st-y');
          if (ex) ex.textContent = x;
          if (ey) ey.textContent = y;
        },
        onRayStats: (compCount, rayCount, detInfo) => {
          const cc = document.getElementById('st-comp-count');
          const rc = document.getElementById('st-ray-count');
          if (cc) cc.textContent = compCount;
          if (rc) rc.textContent = rayCount;
          const pill = document.getElementById('detector-pill');
          const val = document.getElementById('detector-val');
          if (pill && val) {
            pill.style.display = detInfo.active ? 'flex' : 'none';
            val.textContent = `${detInfo.power.toFixed(2)} mW`;
          }
          if (this.mode === '3d' && this.bench3d) {
            this.bench3d.syncFrom2D(this.canvas2d.components, this.canvas2d.rays);
          }
        },
      });

      this._populateQuickSelect();
      this._populateModal('', '');
      this._bindEvents();
      this._startFPS();

      // Preload EXP-001 quietly behind the welcome screen so bench is immediately alive
      this.loadExperiment('exp_001', true);
    }

    /* ═══════════════════════════════════════════════════════════
       EXPERIMENTS & FREE MODE
    ═══════════════════════════════════════════════════════════ */
    loadExperiment(expId, instantFit = false) {
      const db = global.EXPERIMENTS_DB || [];
      const exp = db.find((e) => e.id === expId);
      if (!exp) return;

      this.activeExp = exp;
      this.isFreeMode = false;
      this.selectedComp = null;

      const cloned = JSON.parse(JSON.stringify(exp.components || []));
      this.canvas2d.selectedComponent = null;
      this.canvas2d.setComponents(cloned);
      setTimeout(() => this.canvas2d.fitToView(90, instantFit), 25);

      this._pushHistory();
      this._updateDropHint();
      this._renderLawBox(exp);
      this._renderTheory(exp);
      this._renderQuiz(exp);
      this._renderProperties(null);

      const sel = document.getElementById('quick-select');
      if (sel) sel.value = exp.id;

      const lang = I18n.getLang();
      const title = (lang === 'ar' && exp.titleAr) ? exp.titleAr : exp.title;
      this._setStatus(`EXP-${exp.num}`, title);

      const modal = document.getElementById('exp-modal');
      if (modal) modal.style.display = 'none';
    }

    enterFreeMode() {
      this.activeExp = null;
      this.isFreeMode = true;
      this.selectedComp = null;
      this.canvas2d.selectedComponent = null;
      this.canvas2d.setComponents([]);
      this.canvas2d.fitToView(90, true);
      this._pushHistory();
      this._updateDropHint();

      document.getElementById('law-box')?.classList.add('hidden');
      const sel = document.getElementById('quick-select');
      if (sel) sel.value = '';

      this._renderProperties(null);
      this._renderTheory(null);
      this._renderQuiz(null);
      this._setStatus('FREE', I18n.t('statusFreeMode'));
    }

    nextExperiment() {
      const db = global.EXPERIMENTS_DB || [];
      if (!db.length) return;
      const idx = this.activeExp ? db.findIndex((e) => e.id === this.activeExp.id) : -1;
      this.loadExperiment(db[(idx + 1) % db.length].id);
    }

    prevExperiment() {
      const db = global.EXPERIMENTS_DB || [];
      if (!db.length) return;
      const idx = this.activeExp ? db.findIndex((e) => e.id === this.activeExp.id) : 0;
      this.loadExperiment(db[(idx - 1 + db.length) % db.length].id);
    }

    addComponentToCenter(type, subtype) {
      const rect = this.canvas2d.canvas.getBoundingClientRect();
      const center = this.canvas2d.screenToWorld(
        rect.left + rect.width * 0.5 + (Math.random() - 0.5) * 40,
        rect.top + rect.height * 0.5 + (Math.random() - 0.5) * 40
      );
      const comp = this.canvas2d.createComponent(type, subtype, center);
      this.canvas2d.components.push(comp);
      this.canvas2d.selectedComponent = comp;
      this.canvas2d.retrace();
      this._onSelect(comp);
      this._pushHistory();
      this._updateDropHint();
    }

    /* ═══════════════════════════════════════════════════════════
       2D / 3D VIEW SWITCHING
    ═══════════════════════════════════════════════════════════ */
    setMode(mode) {
      if (this.mode === mode) return;
      this.mode = mode;
      document.getElementById('btn-mode-2d')?.classList.toggle('active', mode === '2d');
      document.getElementById('btn-mode-3d')?.classList.toggle('active', mode === '3d');

      const c2d = document.getElementById('lab-canvas');
      const c3d = document.getElementById('lab-3d-container');

      if (mode === '3d') {
        if (c2d) c2d.style.display = 'none';
        if (c3d) c3d.style.display = 'block';
        if (!this.bench3d && typeof global.Bench3D !== 'undefined') {
          this.bench3d = new global.Bench3D('lab-3d-container');
        }
        if (this.bench3d) {
          this.bench3d.resize();
          this.bench3d.syncFrom2D(this.canvas2d.components, this.canvas2d.rays);
        }
      } else {
        if (c3d) c3d.style.display = 'none';
        if (c2d) c2d.style.display = 'block';
        this.canvas2d.resize();
      }
    }

    /* ═══════════════════════════════════════════════════════════
       PROPERTIES INSPECTOR (SLIDER + KEYBOARD NUMBER INPUT)
    ═══════════════════════════════════════════════════════════ */
    _onSelect(comp) {
      this.selectedComp = comp;
      this._renderProperties(comp);
      if (comp) this._switchTab('properties');
    }

    _onUpdate(comp) {
      // Live-update X, Y, Rotation number inputs without rebuilding DOM
      if (!comp || !this.selectedComp || comp.id !== this.selectedComp.id) return;
      const setVal = (id, v) => {
        const el = document.getElementById(id);
        if (el && document.activeElement !== el) el.value = v;
      };
      setVal('prop__pos_x', Math.round(comp.position.x));
      setVal('prop__pos_y', Math.round(comp.position.y));
      setVal('prop__rotation_r', Math.round((comp.rotation || 0) * 10) / 10);
      setVal('prop__rotation_n', Math.round((comp.rotation || 0) * 10) / 10);
    }

    _renderProperties(comp) {
      const empty = document.getElementById('no-selection-msg');
      const editor = document.getElementById('prop-editor');
      const titleEl = document.getElementById('prop-title');
      const fields = document.getElementById('prop-fields');
      if (!empty || !editor || !fields) return;

      if (!comp) {
        empty.style.display = 'block';
        editor.style.display = 'none';
        return;
      }

      empty.style.display = 'none';
      editor.style.display = 'block';
      titleEl.textContent = comp.name || comp.type.toUpperCase();
      fields.innerHTML = '';

      const t = (k) => I18n.t(k);

      const addNumber = (label, key, val, step = 1) => {
        fields.insertAdjacentHTML('beforeend', `
          <div class="prop-row">
            <label class="prop-label">${label}</label>
            <input type="number" class="prop-num prop-num-full" id="prop_${key}" value="${val}" step="${step}"
              oninput="app.updateProp('${key}', parseFloat(this.value))">
          </div>`);
      };

      const addCombo = (label, key, min, max, step, val, unit = '') => {
        fields.insertAdjacentHTML('beforeend', `
          <div class="prop-row">
            <label class="prop-label">${label}</label>
            <div class="prop-combo">
              <input type="range" class="prop-range" id="prop_${key}_r" min="${min}" max="${max}" step="${step}" value="${val}"
                oninput="const n=document.getElementById('prop_${key}_n');if(n)n.value=this.value;app.updateProp('${key}', parseFloat(this.value))">
              <input type="number" class="prop-num" id="prop_${key}_n" min="${min}" max="${max}" step="${step}" value="${val}"
                oninput="const r=document.getElementById('prop_${key}_r');if(r)r.value=this.value;app.updateProp('${key}', parseFloat(this.value))">
              <span class="prop-unit">${unit}</span>
            </div>
          </div>`);
      };

      const addSelect = (label, key, options, val) => {
        const opts = options.map(([v, l]) => `<option value="${v}"${v === val ? ' selected' : ''}>${l}</option>`).join('');
        fields.insertAdjacentHTML('beforeend', `
          <div class="prop-row">
            <label class="prop-label">${label}</label>
            <select class="prop-select" onchange="app.updateProp('${key}', this.value)">${opts}</select>
          </div>`);
      };

      const addCheck = (label, key, val) => {
        fields.insertAdjacentHTML('beforeend', `
          <label class="set-row">
            <span>${label}</span>
            <input type="checkbox" ${val ? 'checked' : ''} onchange="app.updateProp('${key}', this.checked)">
          </label>`);
      };

      // Position & Rotation (for non-fiber; fiber uses draggable control points + center)
      addNumber(t('propPosX'), '_pos_x', Math.round(comp.position.x));
      addNumber(t('propPosY'), '_pos_y', Math.round(comp.position.y));
      if (comp.type !== 'fiber') {
        addCombo(t('propRotation'), '_rotation', 0, 360, 0.5, Math.round((comp.rotation || 0) * 10) / 10, '°');
      }

      if (comp.type === 'laser') {
        addCombo(t('propWavelength'), 'wavelength', 380, 780, 0.5, comp.wavelength || 632.8, 'nm');
        addCombo(t('propPower'), 'power', 0.1, 100, 0.1, comp.power || 5, 'mW');
        addCombo(t('propRayCount'), 'rayCount', 1, 15, 1, comp.rayCount || this.settings.laserRayDensity || 3, '');
        addCombo(t('propBeamWidth'), 'beamWidth', 2, 60, 1, comp.beamWidth || 12, 'px');
        addCombo(t('propBeamDiv'), 'beamDivergence', 0, 25, 0.5, comp.beamDivergence || 0, '°');
        addCheck(t('propIsOn'), 'isOn', comp.isOn !== false);
      } else if (comp.type === 'white_light') {
        const isAr = I18n.getLang() === 'ar';
        addSelect(t('propLampColor'), 'lampColor', [
          ['white',  isAr ? 'أبيض (كل الأطوال الموجية 400-700nm)' : 'White (Full Spectrum 400-700nm)'],
          ['red',    isAr ? 'أحمر (650 nm)' : 'Red (650 nm)'],
          ['green',  isAr ? 'أخضر (532 nm)' : 'Green (532 nm)'],
          ['blue',   isAr ? 'أزرق (455 nm)' : 'Blue (455 nm)'],
          ['yellow', isAr ? 'أصفر (580 nm)' : 'Yellow (580 nm)'],
          ['violet', isAr ? 'بنفسجي (405 nm)' : 'Violet (405 nm)'],
        ], comp.lampColor || 'white');
        addCombo(t('propRayCount'), 'rayCount', 1, 15, 1, comp.rayCount || this.settings.laserRayDensity || 3, '');
        addCombo(t('propPower'), 'power', 1, 100, 1, comp.power || 10, 'mW');
        addCombo(t('propBeamWidth'), 'beamWidth', 4, 40, 1, comp.beamWidth || 16, 'px');
        addCheck(t('propIsOn'), 'isOn', comp.isOn !== false);
      } else if (comp.type === 'gain_medium') {
        addSelect(t('propGainMedium'), 'mediumType', [
          ['ruby',        'Ruby — Cr³⁺:Al₂O₃ (694.3 nm)'],
          ['nd_yag',      'Nd:YAG — Neodymium (1064 / 532 nm)'],
          ['er_yag',      'Er:YAG — Erbium (2940 nm)'],
          ['yb_yag',      'Yb:YAG — Ytterbium (1030 nm)'],
          ['he_ne',       'He-Ne Gas Tube (632.8 nm)'],
          ['co2',         'CO₂ Gas Laser (10.6 µm)'],
          ['ti_sapphire', 'Ti:Sapphire (800 nm)'],
        ], comp.mediumType || 'ruby');
        addCombo(t('propGainCoeff'), 'gainCoefficient', 1.0, 3.5, 0.05, comp.gainCoefficient || 1.5, 'x');
        addCombo(t('propWidth'), 'width', 80, 320, 5, comp.width || 160, 'px');
        addCombo(t('propHeight'), 'height', 30, 120, 4, comp.height || 52, 'px');
        addCheck(t('propPumpActive'), 'pumpActive', !!comp.pumpActive);
      } else if (comp.type === 'mirror') {
        addSelect(t('propMirrorType'), 'mirrorType', [
          ['plane', t('toolPlaneMirror')],
          ['concave', t('toolConcaveMirror')],
          ['convex', t('toolConvexMirror')],
          ['partial', t('toolBeamSplitter')],
        ], comp.mirrorType || 'plane');
        addCombo(t('propReflectivity'), 'reflectivity', 0.05, 1.0, 0.01, comp.reflectivity ?? 0.99, '');
        addCombo(t('propWidth'), 'width', 30, 360, 5, comp.width || 120, 'px');
        if (comp.mirrorType === 'concave' || comp.mirrorType === 'convex') {
          addCombo(t('propFocalLength'), 'focalLength', 50, 500, 5, comp.focalLength || 160, 'px');
        }
      } else if (comp.type === 'lens') {
        addSelect(t('propLensType'), 'lensType', [
          ['convex', t('toolConvexLens')],
          ['concave', t('toolConcaveLens')],
          ['plano-convex', t('toolPlanoConvex')],
          ['plano-concave', t('toolPlanoConcave')],
        ], comp.lensType || 'convex');
        addCombo(t('propFocalLength'), 'focalLength', 40, 500, 5, comp.focalLength || 180, 'px');
        addCombo(t('propDiameter'), 'diameter', 30, 240, 5, comp.diameter || 96, 'px');
        addCombo(t('propRefractiveIndex'), 'refractiveIndex', 1.3, 2.5, 0.01, comp.refractiveIndex || 1.52, '');
      } else if (comp.type === 'prism') {
        addSelect(t('propPrismType'), 'prismType', [
          ['triangular', t('toolTriangularPrism')],
          ['rectangular', t('toolRectangularPrism')],
          ['pentagonal', t('toolPentagonalPrism')],
        ], comp.prismType || 'triangular');
        addCombo(t('propRefractiveIndex'), 'refractiveIndex', 1.3, 2.6, 0.01, comp.refractiveIndex || 1.58, '');
        addCombo(t('propSize'), 'size', 50, 260, 5, comp.size || 110, 'px');
      } else if (comp.type === 'medium') {
        addCombo(t('propRefractiveIndex'), 'refractiveIndex', 1.0, 2.6, 0.01, comp.refractiveIndex || 1.52, '');
        addCombo(t('propAbsorption'), 'absorptionCoefficient', 0, 5, 0.05, comp.absorptionCoefficient || 0, '');
        addCombo(t('propWidth'), 'width', 40, 340, 5, comp.width || 150, 'px');
        addCombo(t('propHeight'), 'height', 40, 260, 5, comp.height || 100, 'px');
      } else if (comp.type === 'fiber') {
        addCombo(t('propCoreIndex'), 'coreIndex', 1.40, 1.80, 0.01, comp.coreIndex || 1.50, '');
        addCombo(t('propCladdingIndex'), 'claddingIndex', 1.30, 1.60, 0.01, comp.claddingIndex || 1.44, '');
        addCombo(t('propCoreDiameter'), 'coreDiameter', 10, 42, 2, comp.coreDiameter || 20, 'px');
        const n1 = comp.coreIndex || 1.50;
        const n2 = comp.claddingIndex || 1.44;
        const na = Math.sqrt(Math.max(0, n1 * n1 - n2 * n2));
        const acc = M.radToDeg(Math.asin(Math.min(1, na))).toFixed(1);
        fields.insertAdjacentHTML('beforeend', `<div class="prop-na-box" id="fiber-na-box">NA = ${na.toFixed(3)} &nbsp;|&nbsp; θ<sub>max</sub> = ${acc}°</div>`);
      } else if (comp.type === 'grating') {
        addCombo(t('propGratingDensity'), 'gratingDensity', 100, 2400, 10, comp.gratingDensity || 600, 'l/mm');
        addCombo(t('propWidth'), 'width', 40, 300, 5, comp.width || 120, 'px');
      } else if (comp.type === 'single_slit' || comp.type === 'aperture') {
        addCombo(t('propSlitWidth'), 'slitWidth', 4, 80, 1, comp.slitWidth || 16, 'px');
        addCombo(t('propWidth'), 'width', 40, 300, 5, comp.width || 120, 'px');
      } else if (comp.type === 'double_slit') {
        addCombo(t('propSlitWidth'), 'slitWidth', 4, 30, 1, comp.slitWidth || 10, 'px');
        addCombo(t('propSlitSpacing'), 'slitSpacing', 12, 80, 1, comp.slitSpacing || 26, 'px');
        addCombo(t('propWidth'), 'width', 40, 300, 5, comp.width || 120, 'px');
      } else if (comp.type === 'detector' || comp.type === 'screen') {
        addCombo(t('propWidth'), 'width', 40, 340, 5, comp.width || 90, 'px');
      } else if (comp.type === 'ruler') {
        addCombo(t('propLength'), 'length', 80, 600, 10, comp.length || 220, 'px');
      } else if (comp.type === 'protractor') {
        addCombo(t('propRadius'), 'radius', 60, 240, 5, comp.radius || 105, 'px');
      }
    }

    updateProp(key, val) {
      const comp = this.selectedComp;
      if (!comp || (typeof val === 'number' && Number.isNaN(val))) return;

      if (key === '_pos_x' || key === '_pos_y') {
        const dx = key === '_pos_x' ? val - comp.position.x : 0;
        const dy = key === '_pos_y' ? val - comp.position.y : 0;
        comp.position = { x: comp.position.x + dx, y: comp.position.y + dy };
        if (comp.type === 'fiber' && comp.points) {
          comp.points = comp.points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
        }
      } else if (key === '_rotation') {
        comp.rotation = val;
      } else {
        comp[key] = val;
        if (key === 'coreDiameter') comp.claddingDiameter = val + 16;
      }

      this.canvas2d.retrace();

      if (key === 'mirrorType' || key === 'lensType' || key === 'prismType') {
        this._renderProperties(comp);
      }
      if (comp.type === 'fiber' && (key === 'coreIndex' || key === 'claddingIndex')) {
        const box = document.getElementById('fiber-na-box');
        if (box) {
          const n1 = comp.coreIndex || 1.50, n2 = comp.claddingIndex || 1.44;
          const na = Math.sqrt(Math.max(0, n1 * n1 - n2 * n2));
          const acc = M.radToDeg(Math.asin(Math.min(1, na))).toFixed(1);
          box.innerHTML = `NA = ${na.toFixed(3)} &nbsp;|&nbsp; θ<sub>max</sub> = ${acc}°`;
        }
      }
    }

    /* ═══════════════════════════════════════════════════════════
       LAW BOX, THEORY, QUIZ, LIBRARY MODAL
    ═══════════════════════════════════════════════════════════ */
    _formatLatex(latex) {
      if (!latex) return '';
      let s = String(latex);
      s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '<span class="math-frac"><span class="math-num">$1</span><span class="math-den">$2</span></span>');
      s = s.replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');
      s = s.replace(/\\text\{([^{}]+)\}/g, '$1');
      const map = {
        '\\theta': 'θ', '\\lambda': 'λ', '\\alpha': 'α', '\\beta': 'β', '\\gamma': 'γ',
        '\\delta': 'δ', '\\Delta': 'Δ', '\\epsilon': 'ε', '\\eta': 'η', '\\mu': 'μ',
        '\\nu': 'ν', '\\pi': 'π', '\\rho': 'ρ', '\\sigma': 'σ', '\\tau': 'τ',
        '\\phi': 'φ', '\\omega': 'ω', '\\Omega': 'Ω', '\\cdot': '·', '\\times': '×',
        '\\pm': '±', '\\approx': '≈', '\\infty': '∞', '\\sin': 'sin', '\\cos': 'cos', '\\tan': 'tan',
        '\\arcsin': 'arcsin', '\\arctan': 'arctan', '\\ln': 'ln', '\\log': 'log',
      };
      for (const [k, v] of Object.entries(map)) s = s.split(k).join(v);
      s = s.replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>').replace(/_([a-zA-Z0-9])/g, '<sub>$1</sub>');
      s = s.replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>').replace(/\^([a-zA-Z0-9])/g, '<sup>$1</sup>');
      return s.replace(/\\/g, '');
    }

    _renderLawBox(exp) {
      const box = document.getElementById('law-box');
      if (!box) return;
      if (!exp) { box.classList.add('hidden'); return; }
      box.classList.remove('hidden');

      const lang = I18n.getLang();
      const db = global.EXPERIMENTS_DB || [];
      const idx = db.findIndex((e) => e.id === exp.id) + 1;

      document.getElementById('law-num').textContent = `EXP-${exp.num}`;
      document.getElementById('law-cat').textContent = this._catLabel(exp.category);
      document.getElementById('law-title').textContent = (lang === 'ar' && exp.titleAr) ? exp.titleAr : exp.title;
      document.getElementById('law-obj').textContent = exp.objective || '';
      document.getElementById('law-counter').textContent = `${idx} / ${db.length}`;

      const eq = exp.equations && exp.equations[0];
      document.getElementById('law-eq-label').textContent = eq ? (eq.label || '') : '';
      document.getElementById('law-eq-formula').innerHTML = eq ? this._formatLatex(eq.latex) : '—';
      document.getElementById('law-eq-desc').textContent = eq ? (eq.desc || '') : '';
    }

    _renderTheory(exp) {
      const empty = document.getElementById('theory-empty');
      const body = document.getElementById('theory-body');
      if (!exp) { empty.style.display = 'block'; body.style.display = 'none'; return; }
      empty.style.display = 'none';
      body.style.display = 'block';

      const lang = I18n.getLang();
      const title = (lang === 'ar' && exp.titleAr) ? exp.titleAr : exp.title;
      const eqs = (exp.equations || []).map((eq) => `
        <div class="law-eq-card">
          <div class="law-eq-label">${eq.label || ''}</div>
          <div class="law-eq-formula">${this._formatLatex(eq.latex)}</div>
          <div class="law-eq-desc">${eq.desc || ''}</div>
        </div>`).join('');

      body.innerHTML = `
        <div class="prop-header">EXP-${exp.num} — ${title}</div>
        <div class="theory-block"><div class="theory-h">${I18n.t('lawObjective')}</div><p class="theory-p">${exp.objective || ''}</p></div>
        <div class="theory-block"><div class="theory-h">${I18n.t('lawPhenomenon')}</div><p class="theory-p">${exp.phenomenon || ''}</p></div>
        <div class="theory-block"><div class="theory-h">${I18n.t('tabTheory')}</div><p class="theory-p">${exp.theory || ''}</p></div>
        ${eqs ? `<div class="theory-block"><div class="theory-h">${I18n.t('lawBadge')}</div>${eqs}</div>` : ''}`;
    }

    _renderQuiz(exp) {
      const empty = document.getElementById('quiz-empty');
      const body = document.getElementById('quiz-body');
      if (!exp || !exp.quiz || !exp.quiz.length) {
        empty.style.display = 'block';
        body.style.display = 'none';
        return;
      }
      empty.style.display = 'none';
      body.style.display = 'block';

      const lang = I18n.getLang();
      body.innerHTML = exp.quiz.map((q, qi) => `
        <div class="theory-block" data-qi="${qi}">
          <div class="quiz-q">${qi + 1}. ${(lang === 'ar' && q.qAr) ? q.qAr : q.q}</div>
          ${q.options.map((opt, oi) => `<button class="quiz-opt" onclick="app._answerQuiz(this, ${oi === q.correct}, ${qi})">${opt}</button>`).join('')}
          <div class="quiz-exp" id="qexp_${qi}" style="display:none">${q.explanation || ''}</div>
        </div>`).join('');
    }

    _answerQuiz(btn, isCorrect, qi) {
      const parent = btn.parentElement;
      parent.querySelectorAll('.quiz-opt').forEach((b) => { b.disabled = true; });
      btn.classList.add(isCorrect ? 'correct' : 'wrong');
      const expEl = document.getElementById(`qexp_${qi}`);
      if (expEl) expEl.style.display = 'block';
    }

    _populateQuickSelect() {
      const sel = document.getElementById('quick-select');
      if (!sel) return;
      const lang = I18n.getLang();
      const db = global.EXPERIMENTS_DB || [];
      sel.innerHTML = `<option value="">${I18n.t('quickSelectPlaceholder')}</option>` +
        db.map((e) => `<option value="${e.id}">${e.num}. ${(lang === 'ar' && e.titleAr) ? e.titleAr : e.title}</option>`).join('');
      if (this.activeExp) sel.value = this.activeExp.id;
    }

    _populateModal(cat, query) {
      const grid = document.getElementById('modal-grid');
      if (!grid) return;
      const lang = I18n.getLang();
      const q = (query || '').trim().toLowerCase();
      const list = (global.EXPERIMENTS_DB || []).filter((e) => {
        if (cat && e.category !== cat) return false;
        if (!q) return true;
        return (
          e.num.includes(q) ||
          (e.title || '').toLowerCase().includes(q) ||
          (e.titleAr || '').toLowerCase().includes(q) ||
          (e.phenomenon || '').toLowerCase().includes(q)
        );
      });

      grid.innerHTML = list.map((e) => `
        <div class="exp-card" onclick="app.loadExperiment('${e.id}')">
          <div class="exp-card-top">
            <span class="exp-card-num">EXP-${e.num}</span>
            <span class="exp-card-lvl">${this._catLabel(e.category)}</span>
          </div>
          <div class="exp-card-title">${(lang === 'ar' && e.titleAr) ? e.titleAr : e.title}</div>
          <div class="exp-card-phen">${e.phenomenon || ''}</div>
        </div>`).join('');
    }

    _catLabel(cat) {
      const ar = I18n.getLang() === 'ar';
      const m = {
        fundamental: ar ? 'بصريات أساسية' : 'Fundamental',
        wave: ar ? 'بصريات موجية' : 'Wave Optics',
        polarization: ar ? 'استقطاب' : 'Polarization',
        laser_physics: ar ? 'فيزياء الليزر' : 'Laser Physics',
        advanced_laser: ar ? 'ليزر متقدم' : 'Advanced Laser',
        nonlinear: ar ? 'لاخطية' : 'Nonlinear',
        spectroscopy: ar ? 'مطيافية' : 'Spectroscopy',
        materials: ar ? 'ليزر-مادة' : 'Laser-Matter',
        biomedical: ar ? 'طبية وحيوية' : 'Biomedical',
      };
      return m[cat] || cat;
    }

    /* ═══════════════════════════════════════════════════════════
       UNDO / REDO / SAVE / LOAD / EXPORT / THEME / LANG
    ═══════════════════════════════════════════════════════════ */
    _pushHistory() {
      const snap = JSON.stringify(this.canvas2d.components);
      this.history = this.history.slice(0, this.histIdx + 1);
      this.history.push(snap);
      if (this.history.length > 40) this.history.shift();
      this.histIdx = this.history.length - 1;
    }

    undo() {
      if (this.histIdx <= 0) return;
      this.histIdx--;
      this.canvas2d.setComponents(JSON.parse(this.history[this.histIdx]));
      this._renderProperties(null);
    }

    redo() {
      if (this.histIdx >= this.history.length - 1) return;
      this.histIdx++;
      this.canvas2d.setComponents(JSON.parse(this.history[this.histIdx]));
      this._renderProperties(null);
    }

    saveJSON() {
      const blob = new Blob([JSON.stringify(this.canvas2d.components, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `laser-lab-${this.activeExp ? this.activeExp.id : 'custom'}.json`;
      a.click();
    }

    loadJSON(file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (Array.isArray(data)) {
            this.canvas2d.setComponents(data);
            this.canvas2d.fitToView(90);
            this._pushHistory();
            this._updateDropHint();
          }
        } catch (err) {
          console.error('Invalid JSON file:', err);
        }
      };
      reader.readAsText(file);
    }

    exportPNG() {
      const a = document.createElement('a');
      a.href = this.canvas2d.canvas.toDataURL('image/png');
      a.download = `laser-lab-${this.activeExp ? this.activeExp.id : 'bench'}.png`;
      a.click();
    }

    toggleTheme() {
      this.settings.isDarkMode = !this.settings.isDarkMode;
      document.body.classList.toggle('light-theme', !this.settings.isDarkMode);
    }

    toggleLanguage() {
      const next = I18n.getLang() === 'ar' ? 'en' : 'ar';
      I18n.setLang(next);
      I18n.applyToDOM();
      const btn = document.getElementById('btn-lang');
      if (btn) btn.textContent = next === 'ar' ? 'EN' : 'عربي';
      this._populateQuickSelect();
      this._populateModal(document.getElementById('modal-cat-filter')?.value || '', document.getElementById('modal-search')?.value || '');
      if (this.activeExp) {
        this._renderLawBox(this.activeExp);
        this._renderTheory(this.activeExp);
        this._renderQuiz(this.activeExp);
        const title = (next === 'ar' && this.activeExp.titleAr) ? this.activeExp.titleAr : this.activeExp.title;
        this._setStatus(`EXP-${this.activeExp.num}`, title);
      } else {
        this._setStatus('FREE', I18n.t('statusFreeMode'));
      }
      if (this.selectedComp) this._renderProperties(this.selectedComp);
    }

    _switchTab(tabName) {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.toggle('active', b.dataset.tab === tabName));
      document.querySelectorAll('.tab-pane').forEach((p) => p.classList.toggle('active', p.id === `pane-${tabName}`));
    }

    _setStatus(tag, name) {
      const t = document.getElementById('st-exp-tag');
      const n = document.getElementById('st-exp-name');
      if (t) t.textContent = tag;
      if (n) n.textContent = name;
    }

    _updateDropHint() {
      const h = document.getElementById('drop-hint');
      if (h) h.style.display = this.canvas2d.components.length === 0 ? 'block' : 'none';
    }

    _startFPS() {
      let frames = 0, last = performance.now();
      const step = (now) => {
        frames++;
        if (now - last >= 1000) {
          const el = document.getElementById('st-fps');
          if (el) el.textContent = `${Math.round((frames * 1000) / (now - last))} FPS`;
          frames = 0;
          last = now;
        }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    /* ═══════════════════════════════════════════════════════════
       EVENT BINDINGS
    ═══════════════════════════════════════════════════════════ */
    _bindEvents() {
      // Welcome screen buttons
      const closeWelcome = (cb) => {
        const ov = document.getElementById('welcome-overlay');
        if (!ov) return;
        ov.classList.add('closing');
        setTimeout(() => {
          ov.style.display = 'none';
          ov.classList.remove('closing');
          if (cb) cb();
        }, 320);
      };

      document.getElementById('welcome-btn-library')?.addEventListener('click', () => {
        closeWelcome(() => {
          this._populateModal('', '');
          document.getElementById('exp-modal').style.display = 'flex';
        });
      });

      document.getElementById('welcome-btn-free')?.addEventListener('click', () => {
        closeWelcome(() => this.enterFreeMode());
      });

      document.getElementById('btn-open-welcome')?.addEventListener('click', () => {
        const ov = document.getElementById('welcome-overlay');
        if (ov) ov.style.display = 'flex';
      });

      // Header actions
      document.getElementById('btn-experiments')?.addEventListener('click', () => {
        this._populateModal(document.getElementById('modal-cat-filter')?.value || '', document.getElementById('modal-search')?.value || '');
        document.getElementById('exp-modal').style.display = 'flex';
      });
      document.getElementById('btn-free-lab')?.addEventListener('click', () => this.enterFreeMode());
      document.getElementById('btn-mode-2d')?.addEventListener('click', () => this.setMode('2d'));
      document.getElementById('btn-mode-3d')?.addEventListener('click', () => this.setMode('3d'));

      document.getElementById('quick-select')?.addEventListener('change', (e) => {
        if (e.target.value) this.loadExperiment(e.target.value);
      });
      document.getElementById('btn-head-prev')?.addEventListener('click', () => this.prevExperiment());
      document.getElementById('btn-head-next')?.addEventListener('click', () => this.nextExperiment());
      document.getElementById('btn-prev-exp')?.addEventListener('click', () => this.prevExperiment());
      document.getElementById('btn-next-exp')?.addEventListener('click', () => this.nextExperiment());

      // Fit view & Law box collapse
      document.getElementById('btn-fit')?.addEventListener('click', () => this.canvas2d.fitToView(90));
      document.getElementById('btn-law-fit')?.addEventListener('click', () => this.canvas2d.fitToView(90));
      document.getElementById('btn-law-toggle')?.addEventListener('click', () => {
        document.getElementById('law-box')?.classList.toggle('collapsed');
      });

      // Toolbar actions
      document.getElementById('btn-undo')?.addEventListener('click', () => this.undo());
      document.getElementById('btn-redo')?.addEventListener('click', () => this.redo());
      document.getElementById('btn-clear')?.addEventListener('click', () => {
        this.enterFreeMode();
      });
      document.getElementById('btn-save')?.addEventListener('click', () => this.saveJSON());
      document.getElementById('btn-load')?.addEventListener('click', () => document.getElementById('file-input')?.click());
      document.getElementById('file-input')?.addEventListener('change', (e) => {
        if (e.target.files[0]) { this.loadJSON(e.target.files[0]); e.target.value = ''; }
      });
      document.getElementById('btn-export-png')?.addEventListener('click', () => this.exportPNG());
      document.getElementById('btn-theme')?.addEventListener('click', () => this.toggleTheme());
      document.getElementById('btn-lang')?.addEventListener('click', () => this.toggleLanguage());
      document.getElementById('btn-fullscreen')?.addEventListener('click', () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
        else document.exitFullscreen?.().catch(() => {});
      });

      // 3D camera controls
      document.getElementById('btn-3d-persp')?.addEventListener('click', () => this.bench3d?.setCameraView('perspective'));
      document.getElementById('btn-3d-top')?.addEventListener('click', () => this.bench3d?.setCameraView('top'));
      document.getElementById('btn-3d-reset')?.addEventListener('click', () => this.bench3d?.setCameraView('perspective'));

      // Modal controls
      document.getElementById('modal-close')?.addEventListener('click', () => {
        document.getElementById('exp-modal').style.display = 'none';
      });
      document.getElementById('exp-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'exp-modal') e.target.style.display = 'none';
      });
      document.getElementById('modal-search')?.addEventListener('input', (e) => {
        this._populateModal(document.getElementById('modal-cat-filter').value, e.target.value);
      });
      document.getElementById('modal-cat-filter')?.addEventListener('change', (e) => {
        this._populateModal(e.target.value, document.getElementById('modal-search').value);
      });

      // Inspector tabs & component actions
      document.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => this._switchTab(btn.dataset.tab));
      });
      document.getElementById('btn-duplicate')?.addEventListener('click', () => {
        if (!this.selectedComp) return;
        const dup = JSON.parse(JSON.stringify(this.selectedComp));
        dup.id = `comp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        dup.position = { x: dup.position.x + 36, y: dup.position.y + 36 };
        if (dup.type === 'fiber' && dup.points) {
          dup.points = dup.points.map((p) => ({ x: p.x + 36, y: p.y + 36 }));
        }
        this.canvas2d.components.push(dup);
        this.canvas2d.selectedComponent = dup;
        this.canvas2d.retrace();
        this._onSelect(dup);
        this._pushHistory();
      });
      document.getElementById('btn-delete')?.addEventListener('click', () => {
        if (!this.selectedComp) return;
        this.canvas2d.components = this.canvas2d.components.filter((c) => c.id !== this.selectedComp.id);
        this.canvas2d.selectedComponent = null;
        this.canvas2d.retrace();
        this._onSelect(null);
        this._pushHistory();
        this._updateDropHint();
      });

      // Settings sync (checkboxes + synced range/number pairs)
      const bindCheck = (id, prop) => {
        document.getElementById(id)?.addEventListener('change', (e) => {
          this.settings[prop] = e.target.checked;
          this.canvas2d.retrace();
        });
      };
      bindCheck('set-grid', 'showGrid');
      bindCheck('set-snap', 'snapToGrid');
      bindCheck('set-focal', 'showFocalPoints');
      bindCheck('set-normals', 'showNormalLines');
      bindCheck('set-angles', 'showAngles');

      const bindPair = (rangeId, numId, prop) => {
        const r = document.getElementById(rangeId);
        const n = document.getElementById(numId);
        const apply = (v) => {
          if (Number.isNaN(v)) return;
          this.settings[prop] = v;
          if (r) r.value = v;
          if (n) n.value = v;
          this.canvas2d.retrace();
        };
        r?.addEventListener('input', () => apply(parseFloat(r.value)));
        n?.addEventListener('input', () => apply(parseFloat(n.value)));
      };
      bindPair('set-grid-spacing', 'set-grid-spacing-num', 'gridSpacing');
      bindPair('set-ray-density', 'set-ray-density-num', 'laserRayDensity');
      bindPair('set-ray-depth', 'set-ray-depth-num', 'maxRayDepth');

      // Mobile drawers
      document.getElementById('fab-left')?.addEventListener('click', () => {
        document.getElementById('sidebar-right')?.classList.add('drawer-closed');
        document.getElementById('sidebar-left')?.classList.toggle('drawer-closed');
      });
      document.getElementById('fab-right')?.addEventListener('click', () => {
        document.getElementById('sidebar-left')?.classList.add('drawer-closed');
        document.getElementById('sidebar-right')?.classList.toggle('drawer-closed');
      });
      document.getElementById('btn-close-left')?.addEventListener('click', () => {
        document.getElementById('sidebar-left')?.classList.add('drawer-closed');
      });

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
        if (e.ctrlKey && e.key.toLowerCase() === 'z') { e.preventDefault(); this.undo(); }
        if (e.ctrlKey && e.key.toLowerCase() === 'y') { e.preventDefault(); this.redo(); }
        if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); this.nextExperiment(); }
        if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); this.prevExperiment(); }
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (this.selectedComp) document.getElementById('btn-delete')?.click();
        }
      });

      window.addEventListener('resize', () => {
        this.canvas2d?.resize();
        if (this.mode === '3d') this.bench3d?.resize();
      });
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    global.app = new LabApp();
    global.app.init();
  });
})(window);
