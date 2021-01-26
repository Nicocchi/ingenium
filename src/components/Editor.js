import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

/**
 * Editor to create a new wallpaper
 * @param {*} props
 */
function Editor(props) {
  const [filePath, setFilePath] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("video");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  /**
   * Get the filepath of the wallpaper
   * @param {*} e
   */
  async function getFile(e) {
    e.preventDefault();
    try {
      const res = await window.ipcRenderer.sendSync("get_wallpaper_path");

      if (res !== null) {
        setFilePath(res);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  /**
   * Changes the type of wallpaper. Image, Video, Webpage.
   * @param {*} e
   */
  const handleType = (e) => {
    setType(e.target.value);
  };

  /**
   * Handles the input of the wallpaper name
   * @param {*} e
   */
  const handleChange = (e) => {
    setName(e.target.value);
  };

  /**
   * Handles closing the dialog box
   * @param {*} event
   * @param {*} reason reason for closing
   */
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  /**
   * Creates a new wallpaper. Sends the data to electron to handle
   * saving the data
   * @param {*} e
   */
  async function createWallpaper(e) {
    e.preventDefault();
    try {
      const res = await window.ipcRenderer.sendSync("save_new_wallpaper", {
        path: filePath,
        type,
        name,
      });

      if (res !== null) {
        // Snackbar
        props.toggleEditor();
        setMessage("Created wallpaper");
        setOpen(true);
        props.getSavedWallpapers();
      }
    } catch (error) {
      console.log("error", error);
      setMessage("Error creating wallpaper");
      setOpen(true);
    }
  }

  return (
    <div>
      <Dialog
        onClose={props.toggleEditor}
        aria-labelledby="editor-dialog-title"
        open={props.open}
        fullWidth={300}
        maxWidth={300}
      >
        <DialogTitle
          className="Dialog"
          id="editor-dialog-title"
          onClose={props.handleClose}
        >
          Create Wallpaper
        </DialogTitle>
        <DialogContent dividers className="Dialog">
          <form onSubmit={createWallpaper}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                margin: "20px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                onChange={handleType}
              >
                <MenuItem value={"video"}>Video</MenuItem>
              </Select>
            </div>
            <div>
              <TextField
                autoComplete="name"
                id="name"
                label="Wallpaper Name"
                value={name}
                onChange={handleChange}
                style={{ width: "100%" }}
                className="Textfield"
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
              }}
            >
              <TextField
                autoComplete="filepath"
                id="filepath"
                label="File Path"
                value={filePath}
                disabled={true}
                style={{ width: "100%" }}
              />
              <Button
                style={{ marginLeft: "20px" }}
                type="button"
                onClick={getFile}
                variant="contained"
                color="primary"
              >
                Open
              </Button>
            </div>
          </form>
        </DialogContent>
        <DialogActions className="Dialog">
          <Button autoFocus onClick={props.toggleEditor} color="primary">
            Cancel
          </Button>
          <Button
            disabled={filePath && name ? false : true}
            autoFocus
            onClick={createWallpaper}
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}

Editor.propTypes = {
  open: PropTypes.bool,
  toggleEditor: PropTypes.func,
  getSavedWallpapers: PropTypes.func,
};

export default Editor;
