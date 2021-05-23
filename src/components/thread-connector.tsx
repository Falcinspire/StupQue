import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    width: '100%', 
    height: '12px' 
  },
  bar: { 
    width: '2px', 
    backgroundColor: 'gray'
  }
});

/**
 * A small vertical line that acts as a visual representation 
 * of the relationship between a question and its responses
 */
function ThreadConnector() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.bar}></div>
    </div>
  );
}

export default ThreadConnector;
