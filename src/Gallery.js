import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
	root: {
		maxWidth: 245,
		width: 245,
		margin: 10
	}
});

export default function ImgMediaCard(props) {
	const classes = useStyles();
	const util = require("util");
	console.log("image", props.image);
	return (
		<Card className={classes.root}>
			<CardActionArea>
				<video
					loop
					id="myvideo"
					width={245}
					height={"100%"}
					autoPlay
					preload="auto"
					muted>
					<source
						src={`data:video/mp4;base64,${props.image.base}`}
						type="video/mp4"
					/>
				</video>
			</CardActionArea>
			<CardActions>
				<Button
					type="button"
					onClick={e => props.handleApply(e, props.image)}
					size="small"
					color="primary">
					Apply
				</Button>
				<Button size="small" color="primary">
					Remove
				</Button>
			</CardActions>
		</Card>
	);
}
