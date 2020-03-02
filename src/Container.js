import React, { Component } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ImgMediaCard from "./Gallery";

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
		height: "536px"
	}
});

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Typography
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
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

class Container extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 0,
			images: []
		};

		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		const localStorage = window.localStorage.getItem("images");
		// console.log(localStorage);
		const ll = JSON.parse(localStorage);
		this.setState({ images: ll });
	}

	handleClick = e => {
		e.preventDefault();
		window.ipcRenderer.send("dialog-event");
		window.ipcRenderer.on("Response-To", function(event, data) {
			const util = require("util");
			// console.log(
			// 	"data",
			// 	util.inspect(data, { showHidden: false, depth: null })
			// );
			if (data !== null || data !== "undefined") {
				const test = JSON.stringify(data);
				// console.log("test", test);
				window.localStorage.setItem("images", test);
				return this.setState({ images: data });
			}

			return;
		});
	};

	handleApply = (e, filePath) => {
		window.ipcRenderer.send("apply-event", filePath);
	};

	render() {
		const classes = useStyles();
		return (
			<div className={classes.root}>
				<div className={classes.main}>
					<StyledTabs
						value={this.state.value}
						onChange={this.handleChange}
						aria-label="styled tabs example">
						<StyledTab label="Wallpapers" {...a11yProps(0)} />
					</StyledTabs>
					<Typography className={classes.padding} />
					<TabPanel
						className={classes.tabPanel}
						value={this.state.value}
						index={0}>
						<div>
							<h1>Wallpapers</h1>
							<div style={{ display: "flex", flexWrap: "wrap" }}>
								{this.state.images.length > 0
									? this.state.images.map(img => (
											<ImgMediaCard
												key={img}
												image={img}
												handleApply={this.handleApply}
											/>
									  ))
									: null}
								<br />
							</div>

							<Button
								type="button"
								onClick={e => this.handleClick(e)}
								variant="contained"
								color="primary">
								Open
							</Button>
						</div>
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
