const request = require('request');
const fs = require('fs');
const path = require('path');


// download
const download = (url, filePath) => {
    return new Promise((resolve, reject) => {
        // const imagePath = path.resolve('/Users/lorrow/Documents/node_www/image-viewer', 'code.jpg');

        const req = request({
            method: 'GET',
            uri: url
        });

        req.pipe(fs.createWriteStream(filePath));

        req.on('response', () => {
           console.log('response');
        });

        req.on('end', () => {
            console.log('end');
            resolve();
        });

        req.on('error', () => {
            console.log('error');
            reject();
        });
    });
};

export default download;
