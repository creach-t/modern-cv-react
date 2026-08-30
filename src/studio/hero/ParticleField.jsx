import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Texture de point douce (dégradé radial) générée une fois.
const makeSprite = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.8)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
};

// Échantillonne le texte en positions monde (plan XY).
const sampleText = (text, count, scaleX, scaleY, offsetX) => {
  const CW = 512;
  const CH = 256;
  const c = document.createElement("canvas");
  c.width = CW;
  c.height = CH;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.font = "bold 200px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, CW / 2, CH / 2);
  const data = ctx.getImageData(0, 0, CW, CH).data;

  const hits = [];
  for (let y = 0; y < CH; y += 3) {
    for (let x = 0; x < CW; x += 3) {
      if (data[(y * CW + x) * 4 + 3] > 128) hits.push([x, y]);
    }
  }

  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const [px, py] = hits[Math.floor(Math.random() * hits.length)] || [
      CW / 2,
      CH / 2,
    ];
    out[i * 3] = (px / CW - 0.5) * scaleX + offsetX;
    out[i * 3 + 1] = -(py / CH - 0.5) * scaleY;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
  }
  return out;
};

/**
 * Monogramme "TC" en particules : assemblage par ressort physique,
 * répulsion au curseur + rebond élastique. Pause hors-écran, fallback
 * prefers-reduced-motion, nettoyage complet.
 */
const ParticleField = ({ color = "#e2603f" }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;
    const COUNT = 3200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Formation cible (monogramme), positions vivantes, vitesses.
    const home = sampleText("TC", COUNT, 11, 5.5, 2.4);
    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const s = 16 + Math.random() * 10;
      pos[i * 3] = (Math.random() - 0.5) * s;
      pos[i * 3 + 1] = (Math.random() - 0.5) * s;
      pos[i * 3 + 2] = (Math.random() - 0.5) * s;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const sprite = makeSprite();
    const material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.075,
      map: sprite,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Souris → position monde sur le plan z=0.
    const mouseWorld = new THREE.Vector3(999, 999, 0);
    const ndc = new THREE.Vector3();
    let hasMouse = false;
    const onMove = (e) => {
      hasMouse = true;
      ndc.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      ndc.unproject(camera);
      const dir = ndc.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      mouseWorld.copy(camera.position).add(dir.multiplyScalar(dist));
    };
    const onLeave = () => {
      hasMouse = false;
      mouseWorld.set(999, 999, 0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const R = 2.2; // rayon de répulsion
    const R2 = R * R;
    const isReduced = reduced();
    let raf = null;
    let visible = true;
    const clock = new THREE.Clock();

    const step = () => {
      const t = clock.getElapsedTime();
      const posAttr = geometry.attributes.position;
      const arr = posAttr.array;
      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3;
        const iy = ix + 1;
        const iz = ix + 2;

        // ressort vers la formation
        vel[ix] += (home[ix] - arr[ix]) * 0.012;
        vel[iy] += (home[iy] - arr[iy]) * 0.012;
        vel[iz] += (home[iz] - arr[iz]) * 0.012;

        // répulsion curseur (plan XY)
        if (hasMouse) {
          const dx = arr[ix] - mouseWorld.x;
          const dy = arr[iy] - mouseWorld.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 0.0001) {
            const d = Math.sqrt(d2);
            const f = (1 - d / R) * 0.9;
            vel[ix] += (dx / d) * f;
            vel[iy] += (dy / d) * f;
          }
        }

        // amortissement + intégration
        vel[ix] *= 0.9;
        vel[iy] *= 0.9;
        vel[iz] *= 0.9;
        arr[ix] += vel[ix];
        arr[iy] += vel[iy];
        arr[iz] += vel[iz];
      }
      posAttr.needsUpdate = true;

      // parallaxe très douce du groupe
      points.rotation.y = Math.sin(t * 0.2) * 0.05;
      renderer.render(scene, camera);
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || !visible) return;
      step();
    };

    if (isReduced) {
      for (let i = 0; i < home.length; i++) pos[i] = home[i];
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    } else {
      loop();
    }

    // pause quand le hero n'est pas visible (perf + capture propre)
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.02 }
    );
    io.observe(mount);

    const onResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (isReduced) renderer.render(scene, camera);
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      sprite.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [color]);

  return <div ref={mountRef} className="h-full w-full" aria-hidden="true" />;
};

export default ParticleField;
