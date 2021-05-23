import React from 'react';
import { Card, CardActions, CardContent, IconButton } from '@material-ui/core';
import { Flag, Reply, ThumbUp } from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import { voteQuestion } from '../firebase/firebase-adapter';
import { Question } from '../firebase/firebase-models';
import { getGroupStorageEditor } from '../localmemory/localmemory';
import { renderTextWithNewlines } from '../utils/typograph-util';
import DateTimeIndicator from './datetime-indicator';
import NewIndicator from './new-indicator';
import IconCounter from './icon-counter';

/**
 * 
 * @param props.groupId The id of the group
 * @p
 */
const QuestionCard = (props: { groupId: string, question: Question, isNew: boolean, showReply: boolean }) => {
    const { groupId, question, isNew, showReply } = props;
    const { text, responses, upvotes, flags, datetime } = question;

    const location = useLocation();

    const upvoteQuestion = () => {
      // get local storage handler
      const questionEditor = getGroupStorageEditor(groupId).question(question.id!);
      const shouldIncrementUpvote = !questionEditor.hasUpvoted();
      voteQuestion('upvote', shouldIncrementUpvote, groupId, question.id!);
      // update local storage
      questionEditor.setHasUpvoted(!questionEditor.hasUpvoted());
    }
    
    const downvoteQuestion = () => {
      // get local storage handler
      const questionEditor = getGroupStorageEditor(groupId).question(question.id!);
      const shouldIncrimentFlags = !questionEditor.hasFlagged();
      voteQuestion('flag', shouldIncrimentFlags, groupId, question.id!);
      // update local storage
      questionEditor.setHasFlagged(!questionEditor.hasFlagged());
    }

    return (
        <Card elevation={3} style={{ margin: '0px', borderLeft: isNew ? '2px solid green' : undefined }}>
        <CardContent style={{ paddingBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {
              isNew ? (
                <NewIndicator />
              ) : (
                null
              )
            }
            <DateTimeIndicator datetime={datetime} />
          </div>
          { renderTextWithNewlines(text) }
        </CardContent>
        <CardActions disableSpacing style={{ paddingTop: 0 }}>
          <div style={{display: 'grid', gridTemplateColumns: 'auto auto 1fr', columnGap: '4px', width: '100%'}}>
            <IconCounter aria-label="upvote" value={upvotes} onClick={upvoteQuestion}>
              <ThumbUp />
            </IconCounter>
            <IconCounter aria-label="flag" value={flags} onClick={downvoteQuestion}>
              <Flag />
            </IconCounter>
            { showReply ? (
              <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <IconButton aria-label="reply" component={Link} to={`${location.pathname}/questions/${question.id!}`}>
                  <Reply />
                </IconButton>
              </div>
            ) : (
              <div />
            )}
          </div>
        </CardActions>
      </Card>
    )
};

export default QuestionCard;