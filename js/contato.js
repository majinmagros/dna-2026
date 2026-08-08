import * as THREE from 'three';
import { createRenderer, watchResize, addStars, loadTexture, loopWhenVisible, disposeScene } from './core.js';

/* ------------------------------------------------------------------ */
/* PARTÍCULAS DNA: dupla hélice de pontos em looping no fundo          */
/* ------------------------------------------------------------------ */
function particulas() {
  const mount = document.getElementById('particulas-canvas');
  if (!mount) return;
  const { renderer, cleanup: cleanupRenderer } = createRenderer(mount);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  addStars(scene, 400, 26);

  const radius = 2.4;
  const height = 15;
  const strands = 2;
  const perStrand = 160;
  const total = strands * perStrand;

  const positions = new Float32Array(total * 3);
  const colors = new Float32Array(total * 3);

  const cyan = new THREE.Color(0x00e5ff);
  const crismon = new THREE.Color(0xe11d3c);
  const white = new THREE.Color(0xffffff);

  let idx = 0;
  for (let s = 0; s < strands; s++) {
    for (let i = 0; i < perStrand; i++) {
      const t = i / perStrand;
      const y = (t - 0.5) * height;
      const a = t * Math.PI * 10 + s * Math.PI;
      positions[idx * 3] = Math.cos(a) * radius;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = Math.sin(a) * radius;

      const jitter = (Math.random() - 0.5) * 0.08;
      positions[idx * 3] += (Math.random() - 0.5) * 0.15;
      positions[idx * 3 + 1] += jitter;
      positions[idx * 3 + 2] += (Math.random() - 0.5) * 0.15;

      const c = s === 0 ? cyan : crismon;
      const col = c.clone().lerp(white, Math.random() * 0.45);
      colors[idx * 3] = col.r;
      colors[idx * 3 + 1] = col.g;
      colors[idx * 3 + 2] = col.b;
      idx++;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({ size: 0.07, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  /* sprites dos logos girando ao redor da hélice */
  const sprites = [];
  ['dnalogo.jpeg', 'dnalogo1.jpeg', 'dnaLogo.png'].forEach((src, i) => {
    loadTexture(src).then((tex) => {
      const img = tex.image;
      const ar = img.width / img.height;
      const s = new THREE.Mesh(
        new THREE.PlaneGeometry(1.1 * ar, 1.1),
        new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true, opacity: 0.4, depthWrite: false })
      );
      const a = (i / 3) * Math.PI * 2;
      s.userData = { a, radius: 4.2, y0: i - 1 };
      scene.add(s);
      sprites.push(s);
    }).catch(() => {});
  });

  const clock = new THREE.Clock();
  const stopLoop = loopWhenVisible(mount, () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    points.rotation.y += dt * 0.25;
    points.rotation.x = 0.35;

    sprites.forEach((s, i) => {
      const d = s.userData;
      const a = d.a + t * 0.3;
      s.position.set(Math.cos(a) * d.radius, d.y0 + Math.sin(t * 0.5 + i) * 0.6, Math.sin(a) * d.radius);
      s.lookAt(camera.position);
      s.rotation.z = 0;
    });

    renderer.render(scene, camera);
  });

  const stopResize = watchResize(renderer, camera, mount);

  // Cleanup on mount removal
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
  document.addEventListener('DOMContentLoaded', particulas);
} else {
  particulas();
}