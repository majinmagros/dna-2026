import * as THREE from 'three';

export const TAU = Math.PI * 2;

export function createRenderer(el, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  el.appendChild(renderer.domElement);
  fit(renderer, el);
  return renderer;
}

export function fit(renderer, el) {
  const w = el.clientWidth || window.innerWidth || 640;
  const h = el.clientHeight || 420;
  renderer.setSize(w, h, false);
}

export function resizeCamera(renderer, camera, el) {
  const w = el.clientWidth || window.innerWidth || 640;
  const h = el.clientHeight || 420;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

export function watchResize(renderer, camera, el) {
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => resizeCamera(renderer, camera, el));
    ro.observe(el);
    return () => ro.disconnect();
  }
  const onWin = () => resizeCamera(renderer, camera, el);
  window.addEventListener('resize', onWin);
  return () => window.removeEventListener('resize', onWin);
}

export function loadTexture(url) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        resolve(tex);
      },
      undefined,
      reject
    );
  });
}

export function createPhotoPlane(afterLoad) {
  const geo = new THREE.PlaneGeometry(2, 2);
  const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, depthWrite: false });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.visible = false;
  afterLoad((texture) => {
    mat.map = texture;
    mat.needsUpdate = true;
    const img = texture.image;
    const ar = img.width / img.height;
    mesh.scale.set(2 * ar, 2, 1);
    mesh.visible = true;
  });
  return mesh;
}

export function setPhoto(mesh, texture) {
  const mat = mesh.material;
  mat.map = texture;
  mat.needsUpdate = true;
  const img = texture.image;
  if (img) {
    const ar = img.width / img.height;
    mesh.scale.set(2 * ar, 2, 1);
  }
  mesh.visible = true;
}

export function addStars(scene, count = 500, radius = 40) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 2 * radius;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 2 * radius;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 2 * radius;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0x9fd8ff, size: 0.06, transparent: true, opacity: 0.7, depthWrite: false });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
  return pts;
}