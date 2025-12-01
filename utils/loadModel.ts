import * as THREE from "three";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";

export async function loadGLTFModel(
  scene: THREE.Scene,
  path: string,
  options: { draco?: boolean } = {}
): Promise<{
  model: THREE.Object3D;
  animationActions?: { [key: string]: THREE.AnimationAction };
  mixer?: THREE.AnimationMixer;
}> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    if (options.draco) {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(
        "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
      );
      loader.setDRACOLoader(dracoLoader);
    }

    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;

        let mixer: THREE.AnimationMixer | undefined;
        const animationActions: { [key: string]: THREE.AnimationAction } = {};
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixer!.clipAction(clip);
            action.enabled = false;
            action.paused = true;
            action.clampWhenFinished = true;
            animationActions[clip.name] = action;
          });
        }

        resolve({
          model,
          animationActions: Object.keys(animationActions).length
            ? animationActions
            : undefined,
          mixer,
        });
      },
      undefined,
      (error) => reject(error)
    );
  });
}
