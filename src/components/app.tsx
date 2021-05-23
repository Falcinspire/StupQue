import React from 'react';
import { createStyles, makeStyles, withStyles, WithStyles } from '@material-ui/core';
import {
  BrowserRouter as Router,
  Route, Switch
} from "react-router-dom";
import AboutPage from './about-page';
import AskPage from './ask-page';
import GroupPage from './group-page';
import HomePage from './home-page';
import PrimerPage from './primer-page';
import QuestionPage from './question-page';

const useStyles = makeStyles({
    root: {
      minWidth:'100vw',
      minHeight: '100vh',
      display: 'grid',
      gridTemplateRows: 'auto 1fr'
    }
});

function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>    
      <Router>
        <Switch>
        <Route path="/groups/:groupId/questions/:questionId">
            <QuestionPage />
          </Route>
          <Route path="/groups/:groupId/ask">
            <AskPage />
          </Route>
          <Route path="/groups/:groupId">
            <GroupPage />
          </Route>
          <Route path="/about">
            <AboutPage />
          </Route>
          <Route path="/">
            <HomePage></HomePage>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
