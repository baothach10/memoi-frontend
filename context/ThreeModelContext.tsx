'use client'

import { loadGLTFModel } from '@/utils/loadModel';
import { createContext, useContext, useEffect, useState } from 'react';
import * as THREE from 'three';

type ThreeModelContextType = {
    model: THREE.Object3D | undefined;
    animationActions: { [key: string]: THREE.AnimationAction } | undefined;
    mixer: THREE.AnimationMixer | undefined;
    isLoading: boolean;
};

const ThreeModelContext = createContext<ThreeModelContextType>({
    model: undefined,
    animationActions: undefined,
    mixer: undefined,
    isLoading: true,
});

export const useThreeModel = () => useContext(ThreeModelContext);

export function ThreeModelProvider({ children }: { children: React.ReactNode }) {
    const [modelData, setModelData] = useState<ThreeModelContextType>({
        model: undefined,
        animationActions: undefined,
        mixer: undefined,
        isLoading: true,
    });

    useEffect(() => {
        const scene = new THREE.Scene(); // Temporary scene for loading

        loadGLTFModel(scene, '/models/Logo_Silver1.glb', { draco: false })
            .then(({ model, animationActions, mixer }) => {
                // Configure model
                // model.position.set(-0.2, -0.3, 0);
                // model.rotateY(-Math.PI / 6);
                // model.scale.set(1.6, 1.6, 1.6);

                // // Configure materials
                // model.traverse((child) => {
                //     if ((child as THREE.Mesh).isMesh) {
                //         const mesh = child as THREE.Mesh;
                //         if (mesh.material instanceof THREE.MeshStandardMaterial) {
                //             mesh.material.metalness = 0;
                //             mesh.material.roughness = 1;
                //         }
                //     }
                // });

                setModelData({
                    model,
                    animationActions: animationActions || undefined,
                    mixer: mixer || undefined,
                    isLoading: false,
                });
            })
            .catch((error) => {
                console.error('Error loading model:', error);
                setModelData(prev => ({ ...prev, isLoading: false }));
            });
    }, []);

    return (
        <ThreeModelContext.Provider value={modelData}>
            {children}
        </ThreeModelContext.Provider>
    );
}
