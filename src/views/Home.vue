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

                                <div style="position: absolute;right:0;top:0">
                                    <v-btn fab dark small depressed color="error">{{album.fileArr.length}}</v-btn>
                                </div>

                                <v-layout
                                        slot="placeholder"
                                        fill-height
                                        align-center
                                        justify-center
                                        ma-0>
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
                stateless
        >
            <v-list class="pa-1">
                <v-list-tile avatar>
                    <v-list-tile-avatar>
                        <img src="https://lh3.googleusercontent.com/-MNA6LIRPLh8/AAAAAAAAAAI/AAAAAAAAAAA/ACevoQM9IrK31nP25dNhP0nRvnQ6tMd7Mw/s64-c-mo/photo.jpg">
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title>Image Viewer </v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action>v{{version}}</v-list-tile-action>

                    <v-list-tile-action>
                        <v-btn icon @click.stop="drawer = !drawer">
                            <v-icon>chevron_left</v-icon>
                        </v-btn>
                    </v-list-tile-action>
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

                <v-list-tile @click="refreshCurrentPath">
                    <v-list-tile-action>
                        <v-icon>refresh</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Refresh Current Directory</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-divider></v-divider>

                <v-list-tile @click="dialogDownload = !dialogDownload">
                    <v-list-tile-action>
                        <v-icon>vertical_align_bottom</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Download New Album</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-divider></v-divider>
            </v-list>
        </v-navigation-drawer>

        <v-dialog v-model="dialogDownload" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Download New Album</span>
                </v-card-title>

                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-radio-group v-model="downloadType" row>
                                    <v-radio label="Mzitu" value="Mzitu" color="yellow darken-2"></v-radio>
                                    <v-radio label="E-Hentai" value="E-Hentai" color="yellow darken-2"></v-radio>
                                </v-radio-group>

                                <div v-if="downloadType === 'E-Hentai'">
                                    <v-text-field
                                            v-model="cookie1"
                                            :rules="[() => !!cookie1 || 'This field is required']"
                                            label="Cookie 1"
                                            prepend-icon="storage"
                                            placeholder="Placeholder"
                                            required
                                            clearable
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="cookie2"
                                            :rules="[() => !!cookie2 || 'This field is required']"
                                            label="Cookie 2"
                                            prepend-icon="storage"
                                            placeholder="Placeholder"
                                            required
                                            clearable
                                    ></v-text-field>
                                </div>

                                <v-text-field
                                        v-model="albumUrl"
                                        :rules="[() => !!albumUrl || 'This field is required']"
                                        label="Album Url"
                                        prepend-icon="how_to_vote"
                                        placeholder="Placeholder"
                                        required
                                        clearable
                                ></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="dialogDownload = false">Close</v-btn>
                    <v-btn flat @click="startDownload">Start Download</v-btn>
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
    import parseMZT from '../libs/parseMZT';
    import { version } from '../../package.json';

    export default {
        name: 'Home',
        components: {},
        data() {
            return {
                version,

                drawer: null,

                tempAlbum: [],

                cookie1: '',
                cookie2: '',
                dialogDownload: false,
                albumUrl: 'https://www.mzitu.com/54354/',
                downloadType: 'Mzitu',

                imageRoot: '',

                snackbar: false,
                color: '',
                timeout: 0,
                text: ''
            }
        },
        mounted() {
            this.checkDefaultPath();
        },
        methods: {
            startDownload() {
                if (this.downloadType === 'E-Hentai') {
                    this.$toasted.error('Coming soon');
                    this.dialogDownload = false;
                    return false;
                }

                if (this.albumUrl === '') {
                    this.$toasted.error('This Album Url is required');
                    return false;
                }

                // https://www.mzitu.com/54354/
                this.downloadMZT(this.albumUrl);
                this.dialogDownload = false;
            },
            async downloadMZT(albumUrl) {
                await parseMZT(albumUrl, this.imageRoot);
                this.refreshCurrentPath();
            },

            async test() {
                const arr = [
                    'https://unsplash.com/photos/AaEQmoufHLk/download?force=true',
                    'https://www.google.com/images/srpr/logo11w.png',
                ];

                // const id = await this.$aria2.call("addUri", arr, { dir: "/Users/lorrow/Documents/node_www/image-viewer" });
                // console.log(id);


                // {
                //     id:'',
                //         jsonrpc:'2.0',
                //     method:'aria2.addUri',
                //     params:[
                //     [download_url],
                //     {
                //         dir:"'D:\Downloads'",
                //         out:"button.png"
                //     }
                // ]
                // };

                const batch = [
                    ['addUri', ['http://116.48.85.124:65534/h/4c114842249811431d9ed7beadbd3ab87b77d278-281902-715-1000-jpg/keystamp=1549357200-723454183b;fileindex=54348673;xres=org/64174086_p4_.jpg', { dir: "/Users/lorrow/Documents/node_www/image-viewer" }]],
                    ['addUri', ['http://61.239.106.253:8484/h/6673bcb218fe74bb679a3c39e575c827005a780f-25325-600-221-jpg/keystamp=1549357200-7f05d02300;fileindex=67119894;xres=org/60295702_p5_.jpg', { dir: "/Users/lorrow/Documents/node_www/image-viewer" }]],

                ];

                const promises = await this.$aria2.batch(batch);
                console.log(promises);
            },

            checkDefaultPath() {
                const imageRoot = localStorage.IM_IMAGE_ROOT;
                if (imageRoot) {
                    this.imageRoot = imageRoot;
                    this.readPath(this.imageRoot);
                    this.$toasted.success('Read Path Success');
                } else {
                    this.showSnackBar('Choose Image Root', 'error', 0);
                }
            },
            refreshCurrentPath() {
                if (this.imageRoot) {
                    this.readPath(this.imageRoot);
                    this.$toasted.success('Refresh Path Success');
                } else {
                    this.showSnackBar('Refresh Path Failed', 'error', 0);
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
                if (img.indexOf('http') > -1) {
                    return img;
                }
                return 'file://' + img;
            },
            async readPath(dirPath) {
                this.tempAlbum = await getFileArr(dirPath);
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
        },
    }
</script>
