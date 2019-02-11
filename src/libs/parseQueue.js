const _ = require('lodash');
import download from './download';

export default class parseQueue {
    constructor(queue, chunk) {
        this.queue = queue || [];
        this.chunk = chunk || 8;

        this.chunked = [];
        this.length = 0;
        this.index = 0;

        this.init();
    }

    get currentIndex() {
        return this.index;
    }

    set currentIndex(value) {
        this.index = value;
        this.startQueue(this.chunked[this.currentIndex]);
    }

    init() {
        if (this.queue.length === 0) {
            throw new Error('queue can not be 0');
        } else {
            this.chunkArray();
        }
    }

    chunkArray() {
        this.chunked = _.chunk(this.queue, this.chunk);
        this.length = this.chunked.length;

        this.startQueue(this.chunked[this.currentIndex]);
    }

    startQueue(queue) {
        console.log(queue);

        const promiseAll = [];

        queue.forEach((elem, index) => {
            const promiseSingle = download(elem, `/Users/lorrow/Documents/node_www/image-viewer/code-${this.currentIndex}-${index}.jpg`);
            promiseAll.push(promiseSingle);
        });

        Promise.all(promiseAll).then(() => {
            if (this.currentIndex < this.length - 1) {
                this.currentIndex++;
            } else {
                console.log('Queue finished');
            }
        }).catch((e) => {
            throw new Error(e);
        });
    }
}
