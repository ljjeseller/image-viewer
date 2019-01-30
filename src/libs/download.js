const request = require('request');
const fs = require('fs');

// download
const download = (url, filePath) => {
    return new Promise((resolve, reject) => {
        const req = request({
            method: 'GET',
            uri: url
        });

        req.pipe(fs.createWriteStream(filePath));

        req.on('response', () => {
           console.log(`Starting download: ${filePath}`);
        });

        req.on('end', () => {
            console.log(`Finish download: ${filePath}`);
            resolve();
        });

        req.on('error', () => {
            console.log('error');
            reject();
        });
    });
};

export default download;
