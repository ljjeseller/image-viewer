import Vue from 'vue';
const Aria2 = require("aria2");
const aria2 = new Aria2();

// bind event
aria2.on("open", () => {
    console.log('open');
});

aria2.on("close", () => {
    console.log('close');
});

aria2.on("onDownloadStart", (event) => {
    console.log('onDownloadStart');
    console.log(event);
});

aria2.on("onDownloadPause", (event) => {
    console.log('onDownloadPause');
    console.log(event);
});

aria2.on("onDownloadStop", (event) => {
    console.log('onDownloadStop');
    console.log(event);
});

aria2.on("onDownloadComplete", (event) => {
    console.log('onDownloadComplete');
    console.log(event);
});

aria2.on("onDownloadError", (event) => {
    console.log('onDownloadError');
    console.log(event);
});

aria2.on("onBtDownloadComplete", (event) => {
    console.log('onBtDownloadComplete');
    console.log(event);
});

aria2.open();

Vue.prototype.$aria2 = aria2;

// aria2.open().then(() => {
//
//
//     aria2.on("onDownloadStart", ([guid]) => {
//         console.log("aria2 onDownloadStart", guid);
//     });
//
//     Vue.prototype.$aria2 = aria2;
//     console.log("open");
//
//
// }).catch((err) => {
//     console.log("error", err)
// });
