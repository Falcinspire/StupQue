import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import { Button, createStyles, Typography, withStyles, WithStyles } from '@material-ui/core';

import TopBar from './top-bar';
import MainContent from './main-content';
import BlockText from './block-text';
import QuestionAdd from './question-add';
import { useRouteMatch } from 'react-router-dom';
import { getGroupSnapshot } from '../firebase/firebase-adapter';
import { Group } from '../firebase/firebase-models';
import { useCancellablePromise } from '../cancellable_promise/cancellable_promise';
import { getCurrentBrowserUrl } from '../utils/browser-util';

/**
 * Page for asking questions.
 */
function AskPage() {
  const match = useRouteMatch();
  const groupId = (match.params as any).groupId;
  
  const [title, setTitle] = useState('');

  const { cancellablePromise } = useCancellablePromise();

  useEffect(() => {
    // get group to populate title
    cancellablePromise(getGroupSnapshot(groupId)).then((snapshot: firebase.firestore.DocumentSnapshot<Group> | null) => {
      if (snapshot == null) {
        throw new Error('groupId doesn\'t exist');
      }
      setTitle(snapshot.data()!.name);
    }).catch((err: any) => {
      console.error(err);
    });
  }, []);

  return (
    <>
      <TopBar title={title} groupLink={getCurrentBrowserUrl()} />
      <MainContent>
        <>
          <QuestionAdd groupId={groupId} />
        </>
      </MainContent>
    </>
  );
}

export default AskPage;
