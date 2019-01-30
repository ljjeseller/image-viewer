const request = require('request');
const fs = require('fs');

export default class downloadSequence {
    constructor(url, filePath) {
        this.url = url;
        this.filePath = filePath;
        this.req = null;
        this.retry = 0;

        this.init();
    }

    get retryCount() {
        return this.retry;
    }

    set retryCount(value) {
        this.retry = value;
        this.startDownload();
    }

    init() {
        this.startDownload();
    }

    startDownload() {
        this.req = request({
            method: 'GET',
            uri: this.url
        });

        this.req.pipe(fs.createWriteStream(this.filePath));

        this.req.on('response', () => {
            console.log(`Starting download: ${this.filePath}`);
        });

        this.req.on('end', () => {
            console.log(`Finish download: ${this.filePath}`);
        });

        this.req.on('error', () => {
            console.log('error');

            if (this.retryCount < 2) {
                this.retryCount ++;
            } else {
                console.log('error 3 times');
            }
        });
    }
}
