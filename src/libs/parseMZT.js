const cheerio = require('cheerio');
const request = require('request');
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

            // console.log(title);
            // console.log(lastPage);
            // console.log(pageImage);

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
                console.log('failed');
                reject(new Error(e));
            }

        });
    });

};

const downloadFile = (url) => {
    return new Promise(async (resolve, reject) => {
        const tempArr = await getAlbumPages(url);

        const promiseAll = [];

        tempArr.forEach((elem, index) => {
            const promiseSingle = download(elem, `/Users/lorrow/Documents/node_www/image-viewer/img-${index}.jpg`, 'm');
            promiseAll.push(promiseSingle);
        });

        try {
            const fileArr = await Promise.all(promiseAll);
            console.log(fileArr);
        } catch (e) {
            reject(new Error(e));
        }


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



const parseMZT = (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            //await downloadFile(url);






            resolve(singleAlbum);
        } catch (e) {
            reject(new Error(e));
        }

    });
};

export default parseMZT;