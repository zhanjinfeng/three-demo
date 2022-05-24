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

    addObject();
};

const addObject = () => {
    // cube
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: '#883ae1' });
    // const mesh = new THREE.Mesh(geometry, material);

    // ball
    // const geometry = new THREE.SphereGeometry(1, 32, 32);
    // const material = new THREE.MeshBasicMaterial({ color: '#883ae1', wireframe: true });
    // mesh = new THREE.Mesh(geometry, material);

    // scene.add(mesh);

    const fontLoader = new FontLoader();

    fontLoader.load('../../../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        console.log('loaded');

        const textGeometry = new TextGeometry('Hello world!', {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.01,
            bevelOffset: 0,
            bevelSegments: 5,
        });

        const matcapTexture = new THREE.TextureLoader().load(img);
        // const textMaterial = new THREE.MeshBasicMaterial({ color: '#edbb6b', wireframe: false });
        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
        const material = new THREE.MeshMatcapMaterial({ matcap: new THREE.TextureLoader().load(img2) });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
        // const donutGeometry = new THREE.BoxGeometry(1, 1, 1);

        for (let i = 0; i < 200; i++) {
            const scale = Math.random();
            const donut = new THREE.Mesh(donutGeometry, material);

            donut.position.x = (Math.random() - 0.5) * 10;
            donut.position.y = (Math.random() - 0.5) * 10;
            donut.position.z = (Math.random() - 0.5) * 10;

            donut.rotation.x = Math.random() * Math.PI;
            donut.rotation.y = Math.random() * Math.PI;

            donut.scale.set(scale, scale, scale);

            scene.add(donut);
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        textGeometry.center();
        scene.add(text);
    });

    // Cursor
    // const cursor = {
    //     x: 0,
    //     y: 0,
    // };

    // window.addEventListener('mousemove', (event) =>
    // {
    //     cursor.x = event.clientX / sizes.width - 0.5
    //     cursor.y = event.clientY / sizes.height - 0.5
    // })
};

const camera = ref();
const setupCamera = () => {
    // Camera
    camera.value = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100);

    camera.value.position.z = 3;
    camera.value.position.x = 0;
    camera.value.position.y = 1;
    // camera.value.lookAt(mesh.value.position);

    scene.add(camera.value);

    // render();
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

    render();
};

onMounted(() => {
    setupScene();
    setupCamera();
    renderObject();
    initEventListener();
});

const render = () => {
    /**
     * Animate
     */
    const tick = () => {
        // Update objects
        // mesh.rotation.x += 0.01
        // mesh.rotation.z += 0.01
        // mesh.rotation.y += 0.01;

        // Update camera
        // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
        // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
        // camera.position.y = cursor.y * 5
        // camera.lookAt(mesh.position)

        // Render
        renderer.value.render(scene, camera.value);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
    };

    tick();
};
</script>
