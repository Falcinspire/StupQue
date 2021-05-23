import React from 'react';
import { Question } from '../firebase/firebase-models';
import { groupQuestionsByNewStatus, sortQuestions } from '../utils/question-util';
import QuestionPreview from './question-preview';

/**
 * A list of question previews
 * 
 * @param groupId The id of the group the questions belong to
 * @param list The list of questions to show
 */
function QuestionsList(props: { groupId: string, list: Question[]}) {
  const { groupId, list } = props;

  const { newGroup, oldGroup } = groupQuestionsByNewStatus(list);

  const newGroupSorted = sortQuestions(newGroup);
  const oldGroupSorted = sortQuestions(oldGroup);

  return (
    <>
      {
        newGroupSorted.map(it => 
          <QuestionPreview key={it.id!} groupId={groupId} question={it} isNew={true} />
        )
      }
      {
        oldGroupSorted.map(it => 
          <QuestionPreview key={it.id!} groupId={groupId} question={it} isNew={false} />
        )
      }
    </>
  );
}

export default QuestionsList;
