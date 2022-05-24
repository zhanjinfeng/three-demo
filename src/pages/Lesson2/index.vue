<template>
    <div><canvas :tabindex="0" class="webgl"></canvas></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted, ref } from 'vue';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Mesh } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    /**
     * Objects
     */
    // Material
    // const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10));
    // plane.rotation.x = -Math.PI * 0.5;
    // plane.position.y = -0.65;
    // plane.receiveShadow = true;

    // scene.add(plane);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/static/draco/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const fbxLoader = new FBXLoader();

    const group = new THREE.Group();
    fbxLoader.load('/static/models/model.fbx', (object) => {
        // object.traverse(function (child) {
        //     if ((child as THREE.Mesh).isMesh) {
        //         // (child as THREE.Mesh).material = material
        //         if ((child as THREE.Mesh).material) {
        //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
        //         }
        //     }
        // })
        // object.scale.set(.01, .01, .01)

        console.log('obj', object);

        group.add(object);
    });

    // const bg = ['/static/models/model2.glb'];
    const bg = ['/static/models/playground/static/base.glb', '/static/models/playground/static/collision.glb'];
    bg.forEach((res) => {
        gltfLoader.load(res, (_data) => {
            _data.scene.position.set(-4, 0.5, 2);

            _data.scene.children.forEach((mesh) => {
                mesh.material = new THREE.MeshNormalMaterial();
            });

            group.add(_data.scene);
        });
    });

    group.rotation.x = -Math.PI * 0.5;

    scene.add(group);

    /**
     * Animate
     */
    const tick = () => {
        // Update objects

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

    camera.value.position.z = 20;
    camera.value.position.x = 2;
    camera.value.position.y = 15;

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
    renderer.value.setClearColor('#ccc');
    renderer.value.gammaOutPut = true;

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
