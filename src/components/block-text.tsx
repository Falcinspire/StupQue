import { makeStyles } from "@material-ui/core";
import React from "react";
import { mergeClasses, mergeStyles } from "../utils/style-util";

const useStyles = makeStyles({
  line: { 
    borderLeft: '4px solid black', 
    paddingLeft: '12px'
  }
});

/**
 * An indented block for block-quote texts
 * 
 * @param props.children The elements inside of the block
 */
function BlockText(props: { children: JSX.Element, [x: string]: any }) {
  const { children, className, ...inheritedProps } = props;
  const classes = useStyles();
  return (
    <div className={mergeClasses([classes.line, className])} {...inheritedProps}>
      { children }
    </div>
  );
}

export default BlockText;
