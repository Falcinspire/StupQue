import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { Question } from '../firebase/firebase-models';
import { sortResponses } from '../utils/question-util';
import QuestionCard from './question-card';
import ResponseCard from './response-card';
import ThreadConnector from './thread-connector';

//TODO sanitizer
function QuestionPreview(props: { groupId: string, question: Question, isNew: boolean }) {
  const { groupId, question, isNew } = props;
  const { responses } = question;

  const renderLadder = () => {
    if (responses.length == 0) {
      return null;
    }

    const sortedResponses = sortResponses(responses);
    const [firstResponse, ...otherResponses] = sortedResponses;

    if (otherResponses.length == 0) {
      return (
        <>
          <ResponseCard groupId={groupId} questionId={question.id!} response={firstResponse} disableVoting={true} />
        </>
      );
    }

    return (
      <>
        <ResponseCard groupId={groupId} questionId={question.id!} response={firstResponse} disableVoting={true} />
        <ThreadConnector />
        <Card elevation={0}>
          <CardContent style={{ padding: '8px' }}>
            <Typography>
              {otherResponses.length} other {otherResponses.length == 1 ? 'response' : 'responses'}
            </Typography>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <div style={{ marginBottom: '32px' }}>
      <QuestionCard groupId={groupId} question={question} isNew={isNew} showReply={true} />
      { renderLadder() }
    </div>
  );
}

export default QuestionPreview;
