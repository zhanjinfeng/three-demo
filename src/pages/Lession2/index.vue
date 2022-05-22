<template>
    <div><canvas :tabindex="0" class="webgl"></canvas></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from '../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { onMounted, ref } from 'vue';
import { FontLoader } from '../../../node_modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../../../node_modules/three/examples/jsm/geometries/TextGeometry.js';
import img from '@/assets/t1.png';
import img2 from '@/assets/t3.png';

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

let scene = {} as THREE.Scene;
const renderer = ref();
const setupScene = () => {
    // Scene
    scene = new THREE.Scene();
};

const addObject = () => {
    const ambientLight = new THREE.AmbientLight();
    ambientLight.color = new THREE.Color(0xffffff);
    ambientLight.intensity = 0.5;
    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
    directionalLight.position.set(-0.5, 0.25, 0.5);
    // directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Hemisphere light
    const hemisphereLight = new THREE.HemisphereLight(0x800080, 0x0000ff, 0.3);
    scene.add(hemisphereLight);

    /**
     * Objects
     */
    // Material
    const material = new THREE.MeshStandardMaterial();
    material.roughness = 0.4;

    // Objects
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
    sphere.position.x = -1.5;
    sphere.castShadow = true;

    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);
    cube.castShadow = true;

    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material);
    torus.position.x = 1.5;
    torus.castShadow = true;

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material);
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.65;
    plane.receiveShadow = true;

    scene.add(sphere, cube, torus, plane);

    /**
     * Animate
     */
    const tick = () => {
        // Update objects
        cube.rotation.z += 0.01;
        cube.rotation.y += 0.01;
        torus.rotation.y += 0.01;

        // Render
        renderer.value.render(scene, camera.value);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
    };

    tick();
};

const camera = ref();
const setupCamera = () => {
    // Camera
    camera.value = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100);

    camera.value.position.z = 3.5;
    camera.value.position.x = 1;
    camera.value.position.y = 0.8;

    scene.add(camera.value);
};

const initEventListener = () => {
    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        // Update camera
        camera.value.aspect = sizes.width / sizes.height;

        // Update renderer
        renderer.value.setSize(sizes.width, sizes.height);
        renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
};

const renderObject = () => {
    // Canvas
    const canvas = document.querySelector('.webgl') as HTMLCanvasElement;

    // Controls
    new OrbitControls(camera.value, canvas);

    // Renderer
    renderer.value = new THREE.WebGLRenderer({
        canvas: canvas,
    });

    renderer.value.setSize(sizes.width, sizes.height);
    renderer.value.setClearColor('#333');

    renderer.value.render(scene, camera.value);
    renderer.value.shadowMap.enabled = true;

    addObject();
};

onMounted(() => {
    setupScene();
    setupCamera();
    renderObject();
    initEventListener();
});
</script>
