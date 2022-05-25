import * as THREE from 'three';
import Experience from '../Experience.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';

export default class Test {
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
        this.selectedObject = null;

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('scene');
        }

        // Resource
        this.resource = this.resources.items.testModel;

        this.setModel();
        this.setAnimation();

        this.events.on('pointermove', () => {
            this.pointerMove();
        });

        this.events.on('click', () => {
            this.click();
        });

        this.events.on('pointerout', () => {
            this.pointerout();
        });
    }

    setModel() {
        this.model = this.resource.scene;
        this.model.scale.set(0.5, 0.5, 0.5);
        // this.model.position.y = 0.15;
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
        // this.animation.mixer.update(this.time.delta * 0.001);
        TWEEN.update();
    }

    pointerMove() {
        this.raycaster.setFromCamera(this.events.pointer, this.camera.instance);

        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.model.children);

        if (intersects.length == 0) {
            if (this.selectedObject) {
                this.selectedObject.material.color.set(this.selectedObject.material.userData.oldColor);
                this.selectedObject.position.y = 0;

                this.selectedObject = null;
            }

            return;
        }

        // console.log(intersects);
        for (let i = 0; i < intersects.length; i++) {
            const targets = [583, 584];

            if (!targets.includes(intersects[i].object.id)) {
                break;
            }

            // if (!intersects[i].object.material.userData.oldColor) {
            //     intersects[i].object.material.userData.oldColor = intersects[i].object.material.color.getHex();
            // }

            // intersects[i].object.material.color.set('#ccc');

            if (this.selectedObject) {
                return;
            }

            new TWEEN.Tween(intersects[i].object.position).to({ y: 0.4 }, 500).easing(TWEEN.Easing.Cubic.Out).start();

            this.selectedObject = intersects[i].object;
        }

        this.renderer.render(this.scene, this.camera.instance);
    }

    click() {
        this.raycaster.setFromCamera(this.events.pointer, this.camera.instance);

        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.model.children);

        console.log(this.model);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.id === 583) {
                const n = new THREE.Vector3();
                console.log(n);
                const { x, y, z } = intersects[i].object.getWorldPosition(n);

                // const x1 = x + this.model.position.x;
                // const y1 = y + this.model.position.y;
                // const z1 = z + this.model.position.z;
                // this.experience.eventEmit({ type: 'click', action: 'open_trickle' });

                // this.camera.instance.position.set(x, y, z);
                new TWEEN.Tween(this.camera.instance)
                    .to(
                        {
                            x,
                            y,
                            z,
                        },
                        500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();
                return;
            }
        }
    }
}
