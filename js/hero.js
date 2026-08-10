import * as THREE from 'three';
import { OrbitControls } from './build/OrbitControls.js';
import { createRenderer, watchResize, loadTexture, addStars, loopWhenVisible, disposeScene, createTextureAtlas, createCarouselInstancedMesh, prefersReducedMotion } from './core.js';

/* ------------------------------------------------------------------ */
/* HERO: dupla hélice de DNA feita de fotos do repositório (loop)      */
/* ------------------------------------------------------------------ */
async function initHero() {
  const mount = document.getElementById('hero-canvas');
  if (!mount) return;
  const { renderer, cleanup: cleanupRenderer } = await createRenderer(mount);
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
    'dna5.jpeg', 'dna6.jpeg', 'dna.jpg', 'DNA kids.jpg'
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

  const timer = new THREE.Timer();
  timer.start();
  const reduced = prefersReducedMotion();

  const renderFrame = () => {
    const dt = Math.min(timer.getDelta(), 0.05);
    const t = timer.elapsedTime;

    if (!reduced) {
      helix.rotation.y += dt * 0.3;
      helix.children.forEach((rung, i) => {
        const d = rung.userData;
        if (d.phase === undefined) return;
        const a = (i * Math.PI * 2) / 9 + t * 0.35;
        rung.position.set(
          Math.cos(a) * (radius + (i % 2 ? 0.12 : 0)),
          d.offY + Math.sin(t * d.spin + i) * 0.5,
          Math.sin(a) * (radius + (i % 2 ? 0.12 : 0))
        );
        rung.rotation.set(Math.sin(t * 0.4 + i) * 0.06, Math.PI / 2 - a, Math.cos(t * 0.4 + i) * 0.06);
      });

      ringA.rotation.x += dt * 0.12;
      ringB.rotation.y -= dt * 0.15;
    } else {
      helix.children.forEach((rung, i) => {
        const d = rung.userData;
        if (d.phase === undefined) return;
        const a = (i * Math.PI * 2) / 9;
        rung.position.set(
          Math.cos(a) * (radius + (i % 2 ? 0.12 : 0)),
          d.offY,
          Math.sin(a) * (radius + (i % 2 ? 0.12 : 0))
        );
        rung.rotation.set(0, Math.PI / 2 - a, 0);
      });
    }

    controls.update();
    renderer.render(scene, camera);
  };

  const stopLoop = loopWhenVisible(mount, renderFrame);

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

/* ------------------------------------------------------------------ */
/* CARROSSEL 3D: looping de imagens (seção benefícios) — InstancedMesh */
/* ------------------------------------------------------------------ */
async function carrossel() {
  const mount = document.getElementById('carrossel-canvas');
  if (!mount) return;
  const { renderer, cleanup: cleanupRenderer } = createRenderer(mount);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.set(0, 0.8, 6);

  const imgs = ['dna.jpg', 'dna2.jpeg', 'dna3.jpeg', 'dna4.jpeg', 'DNA kids.jpg'];

  // Create texture atlas and instanced mesh
  const { texture: atlasTexture, uvRects } = await createTextureAtlas(imgs);
  if (!atlasTexture) return;

  const { mesh, dummy, updateInstanceMatrix, setInstanceOpacity, setAtlas } = createCarouselInstancedMesh(uvRects, imgs.length);
  setAtlas(atlasTexture);
  scene.add(mesh);

  addStars(scene, 300, 16);

  const timer = new THREE.Timer();
  timer.start();
  const reduced = prefersReducedMotion();
  const stopLoop = loopWhenVisible(mount, () => {
    const dt = Math.min(timer.getDelta(), 0.05);
    const t = timer.elapsedTime;

    if (!reduced) {
      imgs.forEach((src, i) => {
        const angle = (i / imgs.length) * Math.PI * 2;
        const a = angle + t * 0.45;
        const r = 2.5;
        const x = Math.cos(a) * r;
        const y = Math.sin(t * 0.6 + angle) * 0.3;
        const z = Math.sin(a) * r;
        
        dummy.position.set(x, y, z);
        dummy.rotation.set(0, a + Math.PI / 2, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);

        const behind = Math.sin(a) > 0.2;
        setInstanceOpacity(i, behind ? 0.3 : 1);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }

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
      atlasTexture.dispose();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function start() {
  initHero();
  carrossel(); // async, no need to await
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}