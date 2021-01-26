import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import PersonalVideoIcon from "@material-ui/icons/PersonalVideo";

/**
 * Displays available monitors for the user to use
 * @param {*} props
 */
function MonitorDialog(props) {
  const [selectedDisplays, setSelectedDisplays] = useState([]);

  /**
   * Sets the wallpaper on the desired monitor(s)
   * @param {*} displayID
   */
  async function setWallpaper(displayID) {
    try {
      const res = await window.ipcRenderer.sendSync("set_wallpaper", {
        wallpaperID: props.wallpaperID,
        displays: selectedDisplays,
      });
      props.toggleDisplays();
    } catch (error) {}
  }

  /**
   * Selects the currently click monitor
   * @param {*} id
   */
  const selectDisplay = (id) => {
    let sDP = [];
    if (selectedDisplays.includes(id)) {
      sDP = selectedDisplays.filter((dp) => dp !== id);
    } else {
      sDP = selectedDisplays.map((dp) => dp);
      sDP.push(id);
    }

    setSelectedDisplays(sDP);
  };

  /**
   * Selects all the monitors
   */
  const handleSelectAll = () => {
    setSelectedDisplays(props.displays.map((dp) => dp.id));
  };

  return (
    <Dialog
      onClose={props.toggleDisplays}
      aria-labelledby="customized-dialog-title"
      open={props.displayOpen}
    >
      <DialogContent dividers style={{ display: "flex" }} className="Dialog">
        {props.displays.map((dp, index) => {
          return (
            <div
              onClick={() => selectDisplay(dp.id)}
              className="Monitor-Dialog"
              style={{
                width: "200px",
                margin: "10px",
              }}
            >
              <PersonalVideoIcon
                className="Monitor-Dialog-Icon"
                style={{
                  fontSize: 100,
                  color: selectedDisplays.includes(dp.id) ? "#8a3f9c" : "#000",
                }}
              />
              <p>{index}</p>
            </div>
          );
        })}
        <Button autoFocus onClick={handleSelectAll} color="primary">
          Select All
        </Button>
      </DialogContent>
      <DialogActions className="Dialog">
        <Button autoFocus onClick={props.toggleDisplays} color="primary">
          Cancel
        </Button>
        <Button
          disabled={selectedDisplays.length > 0 ? false : true}
          autoFocus
          onClick={setWallpaper}
          color="primary"
        >
          Set
        </Button>
      </DialogActions>
    </Dialog>
  );
}

MonitorDialog.propTypes = {
  displays: PropTypes.array,
  displayOpen: PropTypes.bool,
  wallpaperID: PropTypes.string,
  toggleDisplays: PropTypes.func,
};

export default MonitorDialog;
