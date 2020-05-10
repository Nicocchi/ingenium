module.exports = {
    setVideoHtml: (path = "") => {
        return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'" />
            <meta http-equiv="X-Content-Security-Policy" content="default-src 'self'; script-src 'self'" />
            <title>Ingenium Wallpaper</title>
            <link rel="stylesheet" type="text/css" href="styles.css" />
        </head>
        <body>
            <video loop id="myvideo" autoplay preload="auto" muted>
                <source src="${path}" type="video/mp4">
            </video>
            <script src="./renderer.js"></script>
        </body>
    </html>`
    },

    getFile: (filePath) => {
        const fs = require('fs')
        return new Promise(async function(resolve, reject) {
            try {
                const file = await fs.readFileSync(filePath, "utf-8");
                resolve(file);
                
            } catch (error) {
                console.log("getFile error", error);
                reject(error);
            }
        })
        
    },

    writeFile: (filePath, value) => {
        const fs = require('fs')
            return new Promise(async function(resolve, reject) {
                try {
                    await fs.writeFileSync(filePath, value);
                    resolve(true);
                    
                } catch (error) {
                    console.log("writeFile error", error);
                    reject(error);
                }
            })
    },

    /** 
     * Checks if directories exist, if not, creates them
     * @param path A valid path to a directory
     * @returns Returns true if no errors where made. Returns false for errors
     */
    checkDirectoriesExist: (path) => {
        const fs = require('fs')
        if (!fs.existsSync(path)) {
            console.log(`${path} does not exist...creating`)
            //Check dir exists or create it
            fs.mkdirSync(path, "0777", true, function() {
                console.log(`${path} Created`)
            });
        }
    
        if (!fs.existsSync(`${path}video.html`)) {
            console.log(`${path}videos.html does not exist...creating`)
            //Check dir exists or create it
            const html = `<!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'" />
                    <meta http-equiv="X-Content-Security-Policy" content="default-src 'self'; script-src 'self'" />
                    <title>Ingenium Wallpaper</title>
                    <link rel="stylesheet" type="text/css" href="styles.css" />
                </head>
                <body>
                    <video loop id="myvideo" autoplay preload="auto" playbackRate="3.0" muted>
                        <source src="" type="video/mp4">
                    </video>
                    <script src="./renderer.js"></script>
                </body>
            </html>`;

            fs.writeFileSync(`${path}video.html`, html, err => {
                if (err) {
                    console.log(err);
                    return false;
                }

            });
            
        }
    
        if (!fs.existsSync(`${path}styls.css`)) {
            console.log(`${path}styles.css does not exist...creating`)
            const styles = `
            html, body {
                margin: 0;
                padding: 0;
                overflow: hidden;
                background: transparent;
    
            }
    
            #myvideo {
                min-width: 100%;
                min-height: 100%;
                height: 100%;
                width: 100%;
            }
            `;

            fs.writeFileSync(`${path}styles.css`, styles, err => {
                if (err) {
                    console.log(err);
                    return false;
                }
            });
        }
    
        if (!fs.existsSync(`${path}wallpapers.json`)) {
            console.log(`${path}wallpapers.json does not exist...creating`)
            const wallpapers = { wallpapers: [] }
            fs.writeFileSync(`${path}wallpapers.json`, JSON.stringify(wallpapers), err => {
                if (err) {
                    console.log(err);
                    return false;
                }
            });

        }
    
        return true;

    }
}

