# Ingenium

A wallpaper engine for Linux built with NodeJS/Electron

## Features

- Create video wallpaper
- Loads previously set wallpaper on load

## Shortcuts

- Ctrl + 7 to open the main window
- Ctrl + 8 to quit the application

The tray icon is something I am working on next to easily open the main window. There is a bug with the Ctrl+8 when using it while the main window is not open. This doesn't crash the app, however, it can be annoying.

## Build

To build application. This will build an AppImage into the `dist` folder.

```
$ npm install
$ npm run build
```

## Run

To run, just execute the AppImage that is in the `dist` folder.
