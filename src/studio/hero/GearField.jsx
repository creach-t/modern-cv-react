import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Silhouette de rouage (crénelée) en points, pour un tracé wireframe.
const cogPoints = (radius, teeth) => {
  const pts = [];
  const rTop = radius;
  const rBot = radius * 0.82;
  const seg = teeth * 8;
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    const phase = (i / (seg / teeth)) % 1;
    const r = phase < 0.5 ? rTop : rBot;
    pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
  }
  return pts;
};

const circlePoints = (radius, seg = 28) => {
  const pts = [];
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  return pts;
};

const buildGear = (radius, teeth, color) => {
  const group = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(cogPoints(radius, teeth)), mat));
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(circlePoints(radius * 0.32)), mat));
  // rayons
  const spokes = [];
  const rh = radius * 0.32;
  const rb = radius * 0.8;
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    spokes.push(
      new THREE.Vector3(Math.cos(a) * rh, Math.sin(a) * rh, 0),
      new THREE.Vector3(Math.cos(a) * rb, Math.sin(a) * rb, 0)
    );
  }
  group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(spokes), mat));
  group.userData.mat = mat;
  return group;
};

/**
 * Rouages 3D wireframe connectés, descendant la page.
 * La position, les lueurs et la rotation suivent le scroll (vitesse + position).
 * Fond fixe plein écran, sans interception d'événements.
 */
const GearField = ({ color = "#e2603f" }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const isSmall = width < 768;
    const N = isSmall ? 5 : 8;
    const SPACING = 5.2;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const groupRoot = new THREE.Group();
    scene.add(groupRoot);

    // création des rouages
    const gears = [];
    const centers = [];
    for (let i = 0; i < N; i++) {
      const radius = 1.6 + ((i * 37) % 10) / 10; // 1.6..2.5 pseudo-aléatoire stable
      const teeth = 10 + (i % 4) * 2;
      const g = buildGear(radius, teeth, color);
      const x = (i % 2 === 0 ? -1 : 1) * (isSmall ? 2 : 3.2);
      const y = -i * SPACING;
      const z = (i % 3) - 1; // -1..1
      g.position.set(x, y, z);
      g.rotation.x = -0.42; // légère inclinaison → effet 3D
      g.rotation.y = (i % 2 ? 1 : -1) * 0.15;
      groupRoot.add(g);
      gears.push({
        obj: g,
        mat: g.userData.mat,
        dir: i % 2 ? 1 : -1,
        speed: 0.003 + (i % 3) * 0.001,
        centerP: N > 1 ? i / (N - 1) : 0,
      });
      centers.push(new THREE.Vector3(x, y, z));
    }

    // connexions wireframe entre rouages consécutifs
    const connPts = [];
    for (let i = 0; i < centers.length - 1; i++) {
      connPts.push(centers[i], centers[i + 1]);
    }
    const connMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const connections = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(connPts),
      connMat
    );
    groupRoot.add(connections);

    const span = (N - 1) * SPACING;
    const isReduced = reduced();

    // état de scroll
    let targetP = 0;
    let curP = 0;
    let vel = 0;
    let lastY = window.scrollY;
    const maxScroll = () =>
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const onScroll = () => {
      const y = window.scrollY;
      targetP = Math.min(1, Math.max(0, y / maxScroll()));
      vel = Math.min(1, vel + Math.abs(y - lastY) / 60);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let raf = null;
    let visible = true;

    const frame = () => {
      curP += (targetP - curP) * 0.08;
      vel *= 0.92;
      groupRoot.position.y = curP * span;

      gears.forEach((g) => {
        if (!isReduced) g.obj.rotation.z += g.dir * g.speed * (1 + vel * 6);
        // lueur : rouage proche du centre de l'écran + boost à la vitesse de scroll
        const d = curP - g.centerP;
        const centered = Math.exp(-(d * d) / 0.01);
        g.mat.opacity = 0.16 + centered * 0.6 + vel * 0.25;
      });
      connMat.opacity = 0.1 + vel * 0.5;
      groupRoot.rotation.y = (curP - 0.5) * 0.2;

      renderer.render(scene, camera);
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || !visible) return;
      frame();
    };
    loop();

    const io = new IntersectionObserver(
      (e) => {
        visible = e[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    io.observe(mount);

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement);
    };
  }, [color]);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};

export default GearField;
