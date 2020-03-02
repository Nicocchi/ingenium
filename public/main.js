/** @format */

const {
	app,
	BrowserWindow,
	ipcMain,
	globalShortcut,
	dialog
} = require("electron");
const electron = require("electron");
const path = require("path");
const fs = require("fs");
const log = require("electron-log");
const Store = require("electron-store");
const base64 = require("file-base64");

const store = new Store();

store.set("wallpapers", []);

// Change logs to Electron based log
console.log = function(message) {
	log.info(message);
};
console.error = function(message) {
	log.error(message);
};

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
			frame: false,
			kiosk: true,
			alwaysOnTop: false,
			minimizable: false,
			maximizable: false,
			resizable: false,
			fullscreenable: true,
			fullscreen: true,
			movable: false,
			enableLargerThanScreen: true,
			skipTaskbar: true,
			type: "desktop",
			webPreferences: {
				preload: path.join(__dirname, "preload.js"),
				nodeIntegrationInWorker: true
			}
		});

		windows[i].allowRendererProcessReuse = false;
		// Load the html to play the video
		windows[i].loadURL(`file://${__dirname}/video.html`);
	}
}

/**
 * Create the main window
 *
 */
function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webviewTag: true,
		skipTaskbar: true,
		resizable: false,
		webPreferences: {
			nodeIntegration: false,
			preload: __dirname + "/preload.js"
		}
	});

	// mainWindow.webContents.openDevTools();
	// Hide the menu bar
	mainWindow.setMenu(null);
	mainWindow.allowRendererProcessReuse = false;
	// Load React
	mainWindow.loadURL(`http://localhost:3000/`);

	// Instead of closing the application upon close,
	// Hide it instead. Using the global shortcut will
	// reopen the main window
	mainWindow.on("close", event => {
		event.preventDefault();
		mainWindow.hide();
	});
}

function setupWindows(event, result) {
	// If we already have windows on each display,
	// close each one
	if (windows.length > 0) {
		windows.forEach(window => {
			window.close();
		});
	}

	// Read the video html and add the contents of the video location
	// Then save the the new html to the video file and create the windows
	fs.readFile(`${__dirname}/video.html`, "utf-8", function(err, data) {
		if (err) {
			console.log(err);
			throw err;
		}

		let storeResult = store.get("wallpapers");

		if (!storeResult.includes(result)) {
			base64.encode(result, function(err, base64String) {
				const newPath = {
					path: result,
					base: base64String
				};
				storeResult.unshift(newPath);

				// Return the filepath back to React
				event.sender.send("Response-To", storeResult);
				store.set("wallpapers", storeResult);
			});
		}

		// Slice the html at the video src part and append the new html
		const slicedData = data.slice(0, 592);
		const html = `${slicedData}${result}" type="video/mp4"></video><!-- You can also require other files to run in this process --><script src="./renderer.js"></script></body></html>`;

		// Write the new html to the file
		fs.writeFile(`${__dirname}/video.html`, html, function(err) {
			if (err) {
				console.log(err);
				throw err;
			}

			createWindows();
		});
	});
}

/**
 * Dialog box to load the video file
 */
ipcMain.on("dialog-event", (event, path) => {
	// The dialog box
	dialog.showOpenDialog(mainWindow, options).then(result => {
		if (result.canceled) {
			event.returnValue = null;
			return;
		}
		setupWindows(event, result.filePaths[0]);
	});
});

ipcMain.on("apply-event", (event, path) => {
	console.log(path.path);

	setupWindows(event, path.path);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on("ready", () => {
	// Gather the screen information
	displays = electron.screen.getAllDisplays();

	// Create the main window
	createMainWindow();

	// Register a 'CommandOrControl+X' shortcut listener
	const ret = globalShortcut.register("CommandOrControl+W", () => {
		mainWindow.show();
	});

	if (!ret) {
		console.error("registration failed");
	}

	// Check whether a shortcut is registered
	console.log(globalShortcut.isRegistered("CommandorControl+W"));
});

app.on("will-quit", () => {
	// Unregister a shortcut.
	globalShortcut.unregister("CommandOrControl+W");

	// Unregister all shortcuts.
	globalShortcut.unregisterAll();
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
