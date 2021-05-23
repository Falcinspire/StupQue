import { DateTime } from 'luxon';
import firebase from 'firebase';
import 'firebase/firestore';

import { Question, Response } from '../firebase/firebase-models';

/**
 * Tests if the question is considered "new"
 * 
 * @param question The question
 */
export function isQuestionNew(question: Question) {
    const curDatetime = DateTime.fromJSDate(question.datetime.toDate());
    const baselinDatetime = DateTime.now().minus({ hours: 4 });
    return curDatetime.diff(baselinDatetime).milliseconds > 0;
}

type HasFirebaseDateTime = { datetime: firebase.firestore.Timestamp };

/**
 * Compares the timing of two objects
 * 
 * @param a An object with a datetime
 * @param b An object with a datetime
 */
export function compareDatetime(a: HasFirebaseDateTime, b: HasFirebaseDateTime) {
    const aDatetime = DateTime.fromJSDate(a.datetime.toDate());
    const bDatetime = DateTime.fromJSDate(b.datetime.toDate());
    if (aDatetime < bDatetime) return 1;
    else if (aDatetime > bDatetime) return -1;
    else return 0;
};

type HasVotes = { upvotes: number, flags: number };
/**
 * Compares two objects by vote score. Flags are weighted higher
 * than upvotes by design.
 * 
 * @param a An object with votes
 * @param b An object with votes
 */
export function compareVote(a: HasVotes, b: HasVotes) {
    // flags are weighted heavier than upvotes
    const aScore = a.upvotes - 3 * a.flags;
    const bScore = b.upvotes - 3 * b.flags;
    if (aScore > bScore) return -1;
    if (aScore < bScore) return 1;
    else return 0;
};

/**
 * Comparison function for questions. Compares by vote score, 
 * breaking ties by earlier post time.
 * 
 * @param a A question
 * @param b A question
 */
export function compareQuestions(a: Question, b: Question) {
    const voteScore = compareVote(a, b);
    if (voteScore !== 0) return voteScore;
    return compareDatetime(a, b);
};

/**
 * Aggregates the list of questions into two groups by time posted. Questions
 * posted recently are sorted into one group, with all of the other questions
 * falling into the second.
 * 
 * @param list The list of questions
 */
export function groupQuestionsByNewStatus(list: Question[]) {
    let newGroup = [] as Question[];
    let oldGroup = [] as Question[];

    list.forEach((question) => {
        if (isQuestionNew(question)) {
            newGroup.push(question);
        } else {
            oldGroup.push(question);
        }
    });

    return {
        oldGroup,
        newGroup
    }
}

/**
 * Sorts a list of questions by votes. If the vote scores for 
 * two questions is the same, the tie is broken by earlier post
 * time.
 */
export function sortQuestions(list: Question[]) {
    return list.sort(compareQuestions);
}

/**
 * Sorts a list of responses by vote counts only. The same
 * list is mutated and returned.
 * 
 * @param list The list of responses
 */
export function sortResponses(list: Response[]) {
    return list.sort(compareVote);
}
