import * as THREE from 'three';
import { OrbitControls } from './build/OrbitControls.js';
import { createRenderer, watchResize, addStars, loopWhenVisible, disposeScene, loadTexture, createTextureAtlas, createCarouselInstancedMesh, prefersReducedMotion } from './core.js';

/* ------------------------------------------------------------------ */
/* GALERIA 3D: imagens em anel orbitante (interativo) — InstancedMesh  */
/* ------------------------------------------------------------------ */
async function galeria() {
  const mount = document.getElementById('galeria-canvas');
  if (!mount) return;
  const { renderer, cleanup: cleanupRenderer } = createRenderer(mount);
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

  // Create texture atlas and instanced mesh
  const { texture: atlasTexture, uvRects } = await createTextureAtlas(imgs);
  if (!atlasTexture) return;

  const { mesh, dummy, setInstanceOpacity } = createCarouselInstancedMesh(uvRects, imgs.length, 1.5, 1.5);
  mesh.material.uniforms.uAtlas.value = atlasTexture;
  scene.add(mesh);

  const clock = new THREE.Clock();
  const reduced = prefersReducedMotion();
  const stopLoop = loopWhenVisible(mount, () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    if (!reduced) {
      imgs.forEach((src, i) => {
        const angle = (i / imgs.length) * Math.PI * 2;
        const a = angle + t * 0.4; // group.rotation.y is now handled per-instance
        const r = 2.8;
        const x = Math.cos(a) * r;
        const y = Math.sin(t * 0.4 + angle) * 0.4;
        const z = Math.sin(a) * r;
        
        dummy.position.set(x, y, z);
        dummy.rotation.set(0, a + Math.PI / 2, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);

        const opacity = Math.abs(Math.sin(a)) > 0.6 ? 0.3 : 1;
        setInstanceOpacity(i, opacity);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }

    controls.update();
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

/* ------------------------------------------------------------------ */
/* BENEFÍCIOS (produtos.html): cubo texturizado girando                */
/* ------------------------------------------------------------------ */
function beneficiosMini() {
  const mount = document.getElementById('galeriaBeneficios-canvas');
  if (!mount) return;
  const { renderer, cleanup: cleanupRenderer } = createRenderer(mount);
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
  const stopLoop = loopWhenVisible(mount, () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!prefersReducedMotion()) {
      cube.rotation.x += dt * 0.25;
      cube.rotation.y += dt * 0.4;
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
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
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