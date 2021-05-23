import React, { useState } from 'react';
import { Button, Card, CardActionArea, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, makeStyles, Paper, TextField, Typography, withStyles, WithStyles } from '@material-ui/core';
import MainContent from './main-content';
import TopBar from './top-bar';
import CenterContainer from './center-container';
import { startNewGroup } from '../firebase/firebase-adapter';
import { useHistory } from 'react-router';
import { getRecentGroups } from '../localmemory/localmemory';
import { ArrowForward } from '@material-ui/icons';
import { Link } from 'react-router-dom';

function HomePage() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const history = useHistory();

  const recentGroups = getRecentGroups();

  return (
    <>
      <TopBar title={'StupidQ'} />
      <MainContent>
        <CenterContainer contentFillWidth>
          <>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => {setOpen(true);}}
                >
                  Start A New Group
                </Button>
              </div>
            </div>
            <div>
              <Typography variant='h5' style={{ marginBottom: '12px' }}>Recent Groups</Typography>
              { 
                recentGroups.map(recentGroup => (
                  <Card style={{ marginBottom: '12px' }}>
                    <Link to={`/groups/${recentGroup.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      <CardActionArea 
                        style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '12px' }}
                      >
                        <Typography variant='body1'>
                          { recentGroup.name }
                        </Typography>
                        <ArrowForward />
                      </CardActionArea>
                    </Link>
                  </Card>
                ))
              }
            </div>
          </>
        </CenterContainer>
      </MainContent>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <form 
          onSubmit={(event) => {
            event.preventDefault();
            startNewGroup(name)
              .then((groupId: string) => {
                setOpen(false);
                history.push(`/groups/${groupId}`);
              })
              .catch((err: Error) => console.error(err))
          }}
        >
          <DialogTitle>
            Create a new anonymous Q&A group
          </DialogTitle>
          <DialogContent>
            <TextField 
            label="Group Name" 
            value={name} 
            required 
            fullWidth 
            error={name.length === 0}
            onChange={(event) => { setName(event.target.value); }} 
          />
          </DialogContent>
          <DialogActions>
            <Button type="submit" disabled={name.length === 0}>Confirm</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default HomePage;
