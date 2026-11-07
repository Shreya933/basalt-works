import { Box3, CanvasTexture, Group, Vector3 } from 'three';

/** Centre `root` on the origin and scale it so its longest side equals `size`. */
export function fitModel(root, size) {
  const box = new Box3().setFromObject(root);
  const s = box.getSize(new Vector3());
  const c = box.getCenter(new Vector3());
  const k = size / Math.max(s.x, s.y, s.z);
  root.position.sub(c);
  const wrap = new Group();
  wrap.add(root);
  wrap.scale.setScalar(k);
  return { wrap, height: s.y * k };
}

/**
 * The gears file is one scene with five loose meshes. Give each mesh its own pivot at its centre
 * so it can spin on its own axis.
 */
export function buildGearSet(scene, size) {
  scene.updateMatrixWorld(true);
  const meshes = [];
  scene.traverse((o) => { if (o.isMesh) meshes.push(o); });
  const spinners = meshes.map((mesh, i) => {
    const centre = new Box3().setFromObject(mesh).getCenter(new Vector3());
    const pivot = new Group();
    pivot.position.copy(centre);
    scene.add(pivot);
    pivot.attach(mesh);
    return { pivot, dir: i % 2 ? 1 : -1, speed: 0.5 + (i % 3) * 0.28 };
  });
  return { ...fitModel(scene, size), spinners };
}

export function spinGears(spinners, t, p, reduce) {
  for (const g of spinners) g.pivot.rotation.y = g.dir * g.speed * ((reduce ? 0.6 : t * 0.5) + p * 14);
}

/** Soft round sprite used by the ember and spark particles. */
export function makeDotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const gr = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,220,170,1)');
  gr.addColorStop(0.25, 'rgba(255,130,30,.9)');
  gr.addColorStop(1, 'rgba(255,90,0,0)');
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}
