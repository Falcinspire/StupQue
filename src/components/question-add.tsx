import React, { useCallback, useState } from "react";
import { Button, Card, CardActions, CardContent, makeStyles, TextField } from '@material-ui/core';
import { useHistory } from "react-router";
import { addNewQuestion } from "../firebase/firebase-adapter";

// style definitions
const useStyles = makeStyles({
  card: {
    marginTop: '24px', 
    marginBottom: '24px'
  },
  actionContainer: {
    display: 'flex', 
    justifyContent: 'flex-end'
  },
  buttonStyle: {
    marginTop: '8px' 
  }
});

/**
 * A card with the responsibility of adding questions to the group.
 * 
 * @param props.groupId The id of the group
 */
function QuestionAdd(props: { groupId: string }) {
  const { groupId } = props;

  const [text, setText] = useState('');
  const history = useHistory();
  const classes = useStyles();

  // handle changing text state
  const onChangeQuestionText = useCallback((event: any) => {
    setText(event.target.value);
  }, []);

  // handle adding question
  const onSubmitQuestion = useCallback((event: any) => {
    // stop refresh
    event.preventDefault();
    // add question     
    addNewQuestion(groupId, text)
      .then(() => {
        history.push(`/groups/${groupId}`);
      })
      .catch(err => console.error(err));
  }, [text]);
  
  return (
    <Card className={classes.card}>
      <form onSubmit={onSubmitQuestion}>
        <CardContent>
            <TextField 
              value={text} 
              onChange={onChangeQuestionText} 
              placeholder={'Ask a question here.'} 
              multiline 
              fullWidth 
            />
        </CardContent>
        <CardActions className={classes.actionContainer} >
          <Button 
            className={classes.buttonStyle} 
            type='submit'>
              Submit
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}

export default QuestionAdd;
