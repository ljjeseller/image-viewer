const request = require('request');
const fs = require('fs');

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
