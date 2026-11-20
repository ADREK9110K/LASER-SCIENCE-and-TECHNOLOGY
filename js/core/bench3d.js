/**
 * LASER SCIENCE & TECHNOLOGY — VIRTUAL INTERACTIVE LABORATORY
 * Interactive 3D WebGL Optical Bench (Three.js r128 + OrbitControls)
 * Synchronizes 1:1 with 2D components & ray paths (including curved 3D optical fibers)
 */
(function (global) {
  'use strict';

  const M = global.OpticsMath;

  class Bench3D {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container || typeof THREE === 'undefined') return;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x070d18);
      this.scene.fog = new THREE.FogExp2(0x070d18, 0.0045);

      const w = this.container.clientWidth || 800;
      const h = this.container.clientHeight || 560;

      this.camera = new THREE.PerspectiveCamera(42, w / h, 0.5, 600);
      this.camera.position.set(0, 38, 46);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.container.appendChild(this.renderer.domElement);

      if (THREE.OrbitControls) {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.04;
        this.controls.minDistance = 12;
        this.controls.maxDistance = 160;
        this.controls.target.set(0, 2, 0);
      }

      this.compGroup = new THREE.Group();
      this.rayGroup = new THREE.Group();
      this.scene.add(this.compGroup);
      this.scene.add(this.rayGroup);

      this._buildLighting();
      this._buildOpticalTable();

      this._running = true;
      this._animate();
    }

    _buildLighting() {
      const amb = new THREE.AmbientLight(0x94a3b8, 0.65);
      this.scene.add(amb);

      const key = new THREE.DirectionalLight(0xf8fafc, 0.95);
      key.position.set(35, 55, 35);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      this.scene.add(key);

      const rim = new THREE.DirectionalLight(0x38bdf8, 0.45);
      rim.position.set(-40, 25, -30);
      this.scene.add(rim);
    }

    _buildOpticalTable() {
      // Anodized dark aluminum optical breadboard
      const tableGeo = new THREE.BoxGeometry(96, 2.2, 62);
      const tableMat = new THREE.MeshStandardMaterial({
        color: 0x111827,
        metalness: 0.72,
        roughness: 0.32,
      });
      const table = new THREE.Mesh(tableGeo, tableMat);
      table.position.y = -1.1;
      table.receiveShadow = true;
      this.scene.add(table);

      // M6 tapped hole grid
      const grid = new THREE.GridHelper(92, 46, 0x334155, 0x1e293b);
      grid.position.y = 0.04;
      this.scene.add(grid);

      // Table steel edge trim
      const edgeGeo = new THREE.BoxGeometry(96.6, 0.35, 62.6);
      const edgeMat = new THREE.MeshStandardMaterial({ color: 0xf08833, metalness: 0.5, roughness: 0.4 });
      const edge = new THREE.Mesh(edgeGeo, edgeMat);
      edge.position.y = -0.05;
      this.scene.add(edge);
    }

    _to3D(pt) {
      const scale = 0.085;
      return new THREE.Vector3((pt.x - 450) * scale, 0, (pt.y - 280) * scale);
    }

    _makePost(x, z, height = 3.2) {
      const g = new THREE.Group();
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(1.1, 1.3, 0.5, 20),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 })
      );
      base.position.set(x, 0.25, z);
      g.add(base);

      const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, height, 14),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 })
      );
      rod.position.set(x, height * 0.5, z);
      g.add(rod);
      return g;
    }

    syncFrom2D(components, rays) {
      if (!this.scene) return;
      this._clearGroup(this.compGroup);
      this._clearGroup(this.rayGroup);

      const beamY = 3.4;

      // 1. Build 3D Optical Components
      for (let i = 0; i < components.length; i++) {
        const c = components[i];
        const p = this._to3D(c.position || { x: 450, y: 280 });
        const rotY = -M.degToRad(c.rotation || 0);

        if (c.type === 'fiber') {
          const pts2D = M.Bezier.getFiberPoints(c);
          const curve3D = new THREE.CubicBezierCurve3(
            this._to3D(pts2D[0]).setY(beamY),
            this._to3D(pts2D[1]).setY(beamY),
            this._to3D(pts2D[2]).setY(beamY),
            this._to3D(pts2D[3]).setY(beamY)
          );
          // Outer amber translucent jacket
          const jacketGeo = new THREE.TubeGeometry(curve3D, 48, 0.65, 16, false);
          const jacketMat = new THREE.MeshPhysicalMaterial({
            color: 0xf59e0b,
            transparent: true,
            opacity: 0.42,
            roughness: 0.25,
            metalness: 0.1,
          });
          this.compGroup.add(new THREE.Mesh(jacketGeo, jacketMat));

          // Inner glowing silica core
          const coreGeo = new THREE.TubeGeometry(curve3D, 48, 0.28, 12, false);
          const coreColor = c.isGuiding ? 0x38bdf8 : 0x64748b;
          const coreMat = new THREE.MeshStandardMaterial({
            color: coreColor,
            emissive: c.isGuiding ? 0x38bdf8 : 0x000000,
            emissiveIntensity: c.isGuiding ? 0.6 : 0,
            roughness: 0.2,
          });
          this.compGroup.add(new THREE.Mesh(coreGeo, coreMat));

          // Support posts at both ferrules
          const pIn = this._to3D(pts2D[0]);
          const pOut = this._to3D(pts2D[3]);
          this.compGroup.add(this._makePost(pIn.x, pIn.z, beamY));
          this.compGroup.add(this._makePost(pOut.x, pOut.z, beamY));
          continue;
        }

        if (c.type === 'ruler' || c.type === 'protractor') continue;

        const holder = new THREE.Group();
        holder.position.set(p.x, 0, p.z);
        holder.rotation.y = rotY;
        holder.add(this._makePost(0, 0, beamY - 0.6));

        if (c.type === 'laser' || c.type === 'white_light') {
          const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.95, 0.95, 5.2, 24),
            new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 })
          );
          body.rotation.z = Math.PI / 2;
          body.position.y = beamY;
          holder.add(body);

          const accentCol = c.type === 'white_light' ? 0xffffff : M.wavelengthToHex(c.wavelength || 632.8);
          const ring = new THREE.Mesh(
            new THREE.CylinderGeometry(1.0, 1.0, 0.45, 24),
            new THREE.MeshStandardMaterial({ color: accentCol, emissive: accentCol, emissiveIntensity: 0.8 })
          );
          ring.rotation.z = Math.PI / 2;
          ring.position.set(2.2, beamY, 0);
          holder.add(ring);
        } else if (c.type === 'mirror') {
          const w3 = (c.width || 120) * 0.085;
          const isBS = c.mirrorType === 'partial';
          const plate = new THREE.Mesh(
            new THREE.BoxGeometry(w3, 4.2, 0.35),
            new THREE.MeshPhysicalMaterial({
              color: isBS ? 0x38bdf8 : 0xe2e8f0,
              metalness: isBS ? 0.1 : 0.95,
              roughness: 0.06,
              transparent: isBS,
              opacity: isBS ? 0.45 : 1.0,
            })
          );
          plate.position.y = beamY;
          holder.add(plate);
        } else if (c.type === 'lens') {
          const r3 = ((c.diameter || 90) * 0.085) * 0.5;
          const lensMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(r3, r3, 0.65, 28),
            new THREE.MeshPhysicalMaterial({
              color: 0x7dd3fc,
              transparent: true,
              opacity: 0.45,
              roughness: 0.08,
              metalness: 0.05,
            })
          );
          lensMesh.rotation.z = Math.PI / 2;
          lensMesh.position.y = beamY;
          holder.add(lensMesh);
        } else if (c.type === 'prism') {
          const s3 = (c.size || 100) * 0.085;
          const shape = new THREE.Shape();
          const verts = global.RayTracer.getPrismVerticesLocal(c);
          verts.forEach((v, idx) => {
            const vx = v.x * 0.085, vy = -v.y * 0.085;
            if (idx === 0) shape.moveTo(vx, vy); else shape.lineTo(vx, vy);
          });
          shape.closePath();
          const extrude = new THREE.ExtrudeGeometry(shape, { depth: 4.0, bevelEnabled: false });
          extrude.rotateX(-Math.PI / 2);
          const prismMesh = new THREE.Mesh(
            extrude,
            new THREE.MeshPhysicalMaterial({
              color: 0x93c5fd,
              transparent: true,
              opacity: 0.42,
              roughness: 0.06,
              metalness: 0.05,
            })
          );
          prismMesh.position.y = beamY - 2.0;
          holder.add(prismMesh);
        } else if (c.type === 'gain_medium') {
          const w3 = (c.width || 160) * 0.085;
          const rod = new THREE.Mesh(
            new THREE.CylinderGeometry(1.4, 1.4, w3, 24),
            new THREE.MeshPhysicalMaterial({
              color: c.mediumType === 'nd_yag' ? 0xa78bfa : (c.mediumType === 'er_yag' ? 0xfb923c : (c.mediumType === 'yb_yag' ? 0xfacc15 : 0xf43f5e)),
              emissive: c._isPumped ? 0xf43f5e : 0x000000,
              emissiveIntensity: c._isPumped ? 0.55 : 0,
              transparent: true,
              opacity: 0.72,
              roughness: 0.12,
            })
          );
          rod.rotation.z = Math.PI / 2;
          rod.position.y = beamY;
          holder.add(rod);
        } else if (c.type === 'medium') {
          const w3 = (c.width || 150) * 0.085;
          const h3 = (c.height || 100) * 0.085;
          const box = new THREE.Mesh(
            new THREE.BoxGeometry(w3, 4.0, h3),
            new THREE.MeshPhysicalMaterial({
              color: (c.absorptionCoefficient || 0) > 0 ? 0x64748b : 0x38bdf8,
              transparent: true,
              opacity: 0.35,
              roughness: 0.12,
            })
          );
          box.position.y = beamY;
          holder.add(box);
        } else if (c.type === 'detector' || c.type === 'screen') {
          const w3 = (c.width || 80) * 0.085;
          const det = new THREE.Mesh(
            new THREE.BoxGeometry(w3, 4.4, 0.8),
            new THREE.MeshStandardMaterial({
              color: c.type === 'detector' ? 0x0f172a : 0x1e293b,
              metalness: 0.5,
              roughness: 0.4,
            })
          );
          det.position.y = beamY;
          holder.add(det);
        } else {
          // Grating / slits / aperture
          const w3 = (c.width || 120) * 0.085;
          const frame = new THREE.Mesh(
            new THREE.BoxGeometry(w3, 4.2, 0.35),
            new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.35 })
          );
          frame.position.y = beamY;
          holder.add(frame);
        }

        this.compGroup.add(holder);
      }

      // 2. Build 3D Laser Beams (per-segment color & intensity!)
      for (let i = 0; i < rays.length; i++) {
        const ray = rays[i];
        const segs = ray.segments || [];
        for (let k = 0; k < segs.length; k++) {
          const seg = segs[k];
          const a = this._to3D(seg.a).setY(beamY);
          const b = this._to3D(seg.b).setY(beamY);
          if (b.length() > 75) {
            const dir = new THREE.Vector3().subVectors(b, a).normalize();
            b.copy(a).addScaledVector(dir, 50);
          }
          const segLen = a.distanceTo(b);
          if (segLen < 0.05) continue;

          const hex = seg.isWhite ? 0xffffff : M.wavelengthToHex(seg.wavelength || ray.wavelength || 632.8);
          const avgI = ((seg.intensityStart ?? 1) + (seg.intensityEnd ?? 1)) * 0.5;
          const rad = 0.06 + 0.07 * avgI;

          const cyl = new THREE.Mesh(
            new THREE.CylinderGeometry(rad, rad, segLen, 8),
            new THREE.MeshBasicMaterial({
              color: hex,
              transparent: true,
              opacity: Math.min(1, 0.12 + avgI * 0.88),
            })
          );
          cyl.position.copy(a).add(b).multiplyScalar(0.5);
          cyl.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3().subVectors(b, a).normalize()
          );
          this.rayGroup.add(cyl);
        }
      }
    }

    setCameraView(view) {
      if (!this.camera || !this.controls) return;
      if (view === 'top') {
        this.camera.position.set(0, 72, 0.01);
        this.controls.target.set(0, 0, 0);
      } else {
        this.camera.position.set(0, 38, 46);
        this.controls.target.set(0, 2, 0);
      }
      this.controls.update();
    }

    resize() {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth || 800;
      const h = this.container.clientHeight || 560;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }

    _clearGroup(grp) {
      while (grp.children.length > 0) {
        const obj = grp.children.pop();
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      }
    }

    _animate() {
      if (!this._running) return;
      requestAnimationFrame(() => this._animate());
      if (this.controls) this.controls.update();
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    }
  }

  global.Bench3D = Bench3D;
})(typeof window !== 'undefined' ? window : global);
