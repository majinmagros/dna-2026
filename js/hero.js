import * as THREE from 'three';
import { OrbitControls } from './build/OrbitControls.js';
import { createRenderer, watchResize, loadTexture, createPhotoPlane, setPhoto, addStars } from './core.js';

/* ------------------------------------------------------------------ */
/* HERO: dupla hélice de DNA feita de fotos do repositório (loop)      */
/* ------------------------------------------------------------------ */
function initHero() {
  const mount = document.getElementById('hero-canvas');
  if (!mount) return;
  const renderer = createRenderer(mount);
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 200);
  camera.position.set(0, 3, 13);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.4;
  controls.enablePan = false;
  controls.minDistance = 5;
  controls.maxDistance = 34;
  controls.target.set(0, 0, 0);

  addStars(scene, 800, 60);
  scene.fog = new THREE.FogExp2(0x0b0e14, 0.018);

  const radius = 3.4;
  const height = 8.5;
  const loops = 6;
  const steps = loops * 60;

  function strandPoints(phaseShift) {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2 * loops;
      const y = (i / steps - 0.5) * height;
      pts.push(new THREE.Vector3(Math.cos(t + phaseShift) * radius, y, Math.sin(t + phaseShift) * radius));
    }
    return pts;
  }

  const lineA = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(strandPoints(0)),
    new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.32 })
  );
  const lineB = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(strandPoints(Math.PI)),
    new THREE.LineBasicMaterial({ color: 0xe11d3c, transparent: true, opacity: 0.32 })
  );
  scene.add(lineA);
  scene.add(lineB);

  /* --- fotos "grudadas" na hélice, duas por volta --- */
  const photos = [
    'dnaLogo.png', 'dna1.jpeg', 'dna2.jpeg', 'dna3.jpeg', 'dna4.jpeg',
    'dna5.jpeg', 'dna6.jpeg', 'dna.jpg', 'DNA kids.jpg', 'imagem1.jpg'
  ];

  const helix = new THREE.Group();
  scene.add(helix);

  const rungs = [];
  photos.forEach((src, idx) => {
    const slot = new THREE.Group();
    helix.add(slot);

    loadTexture(src).then((tex) => {
      const img = tex.image;
      const ar = img.width / img.height;
      const baseH = 1.15;
      const geo = new THREE.PlaneGeometry(baseH * ar, baseH);
      const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true, depthWrite: false });
      const plane = new THREE.Mesh(geo, mat);
      slot.add(plane);
    }).catch(() => {});

    const thema = idx * 0.3;
    const offset = (idx % 2 === 0 ? 0 : Math.PI);
    slot.userData = { phase: idx * (Math.PI * 2 * loops) / 10, offY: (idx / 10 - 0.5) * height, spin: 0.5 + idx * 0.1, offset };
    rungs.push(slot);
  });

  /* anéis de luz */
  const ringA = new THREE.Mesh(
    new THREE.TorusGeometry(4.8, 0.03, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.35 })
  );
  const ringB = new THREE.Mesh(
    new THREE.TorusGeometry(4.8, 0.03, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0xe11d3c, transparent: true, opacity: 0.35 })
  );
  ringA.rotation.set(Math.PI / 2.4, 0, 0);
  ringB.rotation.set(Math.PI / 1.5, 0, 0);
  helix.add(ringA);
  helix.add(ringB);

  const clock = new THREE.Clock();
  function animate() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    helix.rotation.y += dt * 0.3;
    helix.children.forEach((rung, i) => {
      const d = rung.userData;
      rung.position.y = d.off + Math.sin(t * d.speed + i) * 0.5;
      const r = 0.06;
      rung.rotation.x = Math.sin(t * 0.4 + i) * r;
      rung.rotation.z = Math.cos(t * 0.4 + i) * r;
    });

    ringA.rotation.x += dt * 0.12;
    ringB.rotation.y -= dt * 0.15;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
  watchResize(renderer, camera, mount);
}

/* ------------------------------------------------------------------ */
/* CARROSSEL 3D: looping de imagens (seção benefícios)                 */
/* ------------------------------------------------------------------ */
function carrossel() {
  const mount = document.getElementById('carrossel-canvas');
  if (!mount) return;
  const renderer = createRenderer(mount);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.set(0, 0.8, 6);

  const imgs = ['dna.jpg', 'dna2.jpeg', 'dna3.jpeg', 'dna4.jpeg', 'DNA kids.jpg', 'imagem1.jpg'];
  const group = new THREE.Group();
  scene.add(group);
  const cards = [];

  imgs.forEach((src, i) => {
    const angle = (i / imgs.length) * Math.PI * 2;
    loadTexture(src).then((tex) => {
      const img = tex.image;
      const ar = img.width / img.height;
      const geo = new THREE.PlaneGeometry(1.9 * ar, 1.9);
      const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true, depthWrite: false });
      const plane = new THREE.Mesh(geo, mat);
      group.add(plane);
      cards.push({ plane, angle, src });
    }).catch(() => {});
  });

  addStars(scene, 300, 16);

  const clock = new THREE.Clock();
  function animate() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    group.rotation.y += dt * 0.45;

    cards.forEach(({ plane, angle }) => {
      const a = angle + group.rotation.y;
      const r = 2.5;
      plane.position.set(Math.cos(a) * r, Math.sin(t * 0.6 + angle) * 0.3, Math.sin(a) * r);
      plane.rotation.set(0, a + Math.PI / 2, 0);
      const behind = Math.sin(a) > 0.2;
      plane.material.opacity = behind ? 0.3 : 1;
      plane.scale.setScalar(1);
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
  watchResize(renderer, camera, mount);
}

function start() {
  initHero();
  carrossel();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}