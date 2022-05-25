import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Casa {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.sizes = this.experience.sizes;
        this.camera = this.experience.camera;
        this.renderer = this.experience.renderer.instance;
        this.raycaster = new THREE.Raycaster();
        this.events = this.experience.events;

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('scene');
        }

        // Resource
        this.resource = this.resources.items.casaModel;

        this.setModel();
        this.setAnimation();

        this.events.on('pointermove', () => {
            this.pointerMove();
        });

        this.events.on('click', () => {
            this.click();
        });
    }

    setModel() {
        this.model = this.resource.scene;
        this.model.scale.set(0.005, 0.005, 0.005);
        this.model.position.y = 0.15;
        this.scene.add(this.model);

        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
            }
        });
    }

    setAnimation() {
        this.animation = {};

        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model);

        // Actions
        this.animation.actions = {};

        // this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0]);
        // this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1]);
        // this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2]);

        // this.animation.actions.current = this.animation.actions.idle;
        // this.animation.actions.current.play();

        // // // Play the action
        // this.animation.play = (name) => {
        //     const newAction = this.animation.actions[name];
        //     const oldAction = this.animation.actions.current;

        //     newAction.reset();
        //     newAction.play();
        //     newAction.crossFadeFrom(oldAction, 1);

        //     this.animation.actions.current = newAction;
        // };

        // Debug
        if (this.debug.active) {
            const debugObject = {
                playIdle: () => {
                    this.animation.play('idle');
                },
                playWalking: () => {
                    this.animation.play('walking');
                },
                playRunning: () => {
                    this.animation.play('running');
                },
            };
            this.debugFolder.add(debugObject, 'playIdle');
            this.debugFolder.add(debugObject, 'playWalking');
            this.debugFolder.add(debugObject, 'playRunning');
        }
    }

    update() {
        this.animation.mixer.update(this.time.delta * 0.001);
    }

    pointerMove() {
        this.raycaster.setFromCamera(this.events.pointer, this.camera.instance);

        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.model.children);

        // intersects[0].object.material.color.set('tomato');

        // for (let i = 0; i < intersects.length; i++) {
        //     if (!intersects[i].object.material.userData.oldColor) {
        //         intersects[i].object.material.userData.oldColor = intersects[i].object.material.color.getHex();
        //     }

        //     if (target.includes(intersects[i].object.id)) {
        //         intersects[i].object.material.color.set('tomato');
        //     } else {
        //         intersects[i].object.material.color.set(intersects[i].object.material.userData.oldColor);
        //     }
        // }
        this.renderer.render(this.scene, this.camera.instance);
    }

    click() {
        this.raycaster.setFromCamera(this.events.pointer, this.camera.instance);

        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.model.children);

        for (let i = 0; i < intersects.length; i++) {
            const target = [19, 18, 20, 23, 28];

            if (target.includes(intersects[i].object.id)) {
                this.experience.eventEmit({ type: 'click', action: 'open_trickle' });
                return;
            }
        }
    }
}
