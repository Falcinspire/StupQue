import React from 'react';
import { createStyles, makeStyles, Typography, withStyles, WithStyles } from '@material-ui/core';
import { APP_NAME } from '../utils/app-constants';
import MainContent from './main-content';
import TopBar from './top-bar';

const useStyles = makeStyles({
  paragraph: {
    marginTop: '24px',
    marginBottom: '24px'
  }
});

/**
 * Page giving an overview of how the app is intended
 * to be used.
 */
function PrimerPage() {
  const classes = useStyles();
  return (
    <>
      <TopBar title={APP_NAME} />
      <MainContent>
        <>
          <Typography variant='body1' className={classes.paragraph}>
            TODO
          </Typography>
        </>
      </MainContent>
    </>
  );
}

export default PrimerPage;
