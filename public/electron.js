const { app, BrowserWindow, ipcMain} = require("electron");
const electron = require('electron')

const _HOME_ = require("os").homedir();
const _SEP_ = require("path").sep;
const _APPHOME_ = `${_HOME_}${_SEP_}.ingenium${_SEP_}`;

// Gather the screen information
let displays = null;

// Dialog box options
let options = {
	title: "Open Video",
	defaultPath: "D:\\electron-app",
	filters: [{ name: "Movies", extensions: ["mkv", "avi", "mp4"] }],
	properties: ["openFile"]
};

// Array of windows -> equal to the amount of monitors the user has
let windows = [];

// The main window
let mainWindow = null;

/**
 * Creates x windows based on how many monitors the user has
 *
 */
function createWindows() {
	const path = require("path");
	// Reset the windows array so the program can recreate
	// them if the user changes wallpapers
	windows = [];

	// Create a window for each display
	displays.forEach(i => windows.push(`Window ${i.id}`));

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
				backgroundThrottling: false
			}
		});

		windows[i].allowRendererProcessReuse = true;
		windows[i].setMenu(null);
		// windows[i].openDevTools();

		// Load the html to play the video
		windows[i].loadURL(`file://${_APPHOME_}video.html`);
	}
}

/**
 * Create the main window
 *
 */
function createMainWindow() {
	const isDev = require("electron-is-dev");
	const path = require("path");
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		resizable: false,
		icon: `${__dirname}/icon.png`,
		webPreferences: {
			nodeIntegration: false,
			nodeIntegrationInWorker: true,
			webSecurity: false,
			preload: path.join(__dirname, "preload.js"),
		}
	});

	// mainWindow.webContents.openDevTools();
	mainWindow.setMenu(null);
	mainWindow.allowRendererProcessReuse = true;
	// Load React
	// mainWindow.openDevTools();
	mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);
}

/**
 * Setup the main wallpaper windows
 *
 * @param {*} event Electron event
 * @param {*} wallpaperPath The path of the wallpaper to apply
 * @returns
 */
async function setupWindows(event, wallpaperPath) {
	return new Promise(async function(resolve, reject) {
		const { checkDirectoriesExist, getFile, writeFile } = require('./utils/utils')

		// If we already have windows on each display,
		// close each one
		if (windows.length > 0) {
			windows.forEach(window => {
				window.close();
			});
		}

		let wallpapers = {
			wallpapers: []
		};

		const filesExist = checkDirectoriesExist(_APPHOME_);
		if (filesExist) {
			const {setVideoHtml } = require('./utils/utils')
			getFile(`${_APPHOME_}video.html`).then(vb => {

				getFile(`${_APPHOME_}wallpapers.json`).then(wp => {
					wp = wp.trim();
					wallpapers = JSON.parse(wp);

					const selectedWallpaper = wallpapers.wallpapers.find(vend => vend["path"] === wallpaperPath);
					let newWallpapers = wallpapers.wallpapers;

					if (selectedWallpaper === "undefined" || selectedWallpaper === undefined) {

						const newFile = {
							path: wallpaperPath,
							muted: true
						}

						newWallpapers.unshift(newFile);
						wallpapers.wallpapers = newWallpapers;

						writeFile(`${_APPHOME_}wallpapers.json`, JSON.stringify(wallpapers)).then(res => {

							const html = setVideoHtml(wallpaperPath);

							writeFile(`${_APPHOME_}video.html`, html).then(res => {
								createWindows();
								resolve(wallpapers.wallpapers)
							}).catch(e => {console.log(e); reject(e)})
						}).catch(e => {console.log(e); reject(e)})

						return;
					}

					// If the wallpaper exists
					const html = setVideoHtml(selectedWallpaper.path)

					writeFile(`${_APPHOME_}video.html`, html).then(res => {
						createWindows();
						resolve(wallpapers.wallpapers)
					}).catch(e => {console.log(e); reject(e)})

				}).catch(e => {console.log(e); reject(e)})
			}).catch(e => {console.log(e); reject(e)})
			

		} else {
			console.log("files don't exist")
		}
	})
}

/**
 * Dialog box to load the video file
 */
ipcMain.on("dialog-event", (event, path) => {
	const { dialog } = require("electron");
	// The dialog box
	dialog.showOpenDialog(mainWindow, options).then(result => {
		if (result.canceled) return event.returnValue = null;

		setupWindows(event, result.filePaths[0]).then(res => {
			return event.returnValue = res;
		}).catch(e => console.log(e))
	});
});

/**
 * Dialog box to load the video file
 */
ipcMain.on("stop-event", (event, path) => {
	windows.forEach(window => {
		window.close();
	});

	windows = [];
});

ipcMain.on("apply-event", (event, path) => {
	console.log(path.path);

	setupWindows(event, path.path);
});

ipcMain.on("initial-reqest", (event, args) => {
	const { checkDirectoriesExist, getFile } = require('./utils/utils')
	checkDirectoriesExist(_APPHOME_)

	getFile(`${_APPHOME_}wallpapers.json`).then(res => {
		res = JSON.parse(res.trim());

		event.returnValue = res.wallpapers;
	})
	
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on("ready", () => {
	const { globalShortcut } = require("electron");
	// Gather the screen information
	displays = electron.screen.getAllDisplays();

	// Create the main window
	createMainWindow();

	// Register a 'CommandOrControl+X' shortcut listener
	const ret = globalShortcut.register("CommandOrControl+W", () => {
		createMainWindow();
	});

	const ret2 = globalShortcut.register("CommandOrControl+Q", () => {
		mainWindow.close();
		windows.forEach(window => {
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
app.on("window-all-closed", function() {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
