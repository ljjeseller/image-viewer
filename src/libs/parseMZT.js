const cheerio = require('cheerio');
const request = require('request');
const path = require('path');
const fs = require('fs');
import download from './download';

const singleAlbum = {
    fileName: 'Untitled Album',
    thumb: '',
    fileArr: [],
};

const getAlbumPages = (url) => {
    return new Promise((resolve, reject) => {
        let tempArr = [];

        request(url, async (error, response, body) => {
            if (error) {
                reject(new Error(error));
            }

            const $ = cheerio.load(body);
            const title = $('.main-title').text();
            const lastPage = $('.pagenavi > a').eq(-2).find('span').text();
            const pageImage = $('.main-image').find('img').attr('src');

            singleAlbum.fileName = title;
            tempArr.push(pageImage);

            const promiseAll = [];
            for (let i = 2; i <= lastPage; i++) {
                const promiseSingle = await getOtherImages(`${url}/${i}`);
                promiseAll.push(promiseSingle);
            }

            try {
                await Promise.all(promiseAll);
                console.log('success');
                tempArr = tempArr.concat(promiseAll);
                resolve(tempArr);
            } catch (e) {
                console.log(e);
                reject(new Error(e));
            }
        });
    });
};


const getOtherImages = (url) => {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) {
                reject(new Error(error));
            }

            const $ = cheerio.load(body);
            const pageImage = $('.main-image').find('img').attr('src');
            resolve(pageImage)
        });
    });
};

// check dir exist
const checkDir = (imageRoot) => {
    return new Promise((resolve) => {
        const currentDir = path.join(imageRoot, singleAlbum.fileName);
        fs.stat(currentDir, (err) => {
            if (err) {
                fs.mkdirSync(currentDir);
            }
            resolve(currentDir);
        });
    });
};


const downloadFile = (urlArr, imageRoot) => {
    return new Promise( async (resolve, reject) => {
        const currentDir = await checkDir(imageRoot);
        console.log(currentDir);

        const promiseAll = [];
        urlArr.forEach((elem, index) => {
            const currentFilePath = path.join(currentDir, `img-${index}.jpg`);
            const promiseSingle = download(elem, currentFilePath, 'm');
            promiseAll.push(promiseSingle);
        });

        try {
            await Promise.all(promiseAll);
            resolve();
        } catch (e) {
            console.log(e);
            reject();
        }
    });
};


const parseMZT = (url, imageRoot) => {
    return new Promise(async (resolve, reject) => {
        try {
            const imgUrlArr = await getAlbumPages(url);
            await downloadFile(imgUrlArr, imageRoot);
            resolve();
        } catch (e) {
            console.log(e);
            reject();
        }
    });
};

export default parseMZT;