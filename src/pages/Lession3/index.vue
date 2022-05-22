<template>
    <div><canvas :tabindex="0" class="webgl"></canvas></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from '../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { onMounted, ref } from 'vue';
import { FontLoader } from '../../../node_modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../../../node_modules/three/examples/jsm/geometries/TextGeometry.js';
import ColorImg from '@/assets/textures/door/color.jpg';
import AlphaImg from '@/assets/textures/door/alpha.jpg';
import OcclusImg from '@/assets/textures/door/ambientOcclusion.jpg';
import HeightImg from '@/assets/textures/door/height.jpg';
import NormalImg from '@/assets/textures/door/normal.jpg';
import MetalImg from '@/assets/textures/door/metalness.jpg';
import roughImg from '@/assets/textures/door/roughness.jpg';
import BrickColor from '@/assets/textures/bricks/color.jpg';
import BricksAmb from '@/assets/textures/bricks/ambientOcclusion.jpg';
import BricksNormal from '@/assets/textures/bricks/normal.jpg';
import BricksRough from '@/assets/textures/bricks/roughness.jpg';
import grassImg from '@/assets/textures/grass/color.jpg';

const textureLoader = new THREE.TextureLoader();

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
    const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
    scene.add(moonLight);

    /**
     * Fog
     */
    const fog = new THREE.Fog('#262837', 1, 15);
    scene.fog = fog;

    /**
     * Objects
     */
    // const plane = new THREE.Mesh(
    //     new THREE.PlaneGeometry(20, 20, 100, 100),
    //     new THREE.MeshStandardMaterial({ color: '#7abf86' })
    // );
    // plane.rotation.x = -Math.PI * 0.5;
    // scene.add(plane);

    const grassColorTexture = textureLoader.load(grassImg);
    grassColorTexture.repeat.set(8, 8);
    grassColorTexture.wrapS = THREE.RepeatWrapping;
    grassColorTexture.wrapT = THREE.RepeatWrapping;
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({
            map: grassColorTexture,
            // aoMap: grassAmbientOcclusionTexture,
            // normalMap: grassNormalTexture,
            // roughnessMap: grassRoughnessTexture,
        })
    );
    floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2));
    floor.rotation.x = -Math.PI * 0.5;

    scene.add(floor);

    // House
    const house = new THREE.Group();
    scene.add(house);

    // Door light
    const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
    doorLight.position.set(0, 0.9, 1);
    house.add(doorLight);

    // Walls
    const bricksColorTexture = textureLoader.load(BrickColor);
    const bricksAmbientOcclusionTexture = textureLoader.load(BricksAmb);
    const bricksNormalTexture = textureLoader.load(BricksNormal);
    const bricksRoughnessTexture = textureLoader.load(BricksRough);
    const walls = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 1, 1.5),
        new THREE.MeshStandardMaterial({
            map: bricksColorTexture,
            aoMap: bricksAmbientOcclusionTexture,
            normalMap: bricksNormalTexture,
            roughnessMap: bricksRoughnessTexture,
        })
    );
    walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2));
    walls.position.y = 0.5;

    house.add(walls);

    // Roof
    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(1.3, 0.5, 4),
        new THREE.MeshStandardMaterial({ color: '#b35f45' })
    );
    roof.rotation.y = Math.PI * 0.25;
    roof.position.y = 1 + 0.25;
    house.add(roof);

    // Door
    const doorColorTexture = textureLoader.load(ColorImg);
    const doorAlphaTexture = textureLoader.load(AlphaImg);
    const doorAmbientOcclusionTexture = textureLoader.load(OcclusImg);
    const doorHeightTexture = textureLoader.load(HeightImg);
    const doorNormalTexture = textureLoader.load(NormalImg);
    const doorMetalnessTexture = textureLoader.load(MetalImg);
    const doorRoughnessTexture = textureLoader.load(roughImg);

    const door = new THREE.Mesh(
        new THREE.PlaneGeometry(0.8, 0.8, 100, 100),
        new THREE.MeshStandardMaterial({
            map: doorColorTexture,
            transparent: true,
            alphaMap: doorAlphaTexture,
            aoMap: doorAmbientOcclusionTexture,
            displacementMap: doorHeightTexture,
            displacementScale: 0.1,
            normalMap: doorNormalTexture,
            metalnessMap: doorMetalnessTexture,
            roughnessMap: doorRoughnessTexture,
        })
    );
    door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2));

    door.position.y = 0.4;
    door.position.z = 0.75 + 0.01;
    house.add(door);

    // Bushes
    const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
    const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush1.scale.set(0.15, 0.15, 0.15);
    bush1.position.set(0.6, 0.1, 0.75);

    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush2.scale.set(0.2, 0.2, 0.2);
    bush2.position.set(0.3, 0.1, 0.75);

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush3.scale.set(0.2, 0.2, 0.2);
    bush3.position.set(-0.4, 0.1, 0.75);

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush4.scale.set(0.15, 0.15, 0.15);
    bush4.position.set(-0.6, 0.05, 0.75);

    house.add(bush1, bush2, bush3, bush4);

    // Graves
    const graves = new THREE.Group();
    scene.add(graves);

    const graveGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.1);
    const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

    for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2; // Random angle
        const radius = 1 + Math.random() * 2; // Random radius
        const x = Math.cos(angle) * radius; // Get the x position using cosinus
        const z = Math.sin(angle) * radius; // Get the z position using sinus

        // Create the mesh
        const grave = new THREE.Mesh(graveGeometry, graveMaterial);

        // Position
        grave.position.set(x, 0.1, z);

        // Rotation
        grave.rotation.z = (Math.random() - 0.5) * 0.4;
        grave.rotation.y = (Math.random() - 0.5) * 0.4;

        // Add to the graves container
        graves.add(grave);
    }

    /**
     * Ghosts
     */
    const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
    ghost1.position.set(3, 1, 2);
    scene.add(ghost1);

    const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
    ghost2.position.set(2, 1, 1);
    scene.add(ghost2);

    const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
    ghost3.position.set(-3, 1, 1);
    scene.add(ghost3);

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    const tick = () => {
        // Update objects
        // mesh.rotation.x += 0.01
        // mesh.rotation.z += 0.01
        // mesh.rotation.y += 0.01;
        const elapsedTime = clock.getElapsedTime();

        // Ghosts
        const ghost1Angle = elapsedTime * 0.5;
        ghost1.position.x = Math.cos(ghost1Angle) * 2;
        ghost1.position.z = Math.sin(ghost1Angle) * 2;
        ghost1.position.y = Math.sin(elapsedTime * 1);

        const ghost2Angle = -elapsedTime * 0.32;
        ghost2.position.x = Math.cos(ghost2Angle) * 2;
        ghost2.position.z = Math.sin(ghost2Angle) * 2;
        ghost2.position.y = Math.sin(elapsedTime * 1) + Math.sin(elapsedTime * 2.5);

        const ghost3Angle = -elapsedTime * 0.18;
        ghost3.position.x = Math.cos(ghost3Angle) * (3 + Math.sin(elapsedTime * 0.32));
        ghost3.position.z = Math.sin(ghost3Angle) * (3 + Math.sin(elapsedTime * 0.5));
        ghost3.position.y = Math.sin(elapsedTime * 1) + Math.sin(elapsedTime * 2.5);

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

    camera.value.position.z = 3;
    camera.value.position.x = 2;
    camera.value.position.y = 2;

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
    renderer.value.setClearColor('#262837');

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
