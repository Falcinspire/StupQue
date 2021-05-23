import React from 'react';
import { Card, CardActions, CardContent, IconButton } from '@material-ui/core';
import { Flag, ThumbUp } from '@material-ui/icons';
import { voteResponse } from '../firebase/firebase-adapter';
import { Response } from '../firebase/firebase-models';
import { getGroupStorageEditor } from '../localmemory/localmemory';
import { renderTextWithNewlines } from '../utils/typograph-util';
import DateTimeIndicator from './datetime-indicator';
import ThreadConnector from './thread-connector';
import IconCounter from './icon-counter';

//TODO sanitizer
//TODO no grid in action area?

/**
 * Shows a response to be viewed and optionally interacted with. If <code>disableVoting</code> is 
 * true, the buttons will be disabled and the totals will be visible but greyed out.
 * 
 * @param props.groupId The id of the current group
 * @param props.questionId The id of the current question
 * @param props.response The response to show
 * @param props.disabledVoting Should the user be allowed to upvote/flag the response
 */
function ResponseCard(props: { groupId: string, questionId: string, response: Response, disableVoting: boolean }) {
  const { groupId, questionId, response, disableVoting } = props;
  const { text, upvotes, flags, datetime } = response;

  const upvoteResponse = () => {
    // get local storage handler
    const responseEditor = getGroupStorageEditor(groupId).question(questionId).responses(response.id);
    const shouldIncrementUpvote = !responseEditor.hasUpvoted();
    voteResponse('upvote', shouldIncrementUpvote, groupId, questionId, response.id);
    // update local storage
    responseEditor.setHasUpvoted(!responseEditor.hasUpvoted());
  }
  
  const downvoteResponse = () => {
    // get local storage handler
    const responseEditor = getGroupStorageEditor(groupId).question(questionId).responses(response.id);
    const shouldIncrimentFlags = !responseEditor.hasFlagged();
    voteResponse('flag', shouldIncrimentFlags, groupId, questionId, response.id);
    // update local storage
    responseEditor.setHasFlagged(!responseEditor.hasFlagged());
  }

  return (
    <>
      <ThreadConnector />
      <Card elevation={0}>
        <CardContent style={{ paddingBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <DateTimeIndicator datetime={datetime} />
          </div>
          { renderTextWithNewlines(text) }
        </CardContent>
        <CardActions disableSpacing style={{ paddingTop: 0 }}>
          <IconCounter aria-label="upvotes" disabled={disableVoting} value={upvotes} onClick={upvoteResponse} >
            <ThumbUp />
          </IconCounter>
          <IconCounter aria-label="flags" disabled={disableVoting} value={flags} onClick={downvoteResponse}>
            <Flag />
          </IconCounter>
        </CardActions>
      </Card>
    </>
  );
}

export default ResponseCard;
