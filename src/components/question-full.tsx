import React from 'react';
import { Question } from '../firebase/firebase-models';
import { sortResponses } from '../utils/question-util';
import QuestionCard from './question-card';
import ResponseCard from './response-card';

function QuestionFull(props: { groupId: string, question: Question, isNew: boolean }) {
  const { groupId, question, isNew } = props;
  const { responses } = question;

  const sortedResponses = sortResponses(responses);

  return (
    <div>
      <QuestionCard groupId={groupId} question={question} isNew={isNew} showReply={false} />
      {
        sortedResponses.map((it, idx) => <ResponseCard key={idx} groupId={groupId} questionId={question.id!} response={it} disableVoting={false} />)
      }
    </div>
  );
}

export default QuestionFull;
