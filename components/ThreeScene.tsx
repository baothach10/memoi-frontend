'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useThreeModel } from '@/context/ThreeModelContext'

export default function ThreeScene() {
    const mountRef = useRef<HTMLDivElement>(null)
    const { model, animationActions, mixer, isLoading } = useThreeModel();

    useEffect(() => {
        if (!mountRef.current || !model) return

        const scene = new THREE.Scene()
        // Use a white background for the scene (opaque)
        scene.background = new THREE.Color(0xffffff)
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

        camera.position.set(0, 0, 5);

        controls.target.copy(model.position);

        // Add model from context
        if (model) {
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

        const sunLight = new THREE.DirectionalLight(0xffffff, 5);
        sunLight.position.set(4, 4, 4);
        sunLight.lookAt(model.position);
        scene.add(sunLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);


        // renderer.toneMappingExposure = 3.0;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMappingExposure = 1.5;

        // Post-processing: EffectComposer + UnrealBloomPass to make the model look shiny/metallic
        const composer = new EffectComposer(renderer)
        const renderPass = new RenderPass(scene, camera)
        composer.addPass(renderPass)

        // Bloom parameters: tune strength/radius/threshold for a metallic sheen
        const bloomStrength = 0.3
        const bloomRadius = 0.1
        const bloomThreshold = 0.4
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(mountRef.current.clientWidth, mountRef.current.clientHeight), bloomStrength, bloomRadius, bloomThreshold)
        composer.addPass(bloomPass)


        const clock = new THREE.Clock();

        // Auto-rotate settings (radians per second)
        const rotateSpeed = 0.1


        // Animation loop
        let animationFrameId: number;
        const animate = () => {

            const delta = clock.getDelta();
            if (mixer) {
                mixer.update(delta);
            }

            // Auto-rotate the model around its Y axis to give it a slow metallic spin
            if (model) {
                model.rotation.y += delta * rotateSpeed
            }

            controls.update(delta)
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
