import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Editor, Container, MonitorDialog } from "./components";

function App(props) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [wallpapers, setWallpapers] = useState([]);
  const [displays, setDisplays] = useState([]);
  const [displayOpen, setDisplayOpen] = useState(false);
  const [wallpaperID, setWallpaperID] = useState("");

  useEffect(() => {
    getSavedWallpapers();
    getDisplays();
    return () => {
      // Cleanup
    };
  }, []);

  async function getSavedWallpapers() {
    try {
      const res = await window.ipcRenderer.sendSync("get_wallpapers");
      setWallpapers(res);
    } catch (error) {
      console.log("error", error);
    }
  }

  async function removeWallpaper(id) {
    try {
      const res = await window.ipcRenderer.sendSync("remove_wallpapers", {
        ID: id,
      });
      setWallpapers(res);
    } catch (error) {
      console.log("error", error);
    }
  }

  async function getDisplays() {
    try {
      const res = await window.ipcRenderer.sendSync("get_displays");
      setDisplays(res);
    } catch (error) {
      console.log("error", error);
    }
  }

  const toggleEditor = () => {
    setEditorOpen(!editorOpen);
  };

  const toggleDisplays = () => {
    setDisplayOpen(!displayOpen);
  };

  const openDisplays = (id) => {
    setWallpaperID(id);
    setDisplayOpen(true);
  };

  return (
    <div>
      <Editor
        open={editorOpen}
        toggleEditor={toggleEditor}
        getSavedWallpapers={getSavedWallpapers}
      />
      <Container
        getSavedWallpapers={getSavedWallpapers}
        toggleEditor={toggleEditor}
        wallpapers={wallpapers}
        setWallpaper={openDisplays}
        removeWallpaper={removeWallpaper}
      />
      <MonitorDialog
        displays={displays}
        displayOpen={displayOpen}
        wallpaperID={wallpaperID}
        toggleDisplays={toggleDisplays}
      />
    </div>
  );
}

App.propTypes = {};

export default App;
