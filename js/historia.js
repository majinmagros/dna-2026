import * as THREE from 'three';
import { createRenderer, watchResize, addStars, loopWhenVisible, disposeScene, prefersReducedMotion } from './core.js';

/* ------------------------------------------------------------------ */
/* TIMELINE 3D: anéis de partículas girando com os marcos do Krav-Maga */
/* (inspirado nos exemplos de partículas/points do threejs.org)        */
/* ------------------------------------------------------------------ */

function makeTextSprite(text, sub, color) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = '700 64px Montserrat, Arial, sans-serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, 58);

  ctx.font = '400 28px Montserrat, Arial, sans-serif';
  ctx.fillStyle = '#aab3c5';
  ctx.fillText(sub, canvas.width / 2, 118);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    opacity: 0,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(3.1, 0.97, 1);
  return sprite;
}

function makeRing(radius, count, colorHex, spread = 1.4) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const r = radius + (Math.random() - 0.5) * spread;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
    pos[i * 3 + 2] = Math.sin(a) * r;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: colorHex,
    size: 0.055,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  const pts = new THREE.Points(geo, mat);
  return { pts, geo, mat };
}

function timeline() {
  const mount = document.getElementById('timeline-canvas');
  if (!mount) return;
  const { renderer, cleanup: cleanupRenderer } = createRenderer(mount);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 120);
  camera.position.set(0, 2.4, 13);
  camera.lookAt(0, 0, 0);

  addStars(scene, 700, 55);
  scene.fog = new THREE.FogExp2(0x0b0e14, 0.016);

  const rings = [
    makeRing(3.1, 340, 0x00e5ff, 0.9),
    makeRing(4.6, 420, 0xe11d3c, 1.1),
    makeRing(6.2, 360, 0x2f6bff, 1.3),
    makeRing(7.8, 300, 0x9fd8ff, 1.6),
  ];
  rings.forEach((r) => scene.add(r.pts));

  const marcos = [
    { ano: '1910', sub: 'Nascimento de Imi', color: '#f2f4f8', radius: 2.7, y: 1.7, speed: 1.0 },
    { ano: '1940', sub: 'A fuga no Pentcho', color: '#00e5ff', radius: 4.2, y: 0.5, speed: 0.82 },
    { ano: '1948', sub: 'IDF · Tzahal', color: '#f2f4f8', radius: 5.7, y: -0.6, speed: 0.66 },
    { ano: '1964', sub: 'Krav-Maga civil', color: '#e11d3c', radius: 7.1, y: 0.2, speed: 0.52 },
    { ano: '1971', sub: 'O nome Krav-Maga', color: '#00e5ff', radius: 8.5, y: -1.4, speed: 0.42 },
    { ano: '1998', sub: 'Legado de Imi', color: '#f2f4f8', radius: 9.9, y: 1.1, speed: 0.34 },
  ];

  const markers = marcos.map((m) => {
    const sprite = makeTextSprite(m.ano, m.sub, m.color);
    const a = Math.random() * Math.PI * 2;
    sprite.userData = { a, radius: m.radius, y: m.y, speed: m.speed, baseOpacity: 0.96 };
    scene.add(sprite);
    return sprite;
  });

  const timer = new THREE.Timer();
  timer.start();
  const reduced = prefersReducedMotion();

  const stopLoop = loopWhenVisible(mount, () => {
    const dt = Math.min(timer.getDelta(), 0.05);
    const t = timer.elapsedTime;

    if (!reduced) {
      rings.forEach((r, i) => {
        r.pts.rotation.y += dt * (0.12 + i * 0.045);
        r.pts.rotation.x = 0.22 + Math.sin(t * 0.18 + i) * 0.08;
      });

      markers.forEach((s, i) => {
        const d = s.userData;
        d.a += dt * d.speed;
        s.position.set(Math.cos(d.a) * d.radius, d.y + Math.sin(t * 0.4 + i) * 0.35, Math.sin(d.a) * d.radius);
        const fade = THREE.MathUtils.clamp(Math.sin(d.a) * 2.2 + 0.9, 0.15, 1);
        s.material.opacity = d.baseOpacity * fade;
      });
    } else {
      // reduced motion: fixa a cena em uma posição estática
      markers.forEach((s) => {
        s.position.set(0, s.userData.y, s.userData.radius);
        s.material.opacity = 0.9;
      });
    }

    camera.position.x = Math.sin(t * 0.1) * 0.8;
    camera.position.y = 2.4 + Math.sin(t * 0.14) * 0.4;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  });

  const stopResize = watchResize(renderer, camera, mount);

  const observer = new MutationObserver(() => {
    if (!document.body.contains(mount)) {
      stopLoop();
      stopResize();
      cleanupRenderer();
      disposeScene(scene);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', timeline);
} else {
  timeline();
}