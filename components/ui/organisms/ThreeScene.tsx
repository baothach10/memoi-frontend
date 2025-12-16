'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useThreeModel } from '@/context/ThreeModelContext'
import {  EffectComposer, OrbitControls, RenderPass, RGBELoader, UnrealBloomPass } from 'three-stdlib'
import { DebugEnvironment } from 'three/examples/jsm/Addons.js'

export default function ThreeScene() {
    const mountRef = useRef<HTMLDivElement>(null)
    const { model, animationActions, mixer, isLoading } = useThreeModel();

    useEffect(() => {
        if (!mountRef.current || !model) return

        const scene = new THREE.Scene()
        // Use a white background for the scene (opaque)
        scene.background = new THREE.Color(0x000000)
        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        )

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
        renderer.setPixelRatio(window.devicePixelRatio)
        // renderer.setClearColor(0xffffff, 1)
        renderer.setSize(
            mountRef.current.clientWidth,
            mountRef.current.clientHeight
        )
        mountRef.current.appendChild(renderer.domElement)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.enableZoom = false

        camera.position.set(0, 0, 1.05);

        controls.target.copy(model.position);

        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileCubemapShader();

        const envScene = new DebugEnvironment();

        const generatedCubeRenderTarget = pmremGenerator.fromScene(envScene);
        scene.background = new THREE.Color(0xfffefa);
        scene.background = null;
        // scene.background = generatedCubeRenderTarget.texture;

        // Add model from context
        if (model) {
            model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    // if (child.isMesh && child.material instanceof THREE.MeshPhysicalMaterial) {
                    if (child.isMesh) {
                        const mat = child.material;

                        mat.envMap = generatedCubeRenderTarget.texture;

                        // Add physical reflection polish
                        // mat.clearcoat = 0.1;
                        // mat.clearcoatRoughness = 0.2;

                        // Let texture drive roughness but slightly reduce it
                        // mat.roughness = 0.5; // Use mid value instead of 1.0
                        // mat.metalness = 0.6; // Confirm fully metallic

                        // Enhance visible lighting interaction
                        // mat.normalScale.set(5, 5); // more pronounced

                        // Stronger reflection handling
                        mat.envMapIntensity = 2.5;

                        // Ensure material updates
                        mat.needsUpdate = true;

                    }
                }
            });
            scene.add(model);
            // Setup animation
            // if (animationActions && animationActions['Base Stack']) {
            //     const action = animationActions['Base Stack'];
            //     action.enabled = true;
            //     action.paused = false;
            //     action.setLoop(THREE.LoopRepeat, Infinity);
            //     action.play();
            // }

        }

        model.position.set(0, 0, 0); // push geometry down inside the pivot


        // Store initial states
        const initialCameraPos = camera.position.clone();
        const initialTarget = controls.target.clone();

        // Idle reset logic
        let idleTimeout: NodeJS.Timeout;
        let hasInteracted = false; // 👈 new flag

        function scheduleReset() {
            clearTimeout(idleTimeout);
            idleTimeout = setTimeout(() => {
                // Animate camera back
                gsap.to(camera.position, {
                    x: initialCameraPos.x,
                    y: initialCameraPos.y,
                    z: initialCameraPos.z,
                    duration: 2,
                    onUpdate: () => { controls.update(); }
                });

                // Animate target back
                gsap.to(controls.target, {
                    x: initialTarget.x,
                    y: initialTarget.y,
                    z: initialTarget.z,
                    duration: 2,
                    onUpdate: () => { controls.update(); }
                });
            }, 1000); // 5s idle
        }

        // When user interacts, mark as interacted and start scheduling resets
        function onUserInteraction() {
            if (!hasInteracted) {
                hasInteracted = true;
            }
            scheduleReset();
        }

        // controls.addEventListener("start", onUserInteraction);
        // controls.addEventListener("change", onUserInteraction);
        // controls.addEventListener("end", onUserInteraction);



        // const hrdi = new RGBELoader()
        //     .load('studio.hdr', (texture) => {
        //         texture.mapping = THREE.EquirectangularReflectionMapping;
        //         scene.environment = texture;
        //         scene.background = null; // set to texture if you want HDR as background
        //     });

        const sunLight = new THREE.DirectionalLight(0xffffff, 10);
        sunLight.position.set(5, 5, 5);
        sunLight.lookAt(model.getWorldPosition(new THREE.Vector3()));
        // scene.add(sunLight);

        const lightHelper = new THREE.DirectionalLightHelper(sunLight, 1);
        // scene.add(lightHelper);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        // scene.add(ambientLight);



        camera.lookAt(model.position);


        renderer.toneMapping = THREE.NeutralToneMapping;
        renderer.toneMappingExposure = 1.2; // Not more than 1.2
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        // Post-processing: EffectComposer + UnrealBloomPass to make the model look shiny/metallic
        const composer = new EffectComposer(renderer)
        const renderPass = new RenderPass(scene, camera)
        composer.addPass(renderPass)

        // Bloom parameters: tune strength/radius/threshold for a metallic sheen
        const bloomStrength = 0.15
        const bloomRadius = 0.1
        const bloomThreshold = 0.1
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(mountRef.current.clientWidth, mountRef.current.clientHeight), bloomStrength, bloomRadius, bloomThreshold)
        composer.addPass(bloomPass)
        // composer.addPass(new ClearPass(0xffffff, 1));

        scene.background = new THREE.Color(0xfffefa)

        const clock = new THREE.Clock();

        // Auto-rotate settings (radians per second)
        const rotateSpeed = 0.4


        // Animation loop
        let animationFrameId: number;
        const animate = () => {

            const delta = clock.getDelta();
            if (mixer) {
                mixer.update(delta);
            }

            // sunLight.position.copy(camera.position);
            sunLight.lookAt(model.getWorldPosition(new THREE.Vector3()));




            // Auto-rotate the model around its Y axis to give it a slow metallic spin
            if (model) {
                model.rotation.y += delta * rotateSpeed
            }

            controls.update()
            // Render via composer so bloom is applied
            composer.render()
            animationFrameId = requestAnimationFrame(animate)
        }

        animate()


        // Handle resize
        const handleResize = () => {
            if (!mountRef.current) return
            const width = mountRef.current.clientWidth
            const height = mountRef.current.clientHeight
            camera.aspect = width / height
            camera.updateProjectionMatrix()
            renderer.setSize(width, height)
            if (composer) {
                composer.setSize(width, height)
            }
        }
        window.addEventListener('resize', handleResize)

        // Store mount reference for cleanup
        const mountCurrent = mountRef.current

        return () => {
            // Cancel animation frame first
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            // Clean up event listeners
            window.removeEventListener('resize', handleResize)


            // Stop all animations
            if (animationActions) {
                Object.values(animationActions).forEach((action) => {
                    action.stop();
                    action.enabled = false;
                    action.reset();
                    action.paused = true;
                });
            }
            if (mixer) {
                mixer.stopAllAction();
            }

            // Clean up DOM
            if (mountCurrent) {
                mountCurrent.removeChild(renderer.domElement)
            }

            // Dispose composer and ThreeJS resources
            try {
                composer.dispose()
            } catch (error) {
                // ignore if composer not available or already disposed
                void error
            }
            renderer.dispose();
            scene.clear();
        }
    }, [animationActions, mixer, model])

    useGSAP(() => {
        if (!isLoading && mountRef.current) {
            gsap.from(mountRef.current,
                { opacity: 0, duration: 1 },
            )
        }
    }, [isLoading]);

    return <div ref={mountRef} className="relative w-screen h-screen" />
}
