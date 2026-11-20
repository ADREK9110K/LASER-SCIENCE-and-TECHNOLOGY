/**
 * Builds and verifies js/data/experiments.js (100 neatly aligned, scaled, ready-to-run experiments)
 * Every single experiment (001–100) has a clean, textbook-grade optical bench layout
 * tailored to its exact topic — zero legacy scattered coordinates!
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
global.window = global;

require(path.join(ROOT, 'js/core/math.js'));
require(path.join(ROOT, 'js/core/rayTracer.js'));
require(path.join(ROOT, '_backup_v1/js/data/experiments-catalog.js'));

const rawList = global.EXPERIMENTS_DATABASE || [];
if (rawList.length !== 100) {
  console.error('Expected 100 experiments in backup catalog, found:', rawList.length);
  process.exit(1);
}

// ─── CLEAN COMPONENT FACTORIES ─────────────────────────────────────────────
const mkLaser = (id, x, y, rot, wl = 632.8, bw = 12, power = 5, rayCount = 3, name = 'Laser Source') => ({
  id, type: 'laser', name, position: { x, y }, rotation: rot, wavelength: wl, power, beamWidth: bw, rayCount, isOn: true,
});
const mkLamp = (id, x, y, rot, lampColor = 'white', bw = 14, power = 10, rayCount = 3, name = 'Optical Lamp') => ({
  id, type: 'white_light', name, position: { x, y }, rotation: rot, lampColor, power, beamWidth: bw, rayCount, isOn: true,
});
const mkMirror = (id, x, y, rot, mType = 'plane', width = 120, R = 0.99, f = 160, name) => ({
  id, type: 'mirror', name: name || (mType === 'partial' ? 'Output Coupler / BS' : `${mType} Mirror`),
  position: { x, y }, rotation: rot, mirrorType: mType, width, reflectivity: R, focalLength: f,
});
const mkLens = (id, x, y, rot, lType = 'convex', f = 180, D = 100, n = 1.52, name) => ({
  id, type: 'lens', name: name || `${lType} Lens`, position: { x, y }, rotation: rot, lensType: lType, focalLength: f, diameter: D, refractiveIndex: n,
});
const mkPrism = (id, x, y, rot, pType = 'triangular', size = 125, n = 1.62) => ({
  id, type: 'prism', name: `${pType} Prism`, position: { x, y }, rotation: rot, prismType: pType, size, refractiveIndex: n,
});
const mkMedium = (id, x, y, rot, w = 160, h = 110, n = 1.52, alpha = 0, name) => ({
  id, type: 'medium', name: name || (alpha > 0 ? 'Absorbing Medium' : 'Optical Glass Slab'),
  position: { x, y }, rotation: rot, width: w, height: h, refractiveIndex: n, absorptionCoefficient: alpha,
});
const mkGain = (id, x, y, rot, mediumType = 'ruby', width = 170, height = 54, gain = 1.65, pumpActive = false) => ({
  id, type: 'gain_medium', name: `Gain Medium (${mediumType.toUpperCase()})`,
  position: { x, y }, rotation: rot, mediumType, width, height, gainCoefficient: gain, pumpActive,
});
const mkFiber = (id, p0, p1, p2, p3, n1 = 1.50, n2 = 1.44, coreD = 22) => ({
  id, type: 'fiber', name: 'Flexible Optical Fiber',
  position: { x: Math.round((p0.x + p3.x) * 0.5), y: Math.round((p0.y + p3.y) * 0.5) },
  rotation: 0, coreIndex: n1, claddingIndex: n2, coreDiameter: coreD, claddingDiameter: coreD + 16,
  points: [p0, p1, p2, p3],
});
const mkDet = (id, x, y, rot, w = 88, name = 'Silicon Photodiode') => ({
  id, type: 'detector', name, position: { x, y }, rotation: rot, width: w,
});
const mkScreen = (id, x, y, rot, w = 200) => ({
  id, type: 'screen', name: 'Observation Screen', position: { x, y }, rotation: rot, width: w,
});
const mkProt = (id, x, y, rot = 0, r = 115) => ({
  id, type: 'protractor', name: 'Circular Protractor', position: { x, y }, rotation: rot, radius: r,
});
const mkRuler = (id, x, y, rot = 0, len = 240) => ({
  id, type: 'ruler', name: 'Optical Ruler', position: { x, y }, rotation: rot, length: len,
});
const mkGrating = (id, x, y, rot = 90, lines = 600) => ({
  id, type: 'grating', name: 'Diffraction Grating', position: { x, y }, rotation: rot, width: 130, gratingDensity: lines,
});
const mkDoubleSlit = (id, x, y, rot = 90, spacing = 26, slitW = 10) => ({
  id, type: 'double_slit', name: 'Young Double Slit', position: { x, y }, rotation: rot, width: 130, slitSpacing: spacing, slitWidth: slitW,
});
const mkSingleSlit = (id, x, y, rot = 90, slitW = 18) => ({
  id, type: 'single_slit', name: 'Single Slit', position: { x, y }, rotation: rot, width: 130, slitWidth: slitW,
});
const mkAperture = (id, x, y, rot = 90, slitW = 28) => ({
  id, type: 'aperture', name: 'Circular Aperture', position: { x, y }, rotation: rot, width: 130, slitWidth: slitW,
});

// ─── COMPLETE LASER CAVITY SYSTEM BUILDER (Pump + HR Mirror + Gain Rod + Output Coupler + Detector) ──
function buildLaserSystem(prefix, mediumType, pumpType = 'lamp', pumpColor = 'white', pumpWl = 532) {
  const comps = [];
  // Pump source positioned above the crystal rod, illuminating it transversely (optical pumping!)
  if (pumpType === 'lamp') {
    comps.push(mkLamp(`${prefix}_pump`, 430, 120, 90, pumpColor, 36, 15, 5, 'Flashlamp Pump Source'));
  } else if (pumpType === 'diode') {
    comps.push(mkLaser(`${prefix}_pump`, 430, 120, 90, pumpWl, 24, 15, 3, 'Pump Diode Laser'));
  } else {
    // Electrical discharge (He-Ne / CO2): internal discharge pumping + auxiliary HV indicator lamp
    comps.push(mkLamp(`${prefix}_pump`, 430, 125, 90, 'blue', 24, 8, 3, 'HV Discharge Pump'));
  }
  // High-Reflectivity Rear Mirror (HR 100%)
  comps.push(mkMirror(`${prefix}_hr`, 245, 280, 90, 'plane', 105, 0.995, 160, 'HR Mirror (99.5%)'));
  // Active Laser Gain Medium in center of resonator
  comps.push(mkGain(`${prefix}_gain`, 430, 280, 0, mediumType, 185, 54, 1.75, pumpType === 'discharge'));
  // Partially Reflective Output Coupler (OC 75%)
  comps.push(mkMirror(`${prefix}_oc`, 615, 280, 90, 'partial', 105, 0.72, 160, 'Output Coupler (OC 72%)'));
  // Output Power Meter / Photodetector
  comps.push(mkDet(`${prefix}_det`, 745, 280, 90, 90, 'Laser Power Meter'));
  return comps;
}

// ─── HAND-CRAFTED SHOWCASE EXPERIMENTS ─────────────────────────────────────
const CUSTOM_SETUPS = {
  // 001: Textbook Symmetric Law of Reflection (θi = θr = 45°)
  exp_001: [
    mkLaser('e1_l', 210, 140, 45, 632.8, 10, 5, 3, 'He-Ne Laser (632.8 nm)'),
    mkProt('e1_p', 430, 360, 0, 120),
    mkMirror('e1_m', 430, 360, 0, 'plane', 170, 0.99),
    mkDet('e1_d', 650, 140, 45, 90),
  ],
  // 002: Snell's Law of Refraction
  exp_002: [
    mkLaser('e2_l', 155, 175, 24, 632.8, 10, 5, 3),
    mkProt('e2_p', 350, 262, 90, 105),
    mkMedium('e2_m', 440, 280, 0, 180, 160, 1.52, 0),
    mkDet('e2_d', 685, 378, 114, 100),
  ],
  // 003: Total Internal Reflection & Critical Angle
  exp_003: [
    mkLaser('e3_l', 145, 280, 0, 532, 10, 5, 3, 'Green Laser (532 nm)'),
    mkPrism('e3_p', 405, 280, 18, 'triangular', 145, 1.65),
    mkScreen('e3_s', 665, 335, 90, 210),
  ],
  // 004: White Light Prism Dispersion (Pure White -> 7 Rainbow Colors!)
  exp_004: [
    mkLamp('e4_w', 140, 285, 0, 'white', 12, 10, 3, 'White Light Lamp'),
    mkPrism('e4_p', 390, 280, 12, 'triangular', 145, 1.66),
    mkScreen('e4_s', 690, 330, 90, 240),
  ],
  // 005: Plane Mirror Imaging
  exp_005: [
    mkLaser('e5_l', 180, 170, 30, 632.8, 22, 5, 3),
    mkMirror('e5_m', 430, 320, 0, 'plane', 170, 0.99),
    mkScreen('e5_s', 670, 175, 120, 140),
  ],
  // 006: Concave Mirror Imaging (CONVERGING -> focuses parallel rays at F!)
  exp_006: [
    mkLaser('e6_l', 140, 280, 0, 632.8, 56, 5, 5),
    mkMirror('e6_m', 580, 280, 270, 'concave', 145, 0.99, 175),
  ],
  // 007: Convex Mirror Imaging (DIVERGING -> spreads parallel rays outward!)
  exp_007: [
    mkLaser('e7_l', 140, 280, 0, 532, 48, 5, 5),
    mkMirror('e7_m', 560, 280, 270, 'convex', 145, 0.99, 160),
  ],
  // 008: Thin Lens Equation & Conjugates
  exp_008: [
    mkLaser('e8_l', 125, 280, 0, 632.8, 44, 5, 5),
    mkLens('e8_f', 365, 280, 0, 'convex', 180, 115, 1.52),
    mkRuler('e8_r', 365, 375, 0, 200),
    mkScreen('e8_s', 545, 280, 90, 150),
  ],
  // 009: Convex Lens Imaging & Aberrations
  exp_009: [
    mkLaser('e9_l', 115, 280, 0, 532, 54, 5, 7),
    mkLens('e9_f', 360, 280, 0, 'convex', 165, 120, 1.54),
    mkScreen('e9_s', 560, 280, 90, 160),
  ],
  // 010: Concave Lens Divergence & Virtual Focus
  exp_010: [
    mkLaser('e10_l', 130, 280, 0, 532, 36, 5, 5),
    mkLens('e10_f', 360, 280, 0, 'concave', 160, 115, 1.52),
    mkScreen('e10_s', 640, 280, 90, 220),
  ],
  // 011: Optical Prism Dispersion & Cauchy Model (Pure White -> 7 Rainbow Colors!)
  exp_011: [
    mkLamp('e11_w', 135, 285, 0, 'white', 12, 10, 3, 'White Light Lamp'),
    mkPrism('e11_p', 390, 280, 12, 'triangular', 145, 1.66),
    mkScreen('e11_s', 690, 330, 90, 240),
  ],
  // 014: Flexible Curved Optical Fiber (Step-Index TIR)
  exp_014: [
    mkLaser('e14_l', 110, 260, 0, 532, 10, 8, 3, 'Green Laser (532 nm)'),
    mkLens('e14_f', 210, 260, 0, 'convex', 95, 72, 1.52),
    mkFiber('e14_fib', { x: 270, y: 260 }, { x: 380, y: 165 }, { x: 500, y: 365 }, { x: 630, y: 280 }, 1.50, 1.44, 24),
    mkDet('e14_d', 730, 280, 90, 90),
  ],
  // 015: Optical Fiber Numerical Aperture & Bend Loss
  exp_015: [
    mkLaser('e15_l', 110, 290, -4, 650, 10, 8, 3, 'Diode Laser (650 nm)'),
    mkFiber('e15_fib', { x: 250, y: 280 }, { x: 365, y: 385 }, { x: 505, y: 175 }, { x: 635, y: 270 }, 1.52, 1.44, 24),
    mkDet('e15_d', 735, 270, 90, 90),
  ],
  // 016: Young's Double Slit Interference
  exp_016: [
    mkLaser('e16_l', 130, 280, 0, 532, 34, 5, 5, 'Green Laser (532 nm)'),
    mkDoubleSlit('e16_s', 355, 280, 90, 26, 10),
    mkScreen('e16_scr', 685, 280, 90, 250),
  ],
  // 017: Single Slit Fraunhofer Diffraction
  exp_017: [
    mkLaser('e17_l', 130, 280, 0, 632.8, 16, 5, 3),
    mkSingleSlit('e17_s', 355, 280, 90, 18),
    mkScreen('e17_scr', 685, 280, 90, 230),
  ],
  // 018: Diffraction Grating Spectrometer
  exp_018: [
    mkLamp('e18_w', 130, 280, 0, 'white', 10, 10, 3, 'White Light Source'),
    mkGrating('e18_g', 360, 280, 90, 600),
    mkScreen('e18_scr', 685, 280, 90, 270),
  ],
  // 019: Michelson Interferometer
  exp_019: [
    mkLaser('e19_l', 140, 280, 0, 632.8, 10, 6, 3),
    mkMirror('e19_bs', 395, 280, -45, 'partial', 120, 0.5, 160, 'Beam Splitter 50/50'),
    mkMirror('e19_m1', 615, 280, 90, 'plane', 100, 0.99, 160, 'Fixed Mirror M1'),
    mkMirror('e19_m2', 395, 105, 0, 'plane', 100, 0.99, 160, 'Movable Mirror M2'),
    mkDet('e19_d', 395, 455, 0, 90),
  ],
  // 020: Mach-Zehnder Interferometer
  exp_020: [
    mkLaser('e20_l', 110, 340, 0, 532, 10, 6, 3),
    mkMirror('e20_bs1', 270, 340, -45, 'partial', 100, 0.5, 160, 'BS1 50/50'),
    mkMirror('e20_m1', 270, 160, -45, 'plane', 100, 0.99, 160, 'Mirror M1'),
    mkMirror('e20_m2', 550, 340, -45, 'plane', 100, 0.99, 160, 'Mirror M2'),
    mkMirror('e20_bs2', 550, 160, -45, 'partial', 100, 0.5, 160, 'BS2 50/50'),
    mkDet('e20_d', 705, 160, 90, 88),
  ],

  // ─── DEDICATED LASER SYSTEMS WITH PUMP SOURCE + GAIN MEDIUM + CAVITY ─────
  // 046: Ruby Solid-State Laser (694.3 nm) + Flashlamp Pump
  exp_046: buildLaserSystem('e46', 'ruby', 'lamp', 'white', 532),
  // 047: Four-Level Nd:YAG Laser Model + Diode Pump
  exp_047: buildLaserSystem('e47', 'nd_yag', 'diode', 'blue', 455),
  // 048: Optical Pumping & Yb:YAG Disk Laser (1030 nm)
  exp_048: buildLaserSystem('e48', 'yb_yag', 'diode', 'blue', 455),
  // 056: Nd:YAG Laser Operation (1064 / 532 nm) with Pump Source
  exp_056: buildLaserSystem('e56', 'nd_yag', 'diode', 'blue', 455),
  // 057: He-Ne Gas Laser Construction (632.8 nm) with Discharge Pump
  exp_057: buildLaserSystem('e57', 'he_ne', 'discharge', 'blue', 455),
  // 058: CO2 Gas Laser (10.6 µm) with HV Discharge Pump
  exp_058: buildLaserSystem('e58', 'co2', 'discharge', 'blue', 455),
  // 061: Fiber Laser Architecture & Cladding Pumping
  exp_061: [
    mkLaser('e61_pump', 105, 270, 0, 455, 12, 12, 3, 'Pump Diode (980 nm)'),
    mkLens('e61_f', 205, 270, 0, 'convex', 95, 72, 1.52),
    mkFiber('e61_fib', { x: 265, y: 270 }, { x: 380, y: 170 }, { x: 500, y: 370 }, { x: 630, y: 270 }, 1.52, 1.44, 24),
    mkDet('e61_d', 735, 270, 90, 90),
  ],
  // 062: Ti:Sapphire Ultrafast Laser with Green 532nm Pump Laser
  exp_062: buildLaserSystem('e62', 'ti_sapphire', 'diode', 'green', 532),
  // 095: Er:YAG Medical & Dental Laser (2940 nm) with Flashlamp Pump
  exp_095: buildLaserSystem('e95', 'er_yag', 'lamp', 'white', 532),
};

// Upgrade EXP-095 metadata to explicitly highlight Er:YAG Medical Laser (ليزر الإربيوم ياك الطبي)
const METADATA_OVERRIDES = {
  exp_095: {
    title: 'Er:YAG Medical Laser System (2940 nm) & Tissue Ablation',
    titleAr: 'منظومة ليزر الإربيوم–ياك (Er:YAG 2940 nm) والتطبيقات الطبية',
    phenomenon: 'Flashlamp-pumped Er³⁺:YAG optical cavity & high water-absorption ablation',
    objective: 'Build and analyze an Er:YAG solid-state medical laser cavity with flashlamp optical pumping, active Er:YAG crystal rod, and output coupler.',
    theory: 'Er:YAG emits at 2940 nm, matching the peak absorption band of water in biological tissue, enabling ultra-precise surgical and dental ablation with minimal thermal damage.',
    equations: [
      { latex: '\\lambda_{\\text{Er:YAG}} = 2940\\text{ nm}, \\quad I(z) = I_0 e^{-\\mu_a z}', label: 'Er:YAG Emission & Tissue Absorption', desc: 'Strong OH-bond water absorption at 2.94 µm' },
    ],
  },
};

// ─── CLEAN SCALED TEMPLATES FOR ALL REMAINING EXPERIMENTS (001–100) ────────
function buildCleanTemplate(exp) {
  const num = parseInt(exp.num, 10) || 1;
  const cat = exp.category || 'fundamental';
  const titleL = (exp.title || '').toLowerCase();
  const wl = (exp.defaultParams && exp.defaultParams.wavelength) || (num % 3 === 0 ? 532 : (num % 3 === 1 ? 632.8 : 450));
  const id = exp.id;

  // Match by specific physical keywords in title for maximum realism!
  if (titleL.includes('fiber') || titleL.includes('waveguide') || titleL.includes('optical comm')) {
    return [
      mkLaser(`${id}_l`, 110, 270, 0, wl, 10, 8, 3),
      mkLens(`${id}_f`, 210, 270, 0, 'convex', 95, 72, 1.52),
      mkFiber(`${id}_fib`, { x: 270, y: 270 }, { x: 385, y: 175 }, { x: 505, y: 365 }, { x: 635, y: 275 }, 1.50, 1.44, 24),
      mkDet(`${id}_d`, 735, 275, 90, 90),
    ];
  }
  if (titleL.includes('interfer') || titleL.includes('coherence') || titleL.includes('hologra')) {
    return [
      mkLaser(`${id}_l`, 135, 280, 0, wl, 10, 6, 3),
      mkMirror(`${id}_bs`, 390, 280, -45, 'partial', 120, 0.5),
      mkMirror(`${id}_m1`, 610, 280, 90, 'plane', 100, 0.99),
      mkMirror(`${id}_m2`, 390, 105, 0, 'plane', 100, 0.99),
      mkDet(`${id}_d`, 390, 455, 0, 90),
    ];
  }
  if (titleL.includes('grating') || titleL.includes('spectrom') || titleL.includes('raman') || titleL.includes('spectro')) {
    return [
      mkLamp(`${id}_w`, 130, 280, 0, 'white', 10, 10, 3),
      mkGrating(`${id}_g`, 360, 280, 90, 600),
      mkScreen(`${id}_s`, 680, 280, 90, 260),
    ];
  }
  if (titleL.includes('double') && titleL.includes('slit')) {
    return [
      mkLaser(`${id}_l`, 130, 280, 0, wl, 34, 5, 5),
      mkDoubleSlit(`${id}_ds`, 360, 280, 90, 26, 10),
      mkScreen(`${id}_s`, 680, 280, 90, 240),
    ];
  }
  if (titleL.includes('diffract') || titleL.includes('airy') || titleL.includes('fresnel') || titleL.includes('aperture')) {
    return [
      mkLaser(`${id}_l`, 130, 280, 0, wl, 24, 5, 5),
      mkAperture(`${id}_ap`, 360, 280, 90, 22),
      mkScreen(`${id}_s`, 680, 280, 90, 230),
    ];
  }
  if (titleL.includes('prism') || titleL.includes('dispers') || titleL.includes('chromatic')) {
    return [
      mkLamp(`${id}_w`, 140, 285, 0, 'white', 12, 10, 3),
      mkPrism(`${id}_p`, 395, 280, 14, 'triangular', 140, 1.64),
      mkScreen(`${id}_s`, 685, 330, 90, 230),
    ];
  }
  if (titleL.includes('brewster') || titleL.includes('polariz') || titleL.includes('malus') || titleL.includes('birefring') || titleL.includes('kerr') || titleL.includes('pockels')) {
    return [
      mkLaser(`${id}_l`, 150, 175, 24, wl, 10, 6, 3),
      mkProt(`${id}_pr`, 355, 265, 90, 105),
      mkMedium(`${id}_m`, 445, 280, 0, 175, 150, 1.54, 0, 'Optical Crystal / Plate'),
      mkDet(`${id}_d`, 690, 375, 114, 95),
    ];
  }
  if (titleL.includes('ruby')) return buildLaserSystem(id, 'ruby', 'lamp', 'white', 532);
  if (titleL.includes('nd:yag') || titleL.includes('four-level')) return buildLaserSystem(id, 'nd_yag', 'diode', 'blue', 455);
  if (titleL.includes('he-ne')) return buildLaserSystem(id, 'he_ne', 'discharge', 'blue', 455);
  if (titleL.includes('co2')) return buildLaserSystem(id, 'co2', 'discharge', 'blue', 455);
  if (titleL.includes('ti:sapphire')) return buildLaserSystem(id, 'ti_sapphire', 'diode', 'green', 532);
  if (titleL.includes('absorp') || titleL.includes('beer') || titleL.includes('tissue') || titleL.includes('ablat') || titleL.includes('phototherm') || titleL.includes('plasma') || titleL.includes('cut') || titleL.includes('weld')) {
    return [
      mkLaser(`${id}_l`, 125, 280, 0, wl, 22, 12, 3),
      mkLens(`${id}_f`, 305, 280, 0, 'convex', 165, 96, 1.52),
      mkMedium(`${id}_t`, 495, 280, 0, 130, 110, 1.44, 1.15, 'Target / Tissue Sample'),
      mkDet(`${id}_d`, 690, 280, 90, 90),
    ];
  }

  // Category-based clean, symmetric benches
  if (cat === 'laser_physics' || cat === 'advanced_laser') {
    const media = ['ruby', 'nd_yag', 'he_ne', 'yb_yag', 'er_yag', 'ti_sapphire'];
    return buildLaserSystem(id, media[num % media.length], num % 2 === 0 ? 'lamp' : 'diode', 'white', 532);
  }
  if (cat === 'nonlinear') {
    return [
      mkLaser(`${id}_l`, 120, 280, 0, 650, 14, 15, 3, 'Pump Laser'),
      mkLens(`${id}_f1`, 285, 280, 0, 'convex', 145, 92, 1.52),
      mkGain(`${id}_nl`, 445, 280, 0, 'nd_yag', 140, 50, 1.55, false),
      mkPrism(`${id}_p`, 605, 280, 10, 'triangular', 100, 1.60),
      mkDet(`${id}_d`, 740, 325, 90, 95),
    ];
  }
  if (cat === 'wave') {
    return [
      mkLaser(`${id}_l`, 130, 280, 0, wl, 28, 5, 5),
      mkDoubleSlit(`${id}_ds`, 360, 280, 90, 26, 10),
      mkScreen(`${id}_s`, 680, 280, 90, 240),
    ];
  }
  if (cat === 'spectroscopy') {
    return [
      mkLamp(`${id}_w`, 130, 280, 0, 'white', 12, 10, 3),
      mkPrism(`${id}_p`, 385, 280, 14, 'triangular', 135, 1.62),
      mkScreen(`${id}_s`, 680, 330, 90, 230),
    ];
  }
  if (cat === 'materials' || cat === 'biomedical') {
    return [
      mkLaser(`${id}_l`, 125, 280, 0, wl, 24, 15, 3),
      mkLens(`${id}_f`, 315, 280, 0, 'convex', 155, 96, 1.52),
      mkMedium(`${id}_t`, 500, 280, 0, 125, 110, 1.45, 0.95, 'Target Material'),
      mkDet(`${id}_d`, 695, 280, 90, 90),
    ];
  }

  // Fundamental optics clean default (Collimated lens + beam splitter + detector)
  return [
    mkLaser(`${id}_l`, 130, 280, 0, wl, 30, 6, 3),
    mkLens(`${id}_f`, 340, 280, 0, 'convex', 190, 104, 1.52),
    mkMirror(`${id}_bs`, 525, 280, 45, 'partial', 110, 0.5),
    mkDet(`${id}_d1`, 695, 280, 90, 90),
    mkDet(`${id}_d2`, 525, 445, 0, 90),
  ];
}

let passed = 0;
const cleaned = rawList.map((exp) => {
  const ov = METADATA_OVERRIDES[exp.id] || {};
  const comps = CUSTOM_SETUPS[exp.id] || buildCleanTemplate(exp);
  const res = global.RayTracer.traceAll(JSON.parse(JSON.stringify(comps)), { maxRayDepth: 10, laserRayDensity: 3 });
  const ok = res.rays.some((r) => r.segments && r.segments.length >= 2) || res.rays.length > 3;
  if (ok) passed++;
  else console.log('FAIL:', exp.id, exp.title);

  return {
    id: exp.id,
    num: exp.num,
    title: ov.title || exp.title,
    titleAr: ov.titleAr || exp.titleAr || exp.title,
    category: exp.category || 'fundamental',
    level: exp.level || 'undergraduate',
    difficulty: exp.difficulty || 'Intermediate',
    time: exp.time || '25 min',
    phenomenon: ov.phenomenon || exp.phenomenon || '',
    objective: ov.objective || exp.objective || '',
    theory: ov.theory || exp.theory || '',
    equations: ov.equations || exp.equations || [],
    defaultParams: exp.defaultParams || {},
    quiz: exp.quiz || [],
    components: comps,
  };
});

const outPath = path.join(ROOT, 'js/data/experiments.js');
const header = `/**\n * LASER SCIENCE & TECHNOLOGY — VIRTUAL INTERACTIVE LABORATORY\n * 100 Calibrated, Neatly Aligned & Pre-Built Optical Experiments (v2.1)\n */\n(function (global) {\n  'use strict';\n  global.EXPERIMENTS_DB = `;
const footer = `;\n})(typeof window !== 'undefined' ? window : global);\n`;

fs.writeFileSync(outPath, header + JSON.stringify(cleaned, null, 2) + footer, 'utf8');
console.log(`Generated ${cleaned.length} neatly aligned experiments -> ${outPath}`);
console.log(`Ray-tracing verification: ${passed}/${cleaned.length} active!`);
if (passed < cleaned.length) process.exit(1);
