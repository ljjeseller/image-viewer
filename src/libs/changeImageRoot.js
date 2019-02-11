const { dialog } = require('electron').remote;
const { BrowserWindow } = require('electron').remote;

const changeImageRoot = (defaultPath = '') => {
    return new Promise((resolve) => {
        const currentWindow = BrowserWindow.getFocusedWindow();
        dialog.showOpenDialog(currentWindow, {
            title: 'Choose Image Root',
            defaultPath,
            properties: ['openDirectory'],
        }, (directory) => {
            resolve(directory);
        });
    });
};

export default changeImageRoot;
