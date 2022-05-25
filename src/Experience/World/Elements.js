import * as THREE from 'three';
import Experience from '../Experience';

export default class Elements {
    constructor(_elements) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.sizes = this.experience.sizes;
        this.raycaster = new THREE.Raycaster();
        this.resources = this.experience.resources;

        this.resources.on('ready', () => {
            this.instance = _elements.map((item) => {
                const { x, y, z } = item.position;

                return {
                    position: new THREE.Vector3(x, y, z),
                    element: document.querySelector(`.btn-${item.id}`),
                };
            });
        });
    }

    update() {
        if (!this.instance || !this.scene) {
            return;
        }

        for (const point of this.instance) {
            const screenPosition = point.position.clone();
            screenPosition.project(this.camera.instance);

            // Set the raycaster
            this.raycaster.setFromCamera(screenPosition, this.camera.instance);
            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            // No intersect found
            if (intersects.length === 0) {
                // Show
                point.element.classList.add('visible');
            }

            // Intersect found
            else {
                // Get the distance of the intersection and the distance of the point
                const intersectionDistance = intersects[0].distance;
                const pointDistance = point.position.distanceTo(this.camera.instance.position);

                // Intersection is close than the point
                if (intersectionDistance < pointDistance) {
                    // Hide
                    point.element.classList.remove('visible');
                }
                // Intersection is further than the point
                else {
                    // Show
                    point.element.classList.add('visible');
                }
            }

            const translateX = screenPosition.x * this.sizes.width * 0.5;
            const translateY = -screenPosition.y * this.sizes.height * 0.5;
            point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
        }
    }
}
