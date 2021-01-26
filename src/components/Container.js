import React, { useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
  Dialog,
  IconButton,
} from "@material-ui/core";
import ImgMediaCard from "./Gallery";
import { nanoid } from "nanoid";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > div": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#635ee7",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: "#fff",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    "&:focus": {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  padding: {
    padding: 1,
  },
  main: {
    backgroundColor: "#2e1534",
    color: "#fff",
  },
  tabPanel: {
    height: "536px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignContent: "space-between",
  },
  closeButton: {
    position: "absolute",
  },
});

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const DialogTitle = withStyles(useStyles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          {/* <CloseIcon /> */}
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function Container(props) {
  const [value, setValue] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(false);
  const { classes } = props;

  /**
   * Changes the tabs
   */
  const handleChange = () => {};

  /**
   * Stops the wallpaper and closes the windows
   */
  const handleStop = () => {
    window.ipcRenderer.send("stop-event");
  };

  /**
   * Toggles the about dialog box
   */
  const toggleAbout = () => {
    setAboutOpen(!aboutOpen);
  };

  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="styled tabs example"
        >
          <StyledTab label="Wallpapers" {...a11yProps(0)} />
        </StyledTabs>
        <TabPanel className={classes.tabPanel} value={value} index={0}>
          <div
            style={{
              height: "87vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ height: "640px", maxHeight: "640px" }}>
              <h1>Wallpapers</h1>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {props.wallpapers.length > 0
                  ? props.wallpapers.map((wp) => (
                      <ImgMediaCard
                        key={nanoid()}
                        id={wp.id}
                        path={wp.thumbnail}
                        setWallpaper={props.setWallpaper}
                        removeWallpaper={props.removeWallpaper}
                      />
                    ))
                  : null}
                <br />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignContent: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <Button variant="outlined" color="primary" onClick={toggleAbout}>
                About
              </Button>
              <Button
                style={{ marginLeft: "20px" }}
                type="button"
                onClick={(e) => handleStop(e)}
                variant="contained"
                color="secondary"
              >
                Stop Wallpaper
              </Button>
              <Button
                style={{ marginLeft: "20px" }}
                type="button"
                onClick={props.toggleEditor}
                variant="contained"
                color="primary"
              >
                Create Wallpaper
              </Button>
            </div>
          </div>
          <Dialog
            onClose={toggleAbout}
            aria-labelledby="customized-dialog-title"
            open={aboutOpen}
          >
            <DialogTitle id="customized-dialog-title" onClose={toggleAbout}>
              About
            </DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>
                Ingenium is a free open source Linux wallpaper engine created by
                Nicocchi
              </Typography>
              <br />
              <Typography gutterBottom>
                Shortcut to open window: Ctrl + 7
              </Typography>
              <Typography gutterBottom>
                Shortcut to quit Application: Ctrl + 8
              </Typography>
              <Typography gutterBottom>Features to implement:</Typography>
              <ul>
                <li>Shortcut keybind editor</li>
                <li>Tray icon</li>
                <li>Settings tab</li>
                <li>Image and Webpage options</li>
                <li>Desktop views (icons or no icons)</li>
              </ul>
              <Typography gutterBottom>Known bugs:</Typography>
              <ul>
                <li>
                  JavaScript error when using Ctrl + 8 when main window is NOT
                  open
                </li>
              </ul>
              <br />
              <Typography gutterBottom>
                Icons made by https://www.flaticon.com/authors/flat-icons
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={toggleAbout} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </div>
    </div>
  );
}

Container.propTypes = {
  getSavedWallpapers: PropTypes.func,
  toggleEditor: PropTypes.func,
  setWallpaper: PropTypes.func,
  removeWallpaper: PropTypes.func,
  wallpapers: PropTypes.array,
};

export default withStyles(useStyles)(Container);
