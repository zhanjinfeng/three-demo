<template>
    <div>
        <canvas :tabindex="0" class="webgl"></canvas>

        <div v-if="show" class="fixed w-full h-full z-50 top-0 left-0 flex items-center justify-center flex-col">
            <div class="bg-white p-5 rounded-lg w-2/3 h-3/4 relative overflow-hidden">
                <div class="font-medium text-xl pb-2">Trickle</div>
                <div class="h-full absolute top-0 w-full pt-14 box-border left-0">
                    <iframe
                        class="w-full h-full"
                        src="http://localhost:3000/workspace/71328804525572099/trickle/121303497793601544?t=612"
                        frameborder="0"
                    ></iframe>
                </div>

                <div
                    class="absolute top-4 right-4 cursor-pointer rounded py-1 px-2 hover:bg-gray-200"
                    @click="show = false"
                >
                    Close
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { onMounted, ref } from 'vue';
import CANNON from 'cannon';
import GUI from 'lil-gui';
import pxImg from '@/assets/textures/environmentMaps/0/px.png';
import nxImg from '@/assets/textures/environmentMaps/0/nx.png';
import pyImg from '@/assets/textures/environmentMaps/0/py.png';
import nyImg from '@/assets/textures/environmentMaps/0/ny.png';
import pzImg from '@/assets/textures/environmentMaps/0/pz.png';
import nzImg from '@/assets/textures/environmentMaps/0/nz.png';
import logoImg from '@/assets/logo.png';

// Car cyber truck
// eslint-disable-next-line @typescript-eslint/no-var-requires
// import carCyberTruckChassisSource from '/public/static/models/cyberTruck/chassis.glb?raw';
// import carCyberTruckWheelSource from '@/models/car/cyberTruck/wheel.glb';
// import carCyberTruckBackLightsBrakeSource from '@/models/car/cyberTruck/backLightsBrake.glb';
// import carCyberTruckBackLightsReverseSource from '@/models/car/cyberTruck/backLightsReverse.glb';
// import carCyberTruckAntenaSource from '@/models/car/cyberTruck/antena.glb';

const gui = new GUI();
const debugObject: any = {};

const show = ref(false);

onMounted(() => {
    debugObject.createSphere = () => {
        createSphere(Math.random() * 0.5, {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3,
        });
    };

    gui.add(debugObject, 'createSphere');

    debugObject.createBox = () => {
        createBox(Math.random(), Math.random(), Math.random(), {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3,
        });
    };
    gui.add(debugObject, 'createBox');

    // Reset
    debugObject.reset = () => {
        for (const object of objectsToUpdate) {
            // Remove body
            object.body.removeEventListener('collide', playHitSound);
            (world as any).removeBody(object.body);

            // Remove mesh
            scene.remove(object.mesh);
        }

        objectsToUpdate.splice(0, objectsToUpdate.length);
    };
    gui.add(debugObject, 'reset');

    /**
     * Base
     */
    // Canvas
    const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

    // Scene
    const scene = new THREE.Scene();

    /**
     * Sounds
     */
    const playHitSound = (collision) => {
        console.log('hit', collision);
    };

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    const environmentMapTexture = cubeTextureLoader.load([pxImg, nxImg, pyImg, nyImg, pzImg, nzImg]);

    /**
     * Physics
     */
    const world = new CANNON.World();
    world.broadphase = new CANNON.SAPBroadphase(world);
    // world.allowSleep = true;
    world.gravity.set(0, -9.82, 0);

    // Default material
    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
        friction: 0.1,
        restitution: 0.7,
    });
    world.defaultContactMaterial = defaultContactMaterial;

    // Floor
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    floorBody.mass = 0;
    floorBody.addShape(floorShape);
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
    world.addBody(floorBody);

    /**
     * Utils
     */
    const objectsToUpdate: any = [];

    // Create sphere
    const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5,
    });

    const createSphere = (radius, position) => {
        // Three.js mesh
        const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        mesh.castShadow = true;
        mesh.scale.set(radius, radius, radius);
        mesh.position.copy(position);
        scene.add(mesh);

        // Cannon.js body
        const shape = new CANNON.Sphere(radius);

        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(0, 3, 0),
            shape: shape,
            material: defaultMaterial,
        });
        body.position.copy(position);
        body.addEventListener('collide', playHitSound);
        world.addBody(body);

        // Save in objects
        objectsToUpdate.push({ mesh, body });
    };

    // Create box
    const logoTexture = textureLoader.load(logoImg);
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5,
        map: logoTexture,
    });
    const createBox = (width, height, depth, position) => {
        // Three.js mesh
        const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
        mesh.scale.set(width, height, depth);
        mesh.castShadow = true;
        mesh.position.copy(position);
        scene.add(mesh);

        // Cannon.js body
        const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5));

        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(1, 3, 0),
            shape: shape,
            material: defaultMaterial,
        });
        body.position.copy(position);
        body.addEventListener('collide', playHitSound);
        world.addBody(body);

        // Save in objects
        objectsToUpdate.push({ mesh, body });
    };

    createBox(1, 1, 1, { x: 0, y: 3, z: 0 });

    /**
     * Floor
     */
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({
            color: '#777777',
            metalness: 0.3,
            roughness: 0.4,
            envMap: environmentMapTexture,
            envMapIntensity: 0.5,
        })
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;
    scene.add(floor);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    // directionalLight.castShadow = true;
    // directionalLight.shadow.mapSize.set(1024, 1024);
    // directionalLight.shadow.camera.far = 15;
    // directionalLight.shadow.camera.left = -7;
    // directionalLight.shadow.camera.top = 7;
    // directionalLight.shadow.camera.right = 7;
    // directionalLight.shadow.camera.bottom = -7;
    // directionalLight.position.set(5, 5, 5);
    // scene.add(directionalLight);

    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(-3, 3, 3);
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Car
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/static/draco/');
    dracoLoader.setDecoderConfig({ type: 'js' });

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const car = new THREE.Group();
    const cars = ['/static/models/playground/static/base.glb', '/static/models/playground/static/collision.glb'];

    cars.forEach((res) => {
        gltfLoader.load(res, (_data) => {
            _data.scene.position.set(-4, 0.5, 2);
            car.add(_data.scene);
        });
    });

    car.rotation.z = -1;
    car.rotation.x = -Math.PI * 0.5;
    car.rotation.y = 3;

    scene.add(car);

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    let oldElapsedTime = 0;

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - oldElapsedTime;
        oldElapsedTime = elapsedTime;

        // Update physics
        world.step(1 / 60, deltaTime, 3);

        for (const object of objectsToUpdate) {
            object.mesh.position.copy(object.body.position);
            object.mesh.quaternion.copy(object.body.quaternion);
        }

        // Update controls
        controls.update();

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
    };

    tick();˜

    window.addEventListener('keydown', (e) => {
        if (show.value) {
            return;
        }

        // W
        // if (e.keyCode === 87) {
        //     body.position.x += 0.1;
        // }
        // // S
        // if (e.keyCode === 83) {
        //     body.position.x -= 0.1;
        // }
        // // D
        // if (e.keyCode === 68) {
        //     body.position.z += 0.1;
        // }
        // // a
        // if (e.keyCode === 65) {
        //     body.position.z -= 0.1;
        // }
    });
});
</script>
