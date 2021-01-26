require("v8-compile-cache");
const fs = require("fs");
const { nanoid } = require("nanoid");
const genThumbnail = require("simple-thumbnail");
const electron = require("electron");
const { app, BrowserWindow, ipcMain } = require("electron");
const { checkDirectoriesExist, getFile, writeFile } = require("./utils/utils");
const storage = require("electron-storage");

const _HOME_ = require("os").homedir();
const _SEP_ = require("path").sep;
const _APPHOME_ = `${_HOME_}${_SEP_}.ingenium${_SEP_}`;

// Gather the screen information
let displays = null;

// Dialog box options
let options = {
  title: "Open File",
  defaultPath: "D:\\electron-app",
  filters: [{ name: "Movies", extensions: ["mkv", "avi", "mp4"] }],
  properties: ["openFile"],
};

// Array of windows -> equal to the amount of monitors the user has
let windows = [];

// The main window
let mainWindow = null;

/**
 * Creates x windows based on how many monitors the user has
 *
 */
function createWindows(wallpaperID, displayArr) {
  const path = require("path");
  // Reset the windows array so the program can recreate
  // them if the user changes wallpapers
  windows = [];

  // Create a window for each display
  displayArr.forEach((i) => windows.push(`Window ${i.id}`));

  for (let i = 0; i < windows.length; i++) {
    windows[i] = new BrowserWindow({
      width: displays[i].bounds.width,
      height: displays[i].bounds.height,
      x: displays[i].bounds.x,
      y: displays[i].bounds.y,
      resizable: false,
      transparent: false,
      fullscreen: true,
      movable: false,
      skipTaskbar: true,
      type: "desktop",
      useContentSize: true,
      icon: `${__dirname}/icon.png`,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        nodeIntegrationInWorker: true,
        webSecurity: true,
        backgroundThrottling: false,
      },
    });

    windows[i].allowRendererProcessReuse = true;
    windows[i].setMenu(null);
    // windows[i].openDevTools();

    // Load the html to play the video
    windows[i].loadURL(`file://${_APPHOME_}/${wallpaperID}/index.html`);
  }
}

/**
 * Create the main window
 *
 */
function createMainWindow() {
  const isDev = require("electron-is-dev");
  const path = require("path");
  // let bounds = electron.screen.getPrimaryDisplay().bounds;
  // let x = Math.ceil(bounds.x + ((bounds.width - 1200) / 2));
  // let y = Math.ceil(bounds.y + ((bounds.height - 800) / 2));

  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  let x = width / 4;
  let y = height / 4;
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    resizable: false,
    x: x,
    y: y,
    center: true,
    icon: `${__dirname}/icon.png`,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: true,
      webSecurity: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null);
  mainWindow.allowRendererProcessReuse = true;
  // Load React
  // mainWindow.openDevTools();
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
}

/**
 * Returns a valid path to a wallpaper
 */
ipcMain.on("get_wallpaper_path", (event) => {
  const { dialog } = require("electron");
  // The dialog box
  dialog.showOpenDialog(mainWindow, options).then((result) => {
    if (result.canceled) return (event.returnValue = null);
    return (event.returnValue = result.filePaths[0]);
  });
});

/**
 * Generates a new wallpaper directory with the required files and
 * updates the wallpapers.json
 */
ipcMain.on("save_new_wallpaper", (event, newWP) => {
  const id = nanoid();
  const rootExist = checkDirectoriesExist(_APPHOME_);
  const dirExist = checkDirectoriesExist(`${_APPHOME_}/${id}`);

  if (!fs.existsSync(`${_APPHOME_}/${id}/index.html`)) {
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
                      <source src="${newWP.path}"" type="video/mp4">
                  </video>
                  <script src="./renderer.js"></script>
              </body>
          </html>`;

    fs.writeFileSync(`${_APPHOME_}/${id}/index.html`, html, (err) => {
      if (err) {
        console.log(err);
        return (event.returnValue = null);
      }
    });
  }

  if (!fs.existsSync(`${_APPHOME_}/${id}/styles.css`)) {
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

    fs.writeFileSync(`${_APPHOME_}/${id}/styles.css`, styles, (err) => {
      if (err) {
        console.log(err);
        return (event.returnValue = null);
      }
    });
  }

  genThumbnail(newWP.path, `${_APPHOME_}/${id}/preview.png`, "1920x1080").then(
    () => {
      getFile(`${_APPHOME_}wallpapers.json`).then((wp) => {
        wp = wp.trim();
        wallpapers = JSON.parse(wp);

        const newWallpaper = {
          id,
          name: newWP.name,
          type: newWP.type,
          thumbnail: `${_APPHOME_}${id}/preview.png`,
        };

        wallpapers.wallpapers.push(newWallpaper);

        writeFile(`${_APPHOME_}wallpapers.json`, JSON.stringify(wallpapers))
          .then((res) => {
            return (event.returnValue = wallpapers.wallpapers);
          })
          .catch((e) => {
            console.log(e);
            reject(e);
          });
      });
    }
  );
});

ipcMain.on("set_wallpaper", (event, args) => {
  // const display = displays.filter((dp) => dp.id === args.displayID);
  createWindows(args.wallpaperID, args.displays);

  storage.set(
    "currentWallpaper",
    { id: args.wallpaperID, displays: args.displays },
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );

  return (event.returnValue = "SUCCESS");
});

ipcMain.on("get_wallpapers", (event, args) => {
  const { checkDirectoriesExist, getFile } = require("./utils/utils");
  checkDirectoriesExist(_APPHOME_);

  getFile(`${_APPHOME_}wallpapers.json`).then((res) => {
    res = JSON.parse(res.trim());

    event.returnValue = res.wallpapers;
  });
});

ipcMain.on("remove_wallpapers", (event, args) => {
  const { checkDirectoriesExist, getFile } = require("./utils/utils");
  checkDirectoriesExist(_APPHOME_);

  fs.rmdirSync(`${_APPHOME_}/${args.ID}`, { recursive: true });

  getFile(`${_APPHOME_}wallpapers.json`).then((wp) => {
    wp = wp.trim();
    wallpapers = JSON.parse(wp);

    let newWallpapers = wallpapers.wallpapers.filter((w) => w.id !== args.ID);

    wallpapers.wallpapers = newWallpapers;

    writeFile(`${_APPHOME_}wallpapers.json`, JSON.stringify(wallpapers))
      .then((res) => {
        return (event.returnValue = wallpapers.wallpapers);
      })
      .catch((e) => {
        console.log(e);
        reject(e);
      });
  });
});

ipcMain.on("get_displays", (event, args) => {
  event.returnValue = displays;
});

/**
 * Dialog box to load the video file
 */
ipcMain.on("stop-event", (event, path) => {
  windows.forEach((window) => {
    window.close();
  });

  windows = [];
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on("ready", () => {
  const { globalShortcut } = require("electron");
  // Gather the screen information
  displays = electron.screen.getAllDisplays();
  let startup = false;

  storage
    .get("currentWallpaper")
    .then((data) => {
      createWindows(data.id, data.displays);
      startup = true;
    })
    .catch((err) => {
      console.error(err);
    });

  if (!startup) {
    // Create the main window
    // createMainWindow();
  }

  // Register a 'CommandOrControl+X' shortcut listener
  const ret = globalShortcut.register("CommandOrControl+7", () => {
    createMainWindow();
  });

  const ret2 = globalShortcut.register("CommandOrControl+8", () => {
    mainWindow.close();
    windows.forEach((window) => {
      window.close();
    });
  });

  if (!ret) console.error("registration failed");

  if (!ret2) console.error("registration failed");

  // Check whether a shortcut is registered
  console.log(globalShortcut.isRegistered("CommandorControl+W"));
  console.log(globalShortcut.isRegistered("CommandorControl+Q"));
});

app.on("will-quit", () => {
  const { globalShortcut } = require("electron");
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

app.once("before-quit", () => {
  window.removeAllListeners("close");
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
