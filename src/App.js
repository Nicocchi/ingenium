import React, { Component } from "react";
import "./App.css";
import Container from "./Container";

class App extends Component {
	state = {
		images: []
	};

	handleClick = e => {
		e.preventDefault();
		window.ipcRenderer.send("dialog-event");
		window.ipcRenderer.on("Response-To", function(event, data) {
			console.log("data", data);
			if (data !== null || data !== "undefined") {
				this.setState({ images: data });
			}

			return;
		});
	};

	render() {
		return <Container />;
	}
}

export default App;
