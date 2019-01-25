<template>
    <div>
        <v-toolbar app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>Image Viewer</v-toolbar-title>
        </v-toolbar>

        <v-content>
            <v-container grid-list-lg fluid>
                <v-layout row wrap>
                    <v-flex v-for="(album, index) in tempAlbum" :key="index" xs2>
                        <v-card hover @click="showAlbum(index)">
                            <v-img
                                    :src="getImageUrl(album.thumb)"
                                    aspect-ratio="2"
                                    height="250px">
                                <v-layout
                                        slot="placeholder"
                                        fill-height
                                        align-center
                                        justify-center
                                        ma-0
                                >
                                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                </v-layout>
                            </v-img>

                            <v-card-title>{{album.fileName}}</v-card-title>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>

        <v-navigation-drawer
                v-model="drawer"
                absolute
                temporary
        >
            <v-list class="pa-1">
                <v-list-tile avatar>
                    <v-list-tile-avatar>
                        <img src="https://randomuser.me/api/portraits/men/85.jpg">
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title>Image Viewer </v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action>v{{version}}</v-list-tile-action>
                </v-list-tile>
            </v-list>

            <v-list class="pt-0" dense>
                <v-divider></v-divider>

                <v-list-tile @click="openDialog(imageRoot)">
                    <v-list-tile-action>
                        <v-icon>folder_open</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Change Image Root</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click="readPath(imageRoot)">
                    <v-list-tile-action>
                        <v-icon>refresh</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Refresh Current Directory</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Change Image Root</span>
                </v-card-title>

                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field
                                        v-model="imageRoot"
                                        label="Image Root"
                                        required
                                ></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="dialog = false">Close</v-btn>
                    <v-btn flat @click="dialog = false">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="color" :timeout="timeout" :top="true">
            {{ text }}
            <v-btn dark flat @click="snackbar = false">Close</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import 'lightgallery.js/dist/css/lightgallery.css';
    import "lightgallery.js";
    import 'lg-thumbnail.js';
    import getFileArr from '../libs/parseDirectory';
    import changeImageRoot from '../libs/changeImageRoot';
    import downloadSingle from '../libs/download';
    import { version } from '../../package.json';

    export default {
        name: 'Home',
        components: {},
        data() {
            return {
                version,

                drawer: null,

                tempAlbum: [],

                dialog: false,
                imageRoot: '',

                snackbar: false,
                color: '',
                timeout: 0,
                text: ''
            }
        },
        mounted() {
            this.checkDefaultPath();


            const arr = [
                'https://unsplash.com/photos/AaEQmoufHLk/download?force=true',
                'https://unsplash.com/photos/AaEQmoufHLk/download?force=true',
                'https://unsplash.com/photos/AaEQmoufHLk/download?force=true',
            ];

            //this.downloadSequence(arr);

        },
        methods: {
            checkDefaultPath() {
                const imageRoot = localStorage.IM_IMAGE_ROOT;
                if (imageRoot) {
                    this.imageRoot = imageRoot;
                    this.readPath(this.imageRoot);
                } else {
                    this.showSnackBar('Choose Image Root', 'error', 0);
                }
            },
            showAlbum(index) {
                const currentGallery = [];
                this.tempAlbum[index].fileArr.forEach((album) => {
                    currentGallery.push({
                        src: this.getImageUrl(album),
                        thumb: this.getImageUrl(album),
                    });
                });
                // console.log(currentGallery);

                const div = document.createElement('div');
                div.setAttribute('id', 'dynamic');
                document.body.appendChild(div);
                const lg = document.getElementById('dynamic');

                window.lightGallery(lg, {
                    dynamic: true,
                    thumbnail: true,
                    download: false,
                    loop: false,
                    closable: false,
                    dynamicEl: currentGallery,
                });

                lg.addEventListener('onCloseAfter', () => {
                    lg.parentNode.removeChild(lg);
                }, false);
            },
            getImageUrl(img) {
                return 'file://' + img;
            },
            async readPath(dirPath) {
                this.tempAlbum = await getFileArr(dirPath);
                // console.log(tempAlbum);
                // this.tempAlbum = tempAlbum;
            },
            async openDialog(defaultPath = '') {
                const selectedPath = await changeImageRoot(defaultPath);

                if (selectedPath.length) {
                    this.imageRoot = selectedPath[0];
                    localStorage.IM_IMAGE_ROOT = this.imageRoot;
                    this.readPath(this.imageRoot);
                }
            },
            showSnackBar(text, color, timeout) {
                this.text = text;
                this.color = color;
                this.timeout = timeout;
                this.snackbar = true;
            },

            async downloadSingleFile() {
                // await downloadSingle('https://unsplash.com/photos/AaEQmoufHLk/download?force=true');

                // http://bit.ly/2mTM3nY

                const imagePath = '/Users/lorrow/Documents/node_www/image-viewer/code.jpg';

                //await downloadSingle('https://unsplash.com/photos/AaEQmoufHLk/download?force=true', imagePath);

                const all = [];

                for (let i = 0; i < 5; i++) {
                    const p = downloadSingle('https://unsplash.com/photos/AaEQmoufHLk/download?force=true', `/Users/lorrow/Documents/node_www/image-viewer/code${i}.jpg`);
                    all.push(p);
                }


                const PA = await Promise.all(all);

                console.log(PA);

            },
            async downloadSequence(fileArr = []) {
                const promiseAll = [];

                fileArr.forEach((elem, index) => {
                    const promiseSingle = downloadSingle(elem, `/Users/lorrow/Documents/node_www/image-viewer/code${index}.jpg`);
                    promiseAll.push(promiseSingle);
                });

                try {
                    await Promise.all(promiseAll);
                    this.showSnackBar('Download success', 'success', 0);
                } catch (e) {
                    this.showSnackBar('Download failed', 'error', 0);
                }
            },
        },
    }
</script>
