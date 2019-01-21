const { dialog } = require('electron').remote;

const changeImageRoot = (defaultPath = '') => {
    return new Promise((resolve) => {
        dialog.showOpenDialog({
            title: 'Choose Image Root',
            defaultPath,
            properties: ['openDirectory'],
        }, (directory) => {
            resolve(directory);
        });
    });
};

export default changeImageRoot;
