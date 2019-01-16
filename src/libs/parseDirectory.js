const path = require('path');
const fs = require('fs');

const tempAlbum = [];
const readPath = (dirPath, fileName) => {
    const files = fs.readdirSync(dirPath);
    // console.log(files);
    const singleAlbum = {
        fileName: fileName || 'Untitled Album',
        thumb: '',
        fileArr: [],
    };

    files.forEach((file) => {
        const currentFilePath = path.join(dirPath, file);

        const stats = fs.statSync(currentFilePath);
        const isFile = stats.isFile(); //是文件
        const isDir = stats.isDirectory(); //是文件夹

        if(isFile) {
            const extname = path.extname(currentFilePath).toLowerCase();
            if (extname === '.jpg' || extname === '.jpeg' || extname === '.png') {
                singleAlbum.fileArr.push(currentFilePath);
            }
        }

        if(isDir) {
            readPath(currentFilePath, file); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }
    });

    singleAlbum.thumb = singleAlbum.fileArr[0] || '';

    tempAlbum.push(singleAlbum);
};

const getFileArr = (dirPath, fileName) => {
    return new Promise((resolve, reject) => {
        if (dirPath) {
            readPath(dirPath, fileName);
            resolve(tempAlbum);
        } else {
            reject(new Error('dirPath is required'));
        }
    });
};

export default getFileArr;
