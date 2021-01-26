import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import { Button } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    maxWidth: 245,
    width: 245,
    height: 180,
    margin: 10,
  },
});

export default function ImgMediaCard(props) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardActionArea onClick={() => props.setWallpaper(props.id)}>
        <img src={`file://${props.path}`} width={245} height={"100%"} />
      </CardActionArea>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => props.removeWallpaper(props.id)}>Delete</Button>
      </div>
    </Card>
  );
}
