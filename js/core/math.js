/**
 * LASER SCIENCE & TECHNOLOGY — VIRTUAL INTERACTIVE LABORATORY
 * Core Optical & Geometric Math Engine (v2.0)
 * Pure ES6 — No external dependencies
 */
(function (global) {
  'use strict';

  const DEG = Math.PI / 180;
  const RAD = 180 / Math.PI;

  const Vec = {
    create: (x = 0, y = 0) => ({ x, y }),
    add: (a, b) => ({ x: a.x + b.x, y: a.y + b.y }),
    sub: (a, b) => ({ x: a.x - b.x, y: a.y - b.y }),
    mul: (a, s) => ({ x: a.x * s, y: a.y * s }),
    dot: (a, b) => a.x * b.x + a.y * b.y,
    cross: (a, b) => a.x * b.y - a.y * b.x,
    lenSq: (a) => a.x * a.x + a.y * a.y,
    len: (a) => Math.hypot(a.x, a.y),
    dist: (a, b) => Math.hypot(a.x - b.x, a.y - b.y),
    norm: (a) => {
      const l = Math.hypot(a.x, a.y);
      return l > 1e-9 ? { x: a.x / l, y: a.y / l } : { x: 1, y: 0 };
    },
    perp: (a) => ({ x: -a.y, y: a.x }),
    rot: (a, rad) => {
      const c = Math.cos(rad), s = Math.sin(rad);
      return { x: a.x * c - a.y * s, y: a.x * s + a.y * c };
    },
    lerp: (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }),
  };

  function degToRad(d) { return d * DEG; }
  function radToDeg(r) { return r * RAD; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function globalToLocal(pt, origin, rotDeg) {
    const dx = pt.x - origin.x;
    const dy = pt.y - origin.y;
    const r = -rotDeg * DEG;
    const c = Math.cos(r), s = Math.sin(r);
    return { x: dx * c - dy * s, y: dx * s + dy * c };
  }

  function localToGlobal(pt, origin, rotDeg) {
    const r = rotDeg * DEG;
    const c = Math.cos(r), s = Math.sin(r);
    return {
      x: origin.x + pt.x * c - pt.y * s,
      y: origin.y + pt.x * s + pt.y * c,
    };
  }

  function dirGlobalToLocal(dir, rotDeg) {
    return Vec.rot(dir, -rotDeg * DEG);
  }

  function dirLocalToGlobal(dir, rotDeg) {
    return Vec.rot(dir, rotDeg * DEG);
  }

  /**
   * Ray (origin + t * dir, t > eps) vs Line Segment (a -> b)
   * Returns { t, u, point } or null
   */
  function intersectRaySegment(origin, dir, a, b, eps = 1e-3) {
    const v1 = Vec.sub(origin, a);
    const v2 = Vec.sub(b, a);
    const v3 = { x: -dir.y, y: dir.x };
    const denom = Vec.dot(v2, v3);
    if (Math.abs(denom) < 1e-9) return null;
    const t = Vec.cross(v2, v1) / denom;
    const u = Vec.dot(v1, v3) / denom;
    if (t > eps && u >= 0 && u <= 1) {
      return {
        t,
        u,
        point: { x: origin.x + dir.x * t, y: origin.y + dir.y * t },
      };
    }
    return null;
  }

  /**
   * Ray vs Circle (center, radius) -> returns nearest t > eps
   */
  function intersectRayCircle(origin, dir, center, radius, eps = 1e-3) {
    const oc = Vec.sub(origin, center);
    const a = Vec.dot(dir, dir);
    const b = 2 * Vec.dot(oc, dir);
    const c = Vec.dot(oc, oc) - radius * radius;
    const disc = b * b - 4 * a * c;
    if (disc < 0) return [];
    const sq = Math.sqrt(disc);
    const hits = [];
    const t1 = (-b - sq) / (2 * a);
    const t2 = (-b + sq) / (2 * a);
    if (t1 > eps) hits.push({ t: t1, point: Vec.add(origin, Vec.mul(dir, t1)) });
    if (t2 > eps) hits.push({ t: t2, point: Vec.add(origin, Vec.mul(dir, t2)) });
    return hits;
  }

  /**
   * Reflection: R = I - 2 (I·N) N  (I and N normalized)
   */
  function reflect(dir, normal) {
    const n = Vec.dot(dir, normal) < 0 ? normal : Vec.mul(normal, -1);
    const d = Vec.dot(dir, n);
    return Vec.norm({ x: dir.x - 2 * d * n.x, y: dir.y - 2 * d * n.y });
  }

  /**
   * Snell's Law Refraction: returns { dir, tir: boolean }
   * n1: incident medium index, n2: transmitted medium index
   */
  function refract(dir, normal, n1, n2) {
    let n = Vec.norm(normal);
    let cosI = -Vec.dot(dir, n);
    if (cosI < 0) {
      n = Vec.mul(n, -1);
      cosI = -cosI;
    }
    const eta = n1 / n2;
    const k = 1 - eta * eta * (1 - cosI * cosI);
    if (k < 0) {
      return { dir: reflect(dir, n), tir: true };
    }
    const cosT = Math.sqrt(k);
    const tDir = Vec.norm({
      x: eta * dir.x + (eta * cosI - cosT) * n.x,
      y: eta * dir.y + (eta * cosI - cosT) * n.y,
    });
    return { dir: tDir, tir: false };
  }

  /**
   * Schlick's Fresnel reflectance approximation
   */
  function fresnelReflectance(dir, normal, n1, n2) {
    const cosI = Math.abs(Vec.dot(dir, normal));
    const r0 = Math.pow((n1 - n2) / (n1 + n2), 2);
    return clamp(r0 + (1 - r0) * Math.pow(1 - cosI, 5), 0, 1);
  }

  /**
   * Cauchy dispersion formula for optical glass (BK7 / Flint)
   * baseN: refractive index at 587.6 nm (d-line)
   */
  function cauchyIndex(baseN, wavelengthNm) {
    const lamUm = (wavelengthNm || 587.6) / 1000;
    const B = 0.0085 * (baseN - 1.0); // stronger dispersion for higher-index glass
    const baseTerm = B / (0.5876 * 0.5876);
    return baseN + (B / (lamUm * lamUm) - baseTerm);
  }

  /**
   * Physically accurate Wavelength (380nm - 780nm) to RGB hex string
   */
  function wavelengthToColor(wl) {
    const w = clamp(wl || 632.8, 380, 780);
    let r = 0, g = 0, b = 0;
    if (w >= 380 && w < 440) {
      r = -(w - 440) / (440 - 380); g = 0; b = 1;
    } else if (w >= 440 && w < 490) {
      r = 0; g = (w - 440) / (490 - 440); b = 1;
    } else if (w >= 490 && w < 510) {
      r = 0; g = 1; b = -(w - 510) / (510 - 490);
    } else if (w >= 510 && w < 580) {
      r = (w - 510) / (580 - 510); g = 1; b = 0;
    } else if (w >= 580 && w < 645) {
      r = 1; g = -(w - 645) / (645 - 580); b = 0;
    } else if (w >= 645 && w <= 780) {
      r = 1; g = 0; b = 0;
    }

    let factor = 1;
    if (w >= 380 && w < 420) factor = 0.35 + 0.65 * (w - 380) / (420 - 380);
    else if (w > 700 && w <= 780) factor = 0.35 + 0.65 * (780 - w) / (780 - 700);

    const gamma = 0.8;
    const R = Math.round(255 * Math.pow(clamp(r * factor, 0, 1), gamma));
    const G = Math.round(255 * Math.pow(clamp(g * factor, 0, 1), gamma));
    const B = Math.round(255 * Math.pow(clamp(b * factor, 0, 1), gamma));
    return `rgb(${R}, ${G}, ${B})`;
  }

  function wavelengthToHex(wl) {
    const rgb = wavelengthToColor(wl);
    const m = rgb.match(/\d+/g);
    if (!m) return 0xff3333;
    return ((+m[0]) << 16) | ((+m[1]) << 8) | (+m[2]);
  }

  /* ═══════════════════════════════════════════════════════════════
     CUBIC BEZIER MATH (FOR FLEXIBLE OPTICAL FIBER CABLE)
  ═══════════════════════════════════════════════════════════════ */
  const Bezier = {
    /**
     * Evaluate cubic Bezier at t in [0, 1]
     */
    point(p0, p1, p2, p3, t) {
      const mt = 1 - t;
      const mt2 = mt * mt, t2 = t * t;
      const a = mt2 * mt, b = 3 * mt2 * t, c = 3 * mt * t2, d = t2 * t;
      return {
        x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
        y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
      };
    },

    /**
     * First derivative (tangent vector, normalized)
     */
    tangent(p0, p1, p2, p3, t) {
      const mt = 1 - t;
      const dx = 3 * mt * mt * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
      const dy = 3 * mt * mt * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
      return Vec.norm({ x: dx, y: dy });
    },

    /**
     * Normal vector perpendicular to tangent at t
     */
    normal(p0, p1, p2, p3, t) {
      return Vec.perp(this.tangent(p0, p1, p2, p3, t));
    },

    /**
     * Sample N+1 evenly-parameterized points + cumulative arc lengths
     */
    sample(p0, p1, p2, p3, steps = 48) {
      const pts = [];
      let totalLen = 0;
      let prev = null;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const p = this.point(p0, p1, p2, p3, t);
        const tan = this.tangent(p0, p1, p2, p3, t);
        const nor = Vec.perp(tan);
        if (prev) totalLen += Vec.dist(prev, p);
        pts.push({ t, x: p.x, y: p.y, tan, nor, s: totalLen });
        prev = p;
      }
      return { pts, totalLen };
    },

    /**
     * Distance from world point to sampled curve
     */
    distToCurve(pt, samples) {
      let minD = Infinity;
      for (let i = 0; i < samples.length; i++) {
        const d = Math.hypot(pt.x - samples[i].x, pt.y - samples[i].y);
        if (d < minD) minD = d;
      }
      return minD;
    },

    /**
     * Ensure a fiber component has valid world-space cubic Bezier points
     * [p0 (input), p1 (ctrl1), p2 (ctrl2), p3 (output)]
     */
    getFiberPoints(comp) {
      if (comp.points && comp.points.length === 4) {
        return comp.points;
      }
      // Derive from legacy position + rotation + length
      const L = comp.length || 260;
      const cx = comp.position ? comp.position.x : 400;
      const cy = comp.position ? comp.position.y : 280;
      const rad = (comp.rotation || 0) * DEG;
      const dx = Math.cos(rad), dy = Math.sin(rad);
      const nx = -dy, ny = dx;
      const bend = comp.bend || 0;
      const p0 = { x: cx - dx * L * 0.5, y: cy - dy * L * 0.5 };
      const p3 = { x: cx + dx * L * 0.5, y: cy + dy * L * 0.5 };
      const p1 = { x: cx - dx * L * 0.17 + nx * bend, y: cy - dy * L * 0.17 + ny * bend };
      const p2 = { x: cx + dx * L * 0.17 - nx * bend * 0.5, y: cy + dy * L * 0.17 - ny * bend * 0.5 };
      comp.points = [p0, p1, p2, p3];
      return comp.points;
    },

    /**
     * Generate realistic Total Internal Reflection (TIR) zig-zag path inside a curved fiber
     * entryOffset: lateral offset from core center at entry (-coreR..+coreR)
     * entryAngle: angle between refracted ray and fiber input tangent (radians)
     */
    buildFiberTIRPath(p0, p1, p2, p3, coreRadius, entryOffset, entryAngle) {
      const { pts, totalLen } = this.sample(p0, p1, p2, p3, 80);
      const rCore = Math.max(4, coreRadius - 1.5);
      // Bounce pitch based on entry angle (ensure visible regular bounces even at shallow incidence)
      const effAngle = Math.max(0.22, Math.min(0.65, Math.abs(entryAngle) + 0.18));
      const sign0 = entryAngle >= 0 ? 1 : -1;
      const halfBounceLen = (2 * rCore) / Math.tan(effAngle);
      const numBounces = Math.max(4, Math.min(28, Math.round(totalLen / Math.max(16, halfBounceLen))));

      // Helper to sample position + normal at arc-length s
      const atArc = (sTarget) => {
        const s = clamp(sTarget, 0, totalLen);
        let lo = 0, hi = pts.length - 1;
        while (lo < hi - 1) {
          const mid = (lo + hi) >> 1;
          if (pts[mid].s < s) lo = mid; else hi = mid;
        }
        const a = pts[lo], b = pts[hi];
        const frac = (b.s - a.s) > 1e-6 ? (s - a.s) / (b.s - a.s) : 0;
        const x = a.x + (b.x - a.x) * frac;
        const y = a.y + (b.y - a.y) * frac;
        const nor = Vec.norm({
          x: a.nor.x + (b.nor.x - a.nor.x) * frac,
          y: a.nor.y + (b.nor.y - a.nor.y) * frac,
        });
        return { x, y, nor };
      };

      const path = [];
      // Entry point on input face
      const startFrame = atArc(0);
      const clampedOff = clamp(entryOffset, -rCore * 0.85, rCore * 0.85);
      path.push({
        x: startFrame.x + startFrame.nor.x * clampedOff,
        y: startFrame.y + startFrame.nor.y * clampedOff,
      });

      // Regular zig-zag TIR bounces along the curved core walls
      const stepS = totalLen / (numBounces + 1);
      let side = sign0;
      for (let k = 1; k <= numBounces; k++) {
        const s = k * stepS;
        const fr = atArc(s);
        path.push({
          x: fr.x + fr.nor.x * (side * rCore),
          y: fr.y + fr.nor.y * (side * rCore),
        });
        side = -side;
      }

      // Exit point on output face
      const endFrame = atArc(totalLen);
      path.push({ x: endFrame.x, y: endFrame.y });

      const exitTan = this.tangent(p0, p1, p2, p3, 1);
      return { path, exitPoint: { x: endFrame.x, y: endFrame.y }, exitDir: exitTan, totalLen };
    },
  };

  global.OpticsMath = {
    Vec,
    Bezier,
    DEG,
    RAD,
    degToRad,
    radToDeg,
    clamp,
    globalToLocal,
    localToGlobal,
    dirGlobalToLocal,
    dirLocalToGlobal,
    intersectRaySegment,
    intersectRayCircle,
    reflect,
    refract,
    fresnelReflectance,
    cauchyIndex,
    wavelengthToColor,
    wavelengthToHex,
  };
})(typeof window !== 'undefined' ? window : global);
