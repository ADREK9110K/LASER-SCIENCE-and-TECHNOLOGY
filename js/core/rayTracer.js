/**
 * LASER SCIENCE & TECHNOLOGY — VIRTUAL INTERACTIVE LABORATORY
 * Real-Time 2D Optical Ray Tracing Engine (v2.0)
 * Supports: Lasers, White Light, Mirrors (Plane/Concave/Convex/BS),
 * Lenses, Prisms (Cauchy Dispersion), Media (Beer-Lambert),
 * Flexible Curved Bezier Optical Fibers with real TIR zig-zag propagation,
 * Diffraction Gratings, Slits, Apertures, Detectors & Screens.
 */
(function (global) {
  'use strict';

  const M = global.OpticsMath;
  const Vec = M.Vec;
  const Bezier = M.Bezier;

  const WHITE_SPECTRUM = [425, 465, 500, 540, 580, 615, 665];
  const LAMP_COLOR_MAP = {
    white:  { isWhite: true,  wl: 550, color: '#ffffff' },
    red:    { isWhite: false, wl: 650, color: M.wavelengthToColor(650) },
    green:  { isWhite: false, wl: 532, color: M.wavelengthToColor(532) },
    blue:   { isWhite: false, wl: 455, color: M.wavelengthToColor(455) },
    yellow: { isWhite: false, wl: 580, color: M.wavelengthToColor(580) },
    violet: { isWhite: false, wl: 405, color: M.wavelengthToColor(405) },
  };
  const GAIN_MEDIA = {
    ruby:        { label: 'Ruby (Cr³⁺:Al₂O₃)',    wlNm: 694.3, visWl: 675, n: 1.76, gain: 1.45, tint: 'rgba(244, 63, 94, 0.34)',  stroke: '#fb7185' },
    nd_yag:      { label: 'Nd:YAG (1064 nm)',     wlNm: 1064,  visWl: 532, n: 1.82, gain: 1.75, tint: 'rgba(167, 139, 250, 0.30)', stroke: '#a78bfa' },
    er_yag:      { label: 'Er:YAG (2940 nm)',     wlNm: 2940,  visWl: 635, n: 1.81, gain: 1.60, tint: 'rgba(251, 146, 60, 0.30)',  stroke: '#fb923c' },
    yb_yag:      { label: 'Yb:YAG (1030 nm)',     wlNm: 1030,  visWl: 590, n: 1.82, gain: 1.80, tint: 'rgba(250, 204, 21, 0.26)',  stroke: '#facc15' },
    he_ne:       { label: 'He-Ne Gas (632.8 nm)', wlNm: 632.8, visWl: 633, n: 1.00, gain: 1.35, tint: 'rgba(239, 68, 68, 0.24)',   stroke: '#f87171' },
    co2:         { label: 'CO₂ Gas (10.6 µm)',    wlNm: 10600, visWl: 660, n: 1.00, gain: 1.90, tint: 'rgba(234, 88, 12, 0.24)',   stroke: '#ea580c' },
    ti_sapphire: { label: 'Ti:Sapphire (800 nm)', wlNm: 800,   visWl: 700, n: 1.76, gain: 1.65, tint: 'rgba(236, 72, 153, 0.28)',  stroke: '#f472b6' },
  };
  const MAX_RAY_LENGTH = 2600;
  const MAX_TOTAL_RAYS = 460;

  /**
   * Build local polygon vertices for a prism
   */
  function getPrismVerticesLocal(comp) {
    const S = comp.size || 100;
    const type = comp.prismType || 'triangular';
    if (type === 'rectangular') {
      const w = S * 0.75, h = S * 0.55;
      return [
        { x: -w, y: -h },
        { x: w, y: -h },
        { x: w, y: h },
        { x: -w, y: h },
      ];
    }
    if (type === 'pentagonal') {
      const r = S * 0.62;
      const pts = [];
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        pts.push({ x: r * Math.cos(a), y: r * Math.sin(a) });
      }
      return pts;
    }
    // Equilateral triangular prism
    const h = S * Math.sqrt(3) / 2;
    return [
      { x: 0, y: -h * 0.6 },
      { x: S * 0.5, y: h * 0.4 },
      { x: -S * 0.5, y: h * 0.4 },
    ];
  }

  /**
   * Build world-space edges of a polygon
   */
  function getPolygonEdgesWorld(localVerts, pos, rotDeg) {
    const worldVerts = localVerts.map((v) => M.localToGlobal(v, pos, rotDeg));
    const edges = [];
    for (let i = 0; i < worldVerts.length; i++) {
      const a = worldVerts[i];
      const b = worldVerts[(i + 1) % worldVerts.length];
      const edgeDir = Vec.norm(Vec.sub(b, a));
      // Outward normal for CW vertices in screen coords (y down)
      const normal = { x: edgeDir.y, y: -edgeDir.x };
      edges.push({ a, b, normal });
    }
    return edges;
  }

  /**
   * Check if point is inside convex polygon (world coords)
   */
  function pointInPolygon(pt, edges) {
    let inside = true;
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      if (Vec.dot(Vec.sub(pt, e.a), e.normal) > 0.5) {
        inside = false;
        break;
      }
    }
    return inside;
  }

  /**
   * Find closest intersection between ray and all optical components
   */
  function findClosestHit(ray, components) {
    let best = null;
    const { origin, dir } = ray;

    for (let i = 0; i < components.length; i++) {
      const comp = components[i];
      if (comp.type === 'laser' || comp.type === 'white_light' || comp.type === 'ruler' || comp.type === 'protractor') {
        continue;
      }

      const pos = comp.position || { x: 0, y: 0 };
      const rot = comp.rotation || 0;

      // ─── FLEXIBLE CURVED FIBER OPTIC ─────────────────────────
      if (comp.type === 'fiber') {
        const pts = Bezier.getFiberPoints(comp);
        const coreR = (comp.coreDiameter || 20) * 0.5;
        const cladR = (comp.claddingDiameter || 36) * 0.5;
        const hitR = Math.max(coreR + 4, cladR * 0.65);

        // Input face at p0
        const tan0 = Bezier.tangent(pts[0], pts[1], pts[2], pts[3], 0);
        const nor0 = Vec.perp(tan0);
        const inA = Vec.add(pts[0], Vec.mul(nor0, -hitR));
        const inB = Vec.add(pts[0], Vec.mul(nor0, hitR));
        const hIn = M.intersectRaySegment(origin, dir, inA, inB, 1.5);
        if (hIn && (!best || hIn.t < best.t)) {
          // Only accept rays approaching from outside the input ferrule
          if (Vec.dot(dir, tan0) > 0.15) {
            best = {
              t: hIn.t,
              point: hIn.point,
              normal: Vec.mul(tan0, -1),
              comp,
              meta: { end: 'input', u: hIn.u, hitR, tan: tan0, nor: nor0 },
            };
          }
        }

        // Output face at p3 (allow reverse entry too!)
        const tan1 = Bezier.tangent(pts[0], pts[1], pts[2], pts[3], 1);
        const nor1 = Vec.perp(tan1);
        const outA = Vec.add(pts[3], Vec.mul(nor1, -hitR));
        const outB = Vec.add(pts[3], Vec.mul(nor1, hitR));
        const hOut = M.intersectRaySegment(origin, dir, outA, outB, 1.5);
        if (hOut && (!best || hOut.t < best.t)) {
          if (Vec.dot(dir, tan1) < -0.15) {
            best = {
              t: hOut.t,
              point: hOut.point,
              normal: tan1,
              comp,
              meta: { end: 'output', u: hOut.u, hitR, tan: Vec.mul(tan1, -1), nor: Vec.mul(nor1, -1) },
            };
          }
        }
        continue;
      }

      // ─── MIRROR / GRATING / SLITS / APERTURE / DETECTOR / SCREEN ───
      if (
        comp.type === 'mirror' ||
        comp.type === 'grating' ||
        comp.type === 'single_slit' ||
        comp.type === 'double_slit' ||
        comp.type === 'aperture' ||
        comp.type === 'detector' ||
        comp.type === 'screen'
      ) {
        const W = comp.width || (comp.type === 'detector' ? 80 : 120);
        const a = M.localToGlobal({ x: -W * 0.5, y: 0 }, pos, rot);
        const b = M.localToGlobal({ x: W * 0.5, y: 0 }, pos, rot);
        const hit = M.intersectRaySegment(origin, dir, a, b, 1.0);
        if (hit && (!best || hit.t < best.t)) {
          const localY = (hit.u - 0.5) * W; // offset along surface
          // Surface normal in local coords is (0, -1)
          let localNorm = { x: 0, y: -1 };
          if (comp.type === 'mirror' && (comp.mirrorType === 'concave' || comp.mirrorType === 'convex')) {
            const f = Math.max(40, Math.abs(comp.focalLength || 150));
            const R = 2 * f;
            const sign = comp.mirrorType === 'concave' ? 1 : -1;
            const slope = clampSlope((sign * localY) / R);
            localNorm = Vec.norm({ x: -slope, y: -1 });
          }
          const worldNorm = M.dirLocalToGlobal(localNorm, rot);
          best = {
            t: hit.t,
            point: hit.point,
            normal: worldNorm,
            comp,
            meta: { localOffset: localY, width: W, u: hit.u },
          };
        }
        continue;
      }

      // ─── LENS (thin lens plane along local Y axis) ───────────
      if (comp.type === 'lens') {
        const D = comp.diameter || 90;
        const a = M.localToGlobal({ x: 0, y: -D * 0.5 }, pos, rot);
        const b = M.localToGlobal({ x: 0, y: D * 0.5 }, pos, rot);
        const hit = M.intersectRaySegment(origin, dir, a, b, 1.0);
        if (hit && (!best || hit.t < best.t)) {
          const localY = (hit.u - 0.5) * D;
          const worldNorm = M.dirLocalToGlobal({ x: -1, y: 0 }, rot);
          best = {
            t: hit.t,
            point: hit.point,
            normal: worldNorm,
            comp,
            meta: { localY, diameter: D },
          };
        }
        continue;
      }

      // ─── PRISM (polygon edges) ───────────────────────────────
      if (comp.type === 'prism') {
        const localVerts = getPrismVerticesLocal(comp);
        const edges = getPolygonEdgesWorld(localVerts, pos, rot);
        for (let e = 0; e < edges.length; e++) {
          const hit = M.intersectRaySegment(origin, dir, edges[e].a, edges[e].b, 0.8);
          if (hit && (!best || hit.t < best.t)) {
            best = {
              t: hit.t,
              point: hit.point,
              normal: edges[e].normal,
              comp,
              meta: { edges },
            };
          }
        }
        continue;
      }

      // ─── MEDIUM & LASER GAIN MEDIUM (rectangular slab / laser rod) ──
      if (comp.type === 'medium' || comp.type === 'gain_medium') {
        const W = comp.width || (comp.type === 'gain_medium' ? 160 : 150);
        const H = comp.height || (comp.type === 'gain_medium' ? 52 : 100);
        const localVerts = [
          { x: -W * 0.5, y: -H * 0.5 },
          { x: W * 0.5, y: -H * 0.5 },
          { x: W * 0.5, y: H * 0.5 },
          { x: -W * 0.5, y: H * 0.5 },
        ];
        const edges = getPolygonEdgesWorld(localVerts, pos, rot);
        for (let e = 0; e < edges.length; e++) {
          const hit = M.intersectRaySegment(origin, dir, edges[e].a, edges[e].b, 0.8);
          if (hit && (!best || hit.t < best.t)) {
            best = {
              t: hit.t,
              point: hit.point,
              normal: edges[e].normal,
              comp,
              meta: { edges },
            };
          }
        }
        continue;
      }
    }

    return best;
  }

  function clampSlope(s) {
    return Math.max(-0.85, Math.min(0.85, s));
  }

  /**
   * Main entry point: trace all rays from all active light sources
   * Returns { rays, annotations }
   */
  function traceAll(components, settings = {}) {
    const maxDepth = settings.maxRayDepth || 10;
    const defaultDensity = settings.laserRayDensity || 3;

    // Reset runtime telemetry on components
    for (let i = 0; i < components.length; i++) {
      const c = components[i];
      if (c.type === 'detector' || c.type === 'screen') {
        c._receivedPower = 0;
        c._hitCount = 0;
        c._hits = [];
      }
      if (c.type === 'fiber') {
        c.isGuiding = false;
        c.guidedColor = null;
        c._guidedCount = 0;
      }
      if (c.type === 'gain_medium') {
        c._isPumped = !!c.pumpActive;
        c._lasingEmitted = false;
      }
    }

    const queue = [];
    const finishedRays = [];
    const annotations = [];

    // Helper: emit coherent axial lasing rays from an excited gain medium
    const emitFromGainMedium = (gm) => {
      if (gm._lasingEmitted) return;
      gm._lasingEmitted = true;
      const spec = GAIN_MEDIA[gm.mediumType || 'ruby'] || GAIN_MEDIA.ruby;
      const wl = gm.emissionWavelength || spec.visWl;
      const col = M.wavelengthToColor(wl);
      const W = gm.width || 160;
      const pos = gm.position || { x: 430, y: 280 };
      const rot = gm.rotation || 0;
      const gain = gm.gainCoefficient || spec.gain;
      const count = Math.max(1, Math.min(5, defaultDensity));
      const pwr = (4 * gain) / count;

      for (const side of [-1, 1]) {
        const dir = Vec.norm(M.dirLocalToGlobal({ x: side, y: 0 }, rot));
        for (let r = 0; r < count; r++) {
          const frac = count === 1 ? 0 : (r / (count - 1) - 0.5);
          const orig = M.localToGlobal({ x: side * (W * 0.5 + 1.5), y: frac * 10 }, pos, rot);
          queue.push({
            origin: orig,
            dir,
            wavelength: wl,
            color: col,
            isWhite: false,
            intensity: 0.95,
            power: pwr,
            depth: 1,
            nCurrent: 1.0,
            path: [orig],
            segments: [],
          });
        }
      }
    };

    // 1. Emit initial rays from all light sources (and self-pumped gain media)
    for (let i = 0; i < components.length; i++) {
      const src = components[i];
      if (src.isOn === false) continue;

      if (src.type === 'gain_medium' && src.pumpActive) {
        emitFromGainMedium(src);
        continue;
      }

      if (src.type === 'laser') {
        const wl = src.wavelength || 632.8;
        const color = M.wavelengthToColor(wl);
        const bw = src.beamWidth || 12;
        const divDeg = src.beamDivergence || 0;
        const count = Math.max(1, Math.min(15, src.rayCount || defaultDensity));
        const powerPerRay = (src.power || 5) / count;
        const pos = src.position || { x: 150, y: 280 };
        const rot = src.rotation || 0;

        for (let r = 0; r < count; r++) {
          const frac = count === 1 ? 0 : (r / (count - 1) - 0.5);
          const localOrigin = { x: 24, y: frac * bw };
          const angleOffset = frac * divDeg;
          const worldOrigin = M.localToGlobal(localOrigin, pos, rot);
          const worldDir = M.dirLocalToGlobal(
            { x: Math.cos(M.degToRad(angleOffset)), y: Math.sin(M.degToRad(angleOffset)) },
            rot
          );
          queue.push({
            origin: worldOrigin,
            dir: Vec.norm(worldDir),
            wavelength: wl,
            color,
            isWhite: false,
            intensity: 1.0,
            power: powerPerRay,
            depth: 0,
            nCurrent: 1.0,
            path: [worldOrigin],
            segments: [],
          });
        }
      } else if (src.type === 'white_light') {
        const bw = src.beamWidth || 16;
        const pos = src.position || { x: 150, y: 280 };
        const rot = src.rotation || 0;
        const count = Math.max(1, Math.min(15, src.rayCount || defaultDensity));
        const totalPower = src.power || 10;
        const powerPerRay = totalPower / count;
        const worldDir = M.dirLocalToGlobal({ x: 1, y: 0 }, rot);
        const lc = LAMP_COLOR_MAP[src.lampColor || 'white'] || LAMP_COLOR_MAP.white;

        for (let r = 0; r < count; r++) {
          const frac = count === 1 ? 0 : (r / (count - 1) - 0.5);
          const orig = M.localToGlobal({ x: 24, y: frac * bw }, pos, rot);
          queue.push({
            origin: orig,
            dir: Vec.norm(worldDir),
            wavelength: lc.wl,
            color: lc.color,
            isWhite: lc.isWhite,
            intensity: 1.0,
            power: powerPerRay,
            depth: 0,
            nCurrent: 1.0,
            path: [orig],
            segments: [],
          });
        }
      }
    }

    // 2. Trace ray queue
    while (queue.length > 0 && finishedRays.length < MAX_TOTAL_RAYS) {
      const ray = queue.shift();
      let cur = ray;

      while (cur.depth <= maxDepth && cur.intensity > 0.025) {
        const segStartPt = cur.path[cur.path.length - 1];
        const segStartIntensity = cur.intensity;
        const hit = findClosestHit(cur, components);
        if (!hit) {
          // Ray extends to boundary
          const endPt = Vec.add(cur.origin, Vec.mul(cur.dir, MAX_RAY_LENGTH));
          cur.path.push(endPt);
          cur.segments.push({
            a: segStartPt,
            b: endPt,
            intensityStart: segStartIntensity,
            intensityEnd: segStartIntensity,
            color: cur.color,
            isWhite: !!cur.isWhite,
            wavelength: cur.wavelength,
          });
          break;
        }

        // Apply Beer-Lambert attenuation if traveling inside an absorbing medium
        if (cur._absorbingAlpha && cur._absorbingAlpha > 0) {
          const distCm = hit.t / 100;
          const atten = Math.exp(-cur._absorbingAlpha * distCm);
          cur.intensity *= atten;
          cur.power *= atten;
        }

        cur.path.push(hit.point);
        cur.segments.push({
          a: segStartPt,
          b: hit.point,
          intensityStart: segStartIntensity,
          intensityEnd: cur.intensity,
          color: cur.color,
          isWhite: !!cur.isWhite,
          wavelength: cur.wavelength,
        });
        const comp = hit.comp;

        // Record normal & angle annotations for reflection/refraction
        if ((settings.showNormals || settings.showAngles) && (comp.type === 'mirror' || comp.type === 'prism' || comp.type === 'medium')) {
          const nVis = Vec.dot(cur.dir, hit.normal) < 0 ? hit.normal : Vec.mul(hit.normal, -1);
          const cosA = M.clamp(-Vec.dot(cur.dir, nVis), 0, 1);
          const angleDeg = M.radToDeg(Math.acos(cosA));
          annotations.push({
            point: hit.point,
            normal: nVis,
            angleDeg,
          });
        }

        // ── DETECTOR / SCREEN ──────────────────────────────────
        if (comp.type === 'detector' || comp.type === 'screen') {
          comp._receivedPower = (comp._receivedPower || 0) + cur.power;
          comp._hitCount = (comp._hitCount || 0) + 1;
          comp._hits.push({
            u: hit.meta.u,
            point: hit.point,
            color: cur.color,
            wavelength: cur.wavelength,
            intensity: cur.intensity,
          });
          break;
        }

        // ── MIRROR / BEAM SPLITTER ─────────────────────────────
        if (comp.type === 'mirror') {
          const R = comp.mirrorType === 'partial'
            ? M.clamp(comp.reflectivity != null ? comp.reflectivity : 0.5, 0.05, 0.95)
            : M.clamp(comp.reflectivity != null ? comp.reflectivity : 0.99, 0.05, 1.0);

          const reflDir = M.reflect(cur.dir, hit.normal);
          const nextOrigin = Vec.add(hit.point, Vec.mul(reflDir, 0.6));

          // Beam splitter also transmits (1 - R)
          if (comp.mirrorType === 'partial' && (1 - R) * cur.intensity > 0.03 && queue.length + finishedRays.length < MAX_TOTAL_RAYS) {
            const transOrigin = Vec.add(hit.point, Vec.mul(cur.dir, 1.2));
            queue.push({
              origin: transOrigin,
              dir: cur.dir,
              wavelength: cur.wavelength,
              color: cur.color,
              isWhite: !!cur.isWhite,
              intensity: cur.intensity * (1 - R),
              power: cur.power * (1 - R),
              depth: cur.depth + 1,
              nCurrent: cur.nCurrent,
              path: [hit.point],
              segments: [],
            });
          }

          cur.origin = nextOrigin;
          cur.dir = reflDir;
          cur.intensity *= R;
          cur.power *= R;
          cur.depth += 1;
          continue;
        }

        // ── LENS (Thin-lens + chromatic dispersion) ────────────
        if (comp.type === 'lens') {
          const rot = comp.rotation || 0;
          const localDir = M.dirGlobalToLocal(cur.dir, rot);
          const signDir = localDir.x >= 0 ? 1 : -1;
          let f = Math.abs(comp.focalLength || 180);
          if (comp.lensType === 'concave' || comp.lensType === 'plano-concave') {
            f = -f;
          }
          // Subtle chromatic dispersion based on refractive index
          const baseN = comp.refractiveIndex || 1.52;
          const nWl = M.cauchyIndex(baseN, cur.wavelength);
          const fEff = f * ((baseN - 1) / Math.max(0.1, nWl - 1));

          const y = hit.meta.localY;
          const curSlope = localDir.y / (Math.abs(localDir.x) > 1e-4 ? Math.abs(localDir.x) : 1e-4);
          const newSlope = curSlope - y / fEff;
          const newLocalDir = Vec.norm({ x: signDir, y: newSlope });
          const worldDir = Vec.norm(M.dirLocalToGlobal(newLocalDir, rot));

          cur.origin = Vec.add(hit.point, Vec.mul(worldDir, 1.2));
          cur.dir = worldDir;
          cur.intensity *= 0.97;
          cur.power *= 0.97;
          cur.depth += 1;
          continue;
        }

        // ── ACTIVE LASER GAIN MEDIUM (Optical Pumping + Stimulated Emission!) ──
        if (comp.type === 'gain_medium') {
          const spec = GAIN_MEDIA[comp.mediumType || 'ruby'] || GAIN_MEDIA.ruby;
          const entering = Vec.dot(cur.dir, hit.normal) < 0;
          const gain = comp.gainCoefficient || spec.gain;

          // Optical pumping: any incoming pump beam excites population inversion & triggers lasing!
          if (entering) {
            comp._isPumped = true;
            emitFromGainMedium(comp);
          }

          // Pass ray through active rod with amplification (stimulated emission)
          const outWl = comp.emissionWavelength || spec.visWl;
          const isAxisAligned = Math.abs(Vec.dot(cur.dir, M.dirLocalToGlobal({ x: 1, y: 0 }, comp.rotation || 0))) > 0.7;
          if (isAxisAligned) {
            cur.wavelength = outWl;
            cur.color = M.wavelengthToColor(outWl);
            cur.isWhite = false;
            cur.intensity = M.clamp(cur.intensity * (entering ? 1.0 : Math.min(1.45, gain)), 0.1, 1.0);
            cur.power = Math.min(80, cur.power * (entering ? 1.0 : gain));
            cur.origin = Vec.add(hit.point, Vec.mul(cur.dir, 1.2));
            cur.depth += 1;
            continue;
          } else {
            // Transverse pump beam absorbed by crystal to create population inversion!
            break;
          }
        }

        // ── PRISM & MEDIUM (Snell's law + Cauchy + TIR + Beer-Lambert) ──
        if (comp.type === 'prism' || comp.type === 'medium') {
          const baseN = comp.refractiveIndex || 1.52;
          const entering = Vec.dot(cur.dir, hit.normal) < 0;

          // White light entering a prism disperses into the full visible spectrum!
          if (comp.type === 'prism' && entering && cur.isWhite) {
            for (let wIdx = 0; wIdx < WHITE_SPECTRUM.length; wIdx++) {
              const wl = WHITE_SPECTRUM[wIdx];
              const nSpec = M.cauchyIndex(baseN, wl);
              const refrSpec = M.refract(cur.dir, hit.normal, 1.0, nSpec);
              if (queue.length + finishedRays.length < MAX_TOTAL_RAYS) {
                queue.push({
                  origin: Vec.add(hit.point, Vec.mul(refrSpec.dir, 0.9)),
                  dir: refrSpec.dir,
                  wavelength: wl,
                  color: M.wavelengthToColor(wl),
                  isWhite: false,
                  intensity: cur.intensity * 0.9,
                  power: cur.power / WHITE_SPECTRUM.length,
                  depth: cur.depth + 1,
                  nCurrent: nSpec,
                  path: [hit.point],
                  segments: [],
                });
              }
            }
            break;
          }

          const nGlass = comp.type === 'prism' ? M.cauchyIndex(baseN, cur.wavelength) : baseN;
          const n1 = entering ? 1.0 : nGlass;
          const n2 = entering ? nGlass : 1.0;

          const refr = M.refract(cur.dir, hit.normal, n1, n2);
          const F = refr.tir ? 1.0 : M.fresnelReflectance(cur.dir, hit.normal, n1, n2);

          // Spawn weak Fresnel reflected ray on entry if significant
          if (!refr.tir && F > 0.08 && cur.intensity * F > 0.05 && queue.length + finishedRays.length < MAX_TOTAL_RAYS) {
            const reflDir = M.reflect(cur.dir, hit.normal);
            queue.push({
              origin: Vec.add(hit.point, Vec.mul(reflDir, 0.8)),
              dir: reflDir,
              wavelength: cur.wavelength,
              color: cur.color,
              isWhite: !!cur.isWhite,
              intensity: cur.intensity * F,
              power: cur.power * F,
              depth: cur.depth + 1,
              nCurrent: cur.nCurrent,
              path: [hit.point],
              segments: [],
            });
          }

          cur.dir = refr.dir;
          cur.origin = Vec.add(hit.point, Vec.mul(refr.dir, 0.9));
          cur.intensity *= refr.tir ? 0.98 : (1 - F * 0.5);
          cur.power *= refr.tir ? 0.98 : (1 - F * 0.5);
          cur._absorbingAlpha = (comp.type === 'medium' && entering && !refr.tir)
            ? (comp.absorptionCoefficient || 0)
            : 0;
          cur.depth += 1;
          continue;
        }

        // ── FLEXIBLE CURVED OPTICAL FIBER (Real TIR Zig-Zag!) ──
        if (comp.type === 'fiber') {
          const pts = Bezier.getFiberPoints(comp);
          const n1 = comp.coreIndex || 1.50;
          const n2 = comp.claddingIndex || 1.44;
          const NA = Math.sqrt(Math.max(0, n1 * n1 - n2 * n2));
          const maxAcceptRad = Math.asin(Math.min(1, NA)) + 0.35; // slightly generous for usability

          const isReverse = hit.meta.end === 'output';
          const p0 = isReverse ? pts[3] : pts[0];
          const p1 = isReverse ? pts[2] : pts[1];
          const p2 = isReverse ? pts[1] : pts[2];
          const p3 = isReverse ? pts[0] : pts[3];

          const inTan = hit.meta.tan;
          const inNor = hit.meta.nor;
          const cosInc = M.clamp(Vec.dot(cur.dir, inTan), -1, 1);
          const incAngle = Math.acos(cosInc);

          if (incAngle <= maxAcceptRad) {
            const signedSin = Vec.dot(cur.dir, inNor);
            const entryAngle = Math.asin(M.clamp(signedSin / n1, -0.95, 0.95));
            const entryOffset = (hit.meta.u - 0.5) * 2 * hit.meta.hitR;
            const coreR = (comp.coreDiameter || 20) * 0.5;

            const tir = Bezier.buildFiberTIRPath(p0, p1, p2, p3, coreR, entryOffset, entryAngle);
            // Append all internal zig-zag TIR bounce segments to both path & segments!
            let prevP = hit.point;
            for (let k = 0; k < tir.path.length; k++) {
              const nextP = tir.path[k];
              cur.path.push(nextP);
              cur.segments.push({
                a: prevP,
                b: nextP,
                intensityStart: cur.intensity * 0.95,
                intensityEnd: cur.intensity * 0.95,
                color: cur.color,
                isWhite: !!cur.isWhite,
                wavelength: cur.wavelength,
              });
              prevP = nextP;
            }

            comp.isGuiding = true;
            comp.guidedColor = cur.color;
            comp._guidedCount = (comp._guidedCount || 0) + 1;

            // Continue ray exiting the far ferrule
            const exitOrigin = Vec.add(tir.exitPoint, Vec.mul(tir.exitDir, 2.0));
            cur.origin = exitOrigin;
            cur.dir = tir.exitDir;
            cur.intensity *= 0.92;
            cur.power *= 0.92;
            cur.depth += 1;
            continue;
          } else {
            // Outside acceptance cone -> reflects off ferrule
            const reflDir = M.reflect(cur.dir, hit.normal);
            cur.origin = Vec.add(hit.point, Vec.mul(reflDir, 1.0));
            cur.dir = reflDir;
            cur.intensity *= 0.45;
            cur.power *= 0.45;
            cur.depth += 1;
            continue;
          }
        }

        // ── DIFFRACTION GRATING ────────────────────────────────
        if (comp.type === 'grating') {
          const rot = comp.rotation || 0;
          const localDir = M.dirGlobalToLocal(cur.dir, rot);
          const signY = localDir.y >= 0 ? 1 : -1;
          const sinIn = M.clamp(localDir.x, -0.98, 0.98);
          const linesPerMm = comp.gratingDensity || 600;
          const dNm = 1e6 / linesPerMm;
          const wls = cur.isWhite ? WHITE_SPECTRUM : [cur.wavelength || 632.8];
          const orders = cur.isWhite ? [-1, 0, 1] : [-2, -1, 0, 1, 2];
          const weights = { 0: 0.55, 1: 0.42, '-1': 0.42, 2: 0.24, '-2': 0.24 };

          for (let wi = 0; wi < wls.length; wi++) {
            const lam = wls[wi];
            for (let oi = 0; oi < orders.length; oi++) {
              const m = orders[oi];
              // For white light, m=0 stays white (only emit once)
              if (cur.isWhite && m === 0 && wi > 0) continue;
              const sinOut = sinIn + (m * lam) / dNm;
              if (Math.abs(sinOut) >= 0.95) continue;
              const cosOut = Math.sqrt(1 - sinOut * sinOut);
              const newLocal = { x: sinOut, y: signY * cosOut };
              const newWorld = Vec.norm(M.dirLocalToGlobal(newLocal, rot));
              const w = weights[m] || 0.2;
              const outWhite = cur.isWhite && m === 0;
              if (queue.length + finishedRays.length < MAX_TOTAL_RAYS) {
                queue.push({
                  origin: Vec.add(hit.point, Vec.mul(newWorld, 1.5)),
                  dir: newWorld,
                  wavelength: lam,
                  color: outWhite ? '#ffffff' : M.wavelengthToColor(lam),
                  isWhite: outWhite,
                  intensity: cur.intensity * w,
                  power: (cur.power * w) / (outWhite ? 1 : wls.length),
                  depth: cur.depth + 1,
                  nCurrent: 1.0,
                  path: [hit.point],
                  segments: [],
                });
              }
            }
          }
          break;
        }

        // ── SINGLE SLIT / APERTURE ─────────────────────────────
        if (comp.type === 'single_slit' || comp.type === 'aperture') {
          const openW = Math.max(8, comp.slitWidth || 16);
          if (Math.abs(hit.meta.localOffset) <= openW * 0.5) {
            const spread = comp.type === 'single_slit' ? [-10, -5, 0, 5, 10] : [-3, 0, 3];
            for (let si = 0; si < spread.length; si++) {
              const deg = spread[si];
              const weight = deg === 0 ? 0.85 : (Math.abs(deg) <= 5 ? 0.48 : 0.24);
              const newDir = Vec.norm(Vec.rot(cur.dir, M.degToRad(deg)));
              if (queue.length + finishedRays.length < MAX_TOTAL_RAYS) {
                queue.push({
                  origin: Vec.add(hit.point, Vec.mul(newDir, 1.5)),
                  dir: newDir,
                  wavelength: cur.wavelength,
                  color: cur.color,
                  isWhite: !!cur.isWhite,
                  intensity: cur.intensity * weight,
                  power: cur.power * weight,
                  depth: cur.depth + 1,
                  nCurrent: 1.0,
                  path: [hit.point],
                  segments: [],
                });
              }
            }
          }
          break;
        }

        // ── DOUBLE SLIT (Young's Interference) ─────────────────
        if (comp.type === 'double_slit') {
          const spacing = Math.max(12, Math.min(80, comp.slitSpacing || 26));
          const slitW = Math.max(8, comp.slitWidth || 10);
          const off = Math.abs(hit.meta.localOffset);
          const inSlit = Math.abs(off - spacing * 0.5) <= slitW * 0.65;
          if (inSlit) {
            const angles = [-14, -7, 0, 7, 14];
            for (let ai = 0; ai < angles.length; ai++) {
              const deg = angles[ai];
              const w = deg === 0 ? 0.78 : (Math.abs(deg) === 7 ? 0.5 : 0.28);
              const newDir = Vec.norm(Vec.rot(cur.dir, M.degToRad(deg)));
              if (queue.length + finishedRays.length < MAX_TOTAL_RAYS) {
                queue.push({
                  origin: Vec.add(hit.point, Vec.mul(newDir, 1.5)),
                  dir: newDir,
                  wavelength: cur.wavelength,
                  color: cur.color,
                  isWhite: !!cur.isWhite,
                  intensity: cur.intensity * w,
                  power: cur.power * w,
                  depth: cur.depth + 1,
                  nCurrent: 1.0,
                  path: [hit.point],
                  segments: [],
                });
              }
            }
          }
          break;
        }

        break;
      }

      finishedRays.push(cur);
    }

    return { rays: finishedRays, annotations };
  }

  global.RayTracer = { traceAll, getPrismVerticesLocal, GAIN_MEDIA, LAMP_COLOR_MAP };
})(typeof window !== 'undefined' ? window : global);
