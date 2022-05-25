import * as THREE from 'three';
import Experience from './Experience.js';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.setInstance();
        this.setControls();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100);
        this.instance.position.set(0, 5, 14);
        this.scene.add(this.instance);
    }

    setControls() {
        this.controls = new MapControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
        this.controls.maxDistance = 10;
        this.controls.minDistance = 8;

        const minPan = new THREE.Vector3(-2, 0.4, -2);
        const maxPan = new THREE.Vector3(2, 2, 2);
        const _v = new THREE.Vector3();

        this.controls.addEventListener('change', (e) => {
            _v.copy(this.controls.target);
            this.controls.target.clamp(minPan, maxPan);
            _v.sub(this.controls.target);
            this.instance.position.sub(_v);
        });
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        // console.log(this.instance.position);
        // console.log(this.instance.rotation);

        this.controls.update();
    }
}
