import React from 'react';

import { createStyles, Typography, withStyles, WithStyles } from '@material-ui/core';

import TopBar from './top-bar';
import MainContent from './main-content';
import BlockText from './block-text';

const styles = createStyles({
  paragraph: {
    marginTop: '24px'
  }
});
type StylesType = WithStyles<typeof styles>['classes'];

function AboutPage(props: { classes: StylesType }) {
  const { classes } = props;
  return (
    <>
      <TopBar title={'StupidQ'} />
      <MainContent>
        <>
          <Typography variant='body1' className={classes.paragraph}>
            As much as it is downplayed, asking questions is hard. It takes a solid understanding of material
            to ask a <i>good</i> question. This is great for scientific presentations, where the audience is composed of experts ready to 
            critique ideas. But perhaps not for classrooms, where the goal is to learn material moreso than challenge it.
          </Typography>
          <Typography variant='body1' className={classes.paragraph}>
            Every asked question incurs an opportunity cost - whether that be the teacher's time to teach
            or the teacher's time to address other (probably better) questions. And, if the question turns out to be <i>really stupid</i>,
            your name could be tarnished to most of the class. Sometimes, there are few interactions between students of a course. You wouldn't
            want to screw up any of the few interactions you have.
          </Typography>
          <Typography variant='body1' className={classes.paragraph}>
            I've been on Discord long enough to witness a culture that brewed to encourage questions - self degration. 
            It's a popular meme on Discord channels that students are always struggling with classes and are going for the "C's get degrees" 
            strategy of learning. The bar is set low enough that the social cost of asking a stupid question is where the bar is already set.
          </Typography>
          <Typography variant='body1' className={classes.paragraph}>
            The other side of the coin should not be forgotten either. Although answering questions is <i>far easier</i> than asking 
            them, there are costs to doing so as well. Anyone who has answered a question on Stack Overflow knows the feeling. If your answer 
            isn't up to par the other SO users will quickly let you know...
          </Typography>
          <Typography variant='body1' className={classes.paragraph}>
            Well, here is an anonymous, real-time Q&A feed. Stupid people answering stupid questions. And remember -
          </Typography>
          <BlockText className={classes.paragraph}>
            <Typography variant='body1'>
              "Other students had the same dumb question as you. You were just brave enough to ask it." - StupidQ
            </Typography>
          </BlockText>
          <Typography variant='body1' color={'error'} className={classes.paragraph}>
            WARNING: This app is in beta. Because the developer wanted to remain in the free tier of the cloud provider,
            there are likely data security vulnerabilities in the app. These vulnerabilities should not impact the safety of using 
            the app (e.g malware), but if a question suddenly recieves 1000 upvotes and all the replies go missing... politely
            tell your hacker friend to screw off.
          </Typography>
        </>
      </MainContent>
    </>
  );
}

export default withStyles(styles)(AboutPage);
