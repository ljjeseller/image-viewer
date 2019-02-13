const request = require('request');
const fs = require('fs');
import Vue from 'vue'

// Promise download
const download = (url, filePath, referer) => {
    return new Promise((resolve, reject) => {
        const req = request({
            method: 'GET',
            uri: url,
            headers: {
                referer: referer === 'm' ? 'http://www.mzitu.com/' : '', // m = mzitu
            }
        });

        req.pipe(fs.createWriteStream(filePath));

        req.on('response', () => {
            Vue.toasted.show(`Starting download: ${filePath}`);
        });

        req.on('end', () => {
            Vue.toasted.success(`Finish download: ${filePath}`);
            resolve();
        });

        req.on('error', () => {
            Vue.toasted.error(`Error: ${filePath}`);
            reject();
        });
    });
};

export default download;
