import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { modelUrl } from '../config/site';
import { buildGearSet, fitModel } from '../lib/threeUtils';

const load = (name) => useGLTF(modelUrl(name), false, true); // no Draco, meshopt on
export const preloadModels = (...names) => names.forEach((n) => useGLTF.preload(modelUrl(n), false, true));

/** A private copy of a model, centred and scaled to `size`. Safe to use on skinned/animated models. */
export function useFittedModel(name, size) {
  const gltf = load(name);
  return useMemo(() => {
    const root = clone(gltf.scene);
    return { ...fitModel(root, size), root, animations: gltf.animations };
  }, [gltf, size]);
}

/** The gears model, split so every gear spins on its own pivot. */
export function useGearSet(size) {
  const gltf = load('gears');
  return useMemo(() => buildGearSet(clone(gltf.scene), size), [gltf, size]);
}
