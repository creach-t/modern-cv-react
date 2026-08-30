import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Rouage 3D : volume extrudé. Arêtes wireframe TRANSPARENTES + faces
// invisibles mais occultantes (écrivent la profondeur → cachent les arêtes
// situées derrière). Rendu "hidden-line".
const buildGear = (radius, teeth, depth, color) => {
  const rOuter = radius;
  const rInner = radius * 0.78;
  const hole = radius * 0.34;
  const shape = new THREE.Shape();
  const t = (Math.PI * 2) / teeth;

  for (let i = 0; i < teeth; i++) {
    const a0 = i * t;
    const verts = [
      [rInner, a0],
      [rOuter, a0 + t * 0.16],
      [rOuter, a0 + t * 0.34],
      [rInner, a0 + t * 0.5],
    ];
    verts.forEach(([r, a], idx) => {
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0 && idx === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
  }
  shape.closePath();

  const holePath = new THREE.Path();
  holePath.absarc(0, 0, hole, 0, Math.PI * 2, true);
  shape.holes.push(holePath);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: depth * 0.15,
    bevelSize: radius * 0.03,
    bevelSegments: 1,
    curveSegments: 4,
  });
  geo.center();

  const group = new THREE.Group();

  // faces invisibles (colorWrite off) mais qui écrivent la profondeur
  const maskMat = new THREE.MeshBasicMaterial({
    colorWrite: false,
    depthWrite: true,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  const mask = new THREE.Mesh(geo, maskMat);
  mask.renderOrder = 0;
  group.add(mask);

  // arêtes transparentes, testées contre la profondeur (donc occultées)
  const edges = new THREE.EdgesGeometry(geo, 18);
  const mat = new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.4,
    depthTest: true,
    depthWrite: false,
  });
  const lines = new THREE.LineSegments(edges, mat);
  lines.renderOrder = 1;
  group.add(lines);

  group.userData.mat = mat;
  return group;
};

/**
 * Rouages 3D wireframe opaques, connectés, descendant la page.
 * Position, luminosité (lueur) et rotation suivent le scroll (vitesse + position).
 * Le 1er rouage est placé haut/à droite (desktop) pour côtoyer le texte du hero.
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
    const BASE_Y = isSmall ? 0.5 : 3.2; // remonte la chaîne (1er rouage plus haut)
    const X = isSmall ? 2.4 : 4.6; // écartés vers les bords pour libérer le texte

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const groupRoot = new THREE.Group();
    scene.add(groupRoot);

    const span = (N - 1) * SPACING;
    const gears = [];
    const centers = [];
    for (let i = 0; i < N; i++) {
      const radius = 1.5 + ((i * 37) % 10) / 10;
      const teeth = 12 + (i % 4) * 2;
      const g = buildGear(radius, teeth, radius * 0.55, color);
      const x = (i % 2 === 0 ? 1 : -1) * X; // 1er rouage à droite (côté texte)
      const y = -i * SPACING;
      const z = (i % 3) - 1;
      g.position.set(x, y, z);
      g.rotation.x = -0.6;
      g.rotation.y = (i % 2 ? 1 : -1) * 0.28;
      groupRoot.add(g);
      gears.push({
        obj: g,
        mat: g.userData.mat,
        base: new THREE.Color(color),
        dir: i % 2 ? 1 : -1,
        speed: 0.003 + (i % 3) * 0.001,
        centerP: (i * SPACING - BASE_Y) / span, // progression où le rouage est centré
      });
      centers.push(new THREE.Vector3(x, y, z));
    }

    const connPts = [];
    for (let i = 0; i < centers.length - 1; i++)
      connPts.push(centers[i], centers[i + 1]);
    const connMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    });
    const connections = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(connPts),
      connMat
    );
    groupRoot.add(connections);

    const isReduced = reduced();
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
      groupRoot.position.y = BASE_Y + curP * span;

      gears.forEach((g) => {
        if (!isReduced) g.obj.rotation.z += g.dir * g.speed * (1 + vel * 6);
        const d = curP - g.centerP;
        const centered = Math.exp(-(d * d) / 0.012);
        // discret : lueur portée par l'opacité des arêtes (transparentes)
        g.mat.opacity = Math.min(0.85, 0.2 + centered * 0.45 + vel * 0.35);
      });
      connMat.opacity = 0.1 + vel * 0.4;
      groupRoot.rotation.y = (curP - 0.5) * 0.25;

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
