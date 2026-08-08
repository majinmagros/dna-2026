import * as THREE from 'three';
import { OrbitControls } from './build/OrbitControls.js';
import { createRenderer, watchResize, loadTexture, setPhoto, addStars } from './core.js';

/* ------------------------------------------------------------------ */
/* GALERIA 3D: imagens em anel orbitante (interativo)                  */
/* ------------------------------------------------------------------ */
function galeria() {
  const mount = document.getElementById('galeria-canvas');
  if (!mount) return;
  const renderer = createRenderer(mount);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.set(0, 1.2, 7);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.1;
  controls.minDistance = 4;
  controls.maxDistance = 12;

  addStars(scene, 400, 20);

  const imgs = ['DNA kids.jpg', 'dna5.jpeg', 'dna6.jpeg', 'dna4.jpeg', 'dna3.jpeg', 'dna2.jpeg'];
  const group = new THREE.Group();
  scene.add(group);
  const cards = [];

  imgs.forEach((src, i) => {
    const angle = (i / imgs.length) * Math.PI * 2;
    loadTexture(src).then((tex) => {
      const img = tex.image;
      const ar = img.width / img.height;
      const geo = new THREE.PlaneGeometry(1.5 * ar, 1.5);
      const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true, depthWrite: false });
      const plane = new THREE.Mesh(geo, mat);
      group.add(plane);
      cards.push({ plane, angle });
    }).catch(() => {});
  });

  const clock = new THREE.Clock();
  function animate() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    cards.forEach(({ plane, angle }) => {
      const a = angle + group.rotation.y;
      const r = 2.8;
      plane.position.set(Math.cos(a) * r, Math.sin(t * 0.4 + angle) * 0.4, Math.sin(a) * r);
      plane.rotation.set(0, a + Math.PI / 2, 0);
      plane.material.opacity = Math.abs(Math.sin(a)) > 0.6 ? 0.3 : 1;
    });

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
  watchResize(renderer, camera, mount);
}

/* ------------------------------------------------------------------ */
/* BENEFÍCIOS (produtos.html): cubo texturizado girando                */
/* ------------------------------------------------------------------ */
function beneficiosMini() {
  const mount = document.getElementById('galeriaBeneficios-canvas');
  if (!mount) return;
  const renderer = createRenderer(mount);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 4.5);

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 2.4, 2.4),
    [
      new THREE.MeshBasicMaterial({ color: 0x1a2130, transparent: true, depthWrite: false }),
      new THREE.MeshBasicMaterial({ color: 0x1a2130, transparent: true, depthWrite: false }),
      new THREE.MeshBasicMaterial({ color: 0x1a2130, transparent: true, depthWrite: false }),
      new THREE.MeshBasicMaterial({ color: 0x1a2130, transparent: true, depthWrite: false }),
      new THREE.MeshBasicMaterial({ color: 0x1a2130, transparent: true, depthWrite: false }),
      new THREE.MeshBasicMaterial({ color: 0x1a2130, transparent: true, depthWrite: false }),
    ]
  );
  scene.add(cube);

  ['dnaLogo.png', 'dna2.jpeg', 'dna3.jpeg', 'dna4.jpeg', 'dna.jpg', 'imagem1.jpg'].forEach((src, i) => {
    loadTexture(src).then((tex) => {
      cube.material[i] = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true, opacity: 0.92 });
      cube.material[i].needsUpdate = true;
    }).catch(() => {});
  });

  const clock = new THREE.Clock();
  function animate() {
    const dt = Math.min(clock.getDelta(), 0.05);
    cube.rotation.x += dt * 0.25;
    cube.rotation.y += dt * 0.4;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
  watchResize(renderer, camera, mount);
}

function start() {
  galeria();
  beneficiosMini();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}