import React, { useEffect, useState } from 'react';
import { Button, Card, CardActions, CardContent, CircularProgress, TextField } from '@material-ui/core';
import firebase from 'firebase';
import 'firebase/firestore';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { useCancellablePromise } from '../cancellable_promise/cancellable_promise';
import { addNewResponse, getGroupSnapshot, registerQuestionUpdateListener } from '../firebase/firebase-adapter';
import { Group, Question } from '../firebase/firebase-models';
import { isQuestionNew } from '../utils/question-util';
import MainContent from './main-content';
import QuestionFull from './question-full';
import TopBar from './top-bar';
import CenterContainer from './center-container';
import { getCurrentBrowserUrl } from '../utils/browser-util';

/**
 * The page where users interact with a question. This is where a question
 * can be upvoted, flagged, or responded to. Responses can also be upvoted
 * and flagged.
 */
function QuestionPage() {
  const match = useRouteMatch();
  const groupId = (match.params as any).groupId;
  const questionId = (match.params as any).questionId;

  const [question, setQuestion] = useState(null as (Question | null));
  const [response, setResponse] = useState('');
  const [title, setTitle] = useState('');

  const { cancellablePromise } = useCancellablePromise();

  useEffect(() => {
    // listen for question updates
    const unregister = registerQuestionUpdateListener(
      groupId,
      questionId,
      (question: Question) => {
        setQuestion(question)
      }
    );

    // grab group to populate the title
    cancellablePromise(getGroupSnapshot(groupId))
      .then((snapshot: firebase.firestore.DocumentSnapshot<Group> | null) => {
        if (snapshot == null) {
          throw new Error("groupId doesn't exist")
        }
        setTitle(snapshot.data()!.name);
      })
      .catch((err: any) => {
        console.error(err)
      });

    // unregister when component is unmounted
    return unregister;
  }, []);

  return (
    <>
      <TopBar title={title} groupLink={getCurrentBrowserUrl()} />
      <MainContent>
        <>
        {
          question ? (
            <>
              <Card style={{ marginBottom: '24px' }}>
                <CardContent>
                  <TextField value={response} onChange={(event) => { setResponse(event.target.value); }} placeholder={'Respond here.'} fullWidth multiline></TextField>
                </CardContent>
                <CardActions style={{ display: 'flex', justifyContent: 'flex-end'}}>
                  <Button onClick={() => {
                    addNewResponse(groupId, questionId, response);
                    setResponse('');
                  }}>
                    Submit
                  </Button>
                </CardActions>
              </Card>
              <QuestionFull groupId={groupId} question={question} isNew={isQuestionNew(question)} />
            </>
          ) : (
            <CenterContainer>
              <CircularProgress />
            </CenterContainer>
          )
        }
        </>
      </MainContent>
    </>
  );
}

export default QuestionPage;
