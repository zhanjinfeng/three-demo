import EventEmitter from './EventEmitter.js';

export default class Events extends EventEmitter {
    constructor() {
        super();

        // Setup
        this.pointer = {
            x: 0,
            y: 0,
        };

        // pointermove event
        window.addEventListener('pointermove', (event) => {
            this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.trigger('pointermove');
        });

        // pointermove event
        window.addEventListener('click', () => {
            this.trigger('click');
        });
    }
}
