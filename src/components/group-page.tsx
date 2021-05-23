import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import { CircularProgress, createStyles, Fab, makeStyles, Theme, withStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useLocation, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import { getGroupSnapshot, registerGroupListener } from '../firebase/firebase-adapter';
import { Group, Question } from '../firebase/firebase-models';
import MainContent from './main-content';
import QuestionsList from './questions-list';
import TopBar from './top-bar';
import CenterContainer from './center-container';
import { upsertRecentGroup } from '../localmemory/localmemory';
import { useCancellablePromise } from '../cancellable_promise/cancellable_promise';
import { DateTime } from 'luxon';
import { getCurrentBrowserUrl } from '../utils/browser-util';

const useStyles = makeStyles((theme: Theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

/**
 * Shows a list of questions that can be interacted with. The list of questions
 * updates on any change to any of the questions. This can be upvotes, flags, or
 * new responses.
 */
function GroupPage() {
  const match = useRouteMatch();
  const groupId = (match.params as any).groupId;
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as any);
  const [questions, setQuestions] = useState([] as Question[]);
  const [title, setTitle] = useState('');
  
  const classes = useStyles();

  const { cancellablePromise } = useCancellablePromise();

  useEffect(() => {
    const unregister = registerGroupListener(groupId, (question: Question, type: string) => {
      if (type === 'added') {
        setQuestions((state) => { return [...state, question]; });
      } else if (type == 'modified') {
        setQuestions((state) => { return state.map((it) => it.id === question.id ? question : it); });
      } else {
        console.warn('Unsupported listen type: ' + type);
      }
    });

    // grab the group to populate the title and include in recently visited groups
    cancellablePromise(getGroupSnapshot(groupId)).then((snapshot: firebase.firestore.DocumentSnapshot<Group> | null) => {
      if (snapshot == null) {
        throw new Error('groupId doesn\'t exist');
      }
      const name = snapshot.data()!.name;
      setTitle(name);
      upsertRecentGroup({
        name,
        id: groupId,
        datetime: DateTime.now().toISO()
      });
    }).catch((err: any) => {
      console.error(err);
      setError(err);
    }).finally(() => {
      setLoading(false);
    });
    return unregister;
  }, []);

  return (
    <>
      <TopBar title={title} groupLink={getCurrentBrowserUrl()} />
      <MainContent>
          {
            loading ? (
              <CenterContainer>
                <CircularProgress />
              </CenterContainer>
            ) : (
              error ? (
                <p>{error.message}</p>
              ) : (
                <>
                  <QuestionsList
                    groupId={groupId}
                    list={questions}
                  />
                </>
              )
            )
          }
      </MainContent>
      <Fab color="primary" className={classes.fab} component={Link} to={`${location.pathname}/ask`} aria-label="add">
        <Add />
      </Fab>
    </>
  );
}

export default GroupPage;
