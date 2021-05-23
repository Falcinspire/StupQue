import React, { ReactElement, useEffect, useReducer, useState } from 'react';

import { createStyles, makeStyles, withStyles, WithStyles } from '@material-ui/core';
import TopBar from './top-bar';

const useStyles = makeStyles({
    root: {
      display: 'grid', 
      gridTemplateColumns: '1fr', 
      justifyItems: 'center', 
      width:'100%', 
      height: '100%',
      backgroundColor: '#DDF'
    },
    container: {
      width: 'min(1000px, 90vw)', 
      padding: '24px 12px'
    }
});

function MainContent(props: { children: JSX.Element }) {
  const { children } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        { children }
      </div>
    </div>
  );
}

export default MainContent;
