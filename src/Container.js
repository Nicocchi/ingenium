import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ImgMediaCard from "./Gallery";
import shortid from 'shortid';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';

const StyledTabs = withStyles({
	indicator: {
		display: "flex",
		justifyContent: "center",
		backgroundColor: "transparent",
		"& > div": {
			maxWidth: 40,
			width: "100%",
			backgroundColor: "#635ee7"
		}
	}
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles(theme => ({
	root: {
		textTransform: "none",
		color: "#fff",
		fontWeight: theme.typography.fontWeightRegular,
		fontSize: theme.typography.pxToRem(15),
		marginRight: theme.spacing(1),
		"&:focus": {
			opacity: 1
		}
	}
}))(props => <Tab disableRipple {...props} />);

const useStyles = theme => ({
	root: {
		flexGrow: 1
	},
	padding: {
		padding: 1
	},
	main: {
		backgroundColor: "#2e1534",
		color: "#fff"
	},
	tabPanel: {
		height: "536px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		alignContent: "space-between"
	},
	closeButton: {
		position: 'absolute',
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
	value: PropTypes.any.isRequired
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`
	};
}

const DialogTitle = withStyles(useStyles)(props => {
	const { children, classes, onClose, ...other } = props;
	return (
	  <MuiDialogTitle disableTypography className={classes.root} {...other}>
		<Typography variant="h6">{children}</Typography>
		{onClose ? (
		  <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
			{/* <CloseIcon /> */}
		  </IconButton>
		) : null}
	  </MuiDialogTitle>
	);
  });

  const DialogContent = withStyles(theme => ({
	root: {
	  padding: theme.spacing(2)
	},
  }))(MuiDialogContent);
  
  const DialogActions = withStyles(theme => ({
	root: {
	  margin: 0,
	  padding: theme.spacing(1),
	},
  }))(MuiDialogActions);

class Container extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 0,
			open: false
		};

		this.handleClickOpen = this.handleClickOpen.bind(this);
		this.handleClickClose = this.handleClickClose.bind(this);
	}

	handleClickOpen() {
		this.setState({ open: true})
	}

	handleClickClose() {
		this.setState({ open: false})
	}

	render() {
		const classes = useStyles();
		console.log("[container.js] render() -> state", this.state);
		return (
			<div className={classes.root}>
				<div className={classes.main}>
					<StyledTabs value={this.state.value} onChange={this.handleChange} aria-label="styled tabs example">
						<StyledTab label="Wallpapers" {...a11yProps(0)} />
					</StyledTabs>
					{/* <Typography className={classes.padding} /> */}
					<TabPanel className={classes.tabPanel} value={this.state.value} index={0}>
						<div style={{ height: "87vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
							<div style={{ height: "640px", maxHeight: "640px" }}>
								<h1>Wallpapers</h1>
								<div style={{ display: "flex", flexWrap: "wrap" }}>
									{this.props.images !== null
										? this.props.images.map(img => (
												<ImgMediaCard key={shortid.generate()} image={img} handleApply={this.props.handleApply} />
										  ))
										: null}
									<br />
								</div>
							</div>
							<div style={{ display: "flex", alignContent: "flex-end", justifyContent: "flex-end" }}>
							<Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
								About
							</Button>
							<Button style={{marginLeft: "20px"}}
									type="button"
									onClick={e => this.props.handleStop(e)}
									variant="contained"
									color="secondary">
									Stop Wallpaper
								</Button>
								<Button style={{marginLeft: "20px"}}
									type="button"
									onClick={e => this.props.handleClick(e)}
									variant="contained"
									color="primary">
									Open Wallpaper
								</Button>
							</div>
						</div>
						<Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.state.open}>
							<DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
							About
							</DialogTitle>
							<DialogContent dividers>
							<Typography gutterBottom>
							Ingenium is a free open source Linux wallpaper engine created by <a href="#">Nicocchi</a>
							</Typography>
							<br />
							<Typography gutterBottom>
							Icons made by <a href="https://www.flaticon.com/authors/flat-icons" title="Flat Icons">Flat Icons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
							</Typography>
							</DialogContent>
							<DialogActions>
							<Button autoFocus onClick={this.handleClickClose} color="primary">
								OK
							</Button>
							</DialogActions>
						</Dialog>
					</TabPanel>
					<TabPanel value={this.state.value} index={1}>
						Item Two
					</TabPanel>
					<TabPanel value={this.state.value} index={2}>
						Item Three
					</TabPanel>
				</div>
			</div>
		);
	}
}

export default withStyles(useStyles)(Container);
