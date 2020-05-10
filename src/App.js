import React, { Component } from "react";
import "./App.css";
import Container from "./Container";

class App extends Component {
	constructor() {
		super();
		this.state = {
			images: []
		};

		this.getSavedWallpapers = this.getSavedWallpapers.bind(this);
		this.openWallpaper = this.openWallpaper.bind(this);
		this.handleStop = this.handleStop.bind(this);
		this.handleApply = this.handleApply.bind(this);
	}

	componentDidMount() {
		this.getSavedWallpapers();
	}

	/**
	 * Retrieve the saved wallpapers from electron's main process
	 *
	 * @memberof App
	 */
	async getSavedWallpapers() {
		try {
			const res = await window.ipcRenderer.sendSync("initial-reqest");
			this.setState({ images: res });
		} catch (error) {
			console.log("error", error)
		}
	}

	/**
	 * Open a specific wallpaper
	 *
	 * @param {*} e Event
	 * @memberof App
	 */
	async openWallpaper(e) {
		e.preventDefault();
		try {
			const res = await window.ipcRenderer.sendSync("dialog-event");

			if (res !== null) {
				this.setState({ images: res });
			}
		} catch (error) {
			console.log("error", error)
		}
	}

	/**
	 * Removes the wallpapers
	 *
	 * @memberof App
	 */
	handleStop= e => {
		e.preventDefault();
		window.ipcRenderer.send("stop-event");
	};

	/**
	 * Applies the currently selected wallpaper
	 *
	 * @memberof App
	 */
	handleApply = (e, filePath) => {
		window.ipcRenderer.send("apply-event", filePath);
	};

	render() {
		return <Container handleStop={this.handleStop} handleApply={this.handleApply} getSavedWallpapers={this.getSavedWallpapers} handleClick={this.openWallpaper} images={this.state.images} />;
	}
}

export default App;
