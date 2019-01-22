module.exports = {
    productionSourceMap: false,
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                // options placed here will be merged with default configuration and passed to electron-builder
                productName: "ImageViewer",
                appId: "org.mysticlorrow.imageviewer",
                mac: {
                    icon: "./public/icons/icon.icns",
                    target: [
                        "zip",
                        "dmg"
                    ]
                },
                win: {
                    icon: "./public/icons/icon.ico",
                    publish: ["github"],
                    target: [
                        {
                            target: "nsis",
                            arch: [
                                "x64",
                            ]
                        }
                    ]
                },
                nsis: {
                    perMachine: true
                },
            }
        }
    }
};
