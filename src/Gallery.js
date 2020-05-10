import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";

const useStyles = makeStyles({
	root: {
		maxWidth: 245,
		width: 245,
		height: 135,
		margin: 10
	}
});

export default function ImgMediaCard(props) {
	const classes = useStyles();
	return (
		<Card className={classes.root}>
			<CardActionArea onClick={e => props.handleApply(e, props.image)}>
				<video loop id="myvideo" width={245} height={"100%"} preload="auto" muted>
					<source src={`file://${props.image.path}`} type="video/mp4" />
				</video>
			</CardActionArea>
		</Card>
	);
}
