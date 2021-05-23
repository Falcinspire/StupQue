/**
 * Contains models for the Firestore objects.
 * 
 * A current drawback is the typings in this module do not 
 * support firebase.firestore.FieldValue types.
 */

import firebase from 'firebase/app';
import 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

/**
 * Any object with an optional id field
 */
export type FirebaseDocument = {
    id?: string
};

/**
 * A Group Firestore document
 */
export type Group = {
    id?: string,
    createdDate: firebase.firestore.Timestamp,
    name: string
};

/**
 * A Question Firestore document
 */
export type Question = {
    id?: string,
    text: string,
    responses: Response[],
    upvotes: number,
    flags: number,
    datetime: firebase.firestore.Timestamp
};

/**
 * A Response Firestore document
 */
export type Response = {
    id: string,
    text: string,
    upvotes: number,
    flags: number,
    datetime: firebase.firestore.Timestamp
};

/**
 * Simple Group constructor. The creation date is automatically
 * set to the current time.
 * 
 * @param name The name of the group being created
 */
export function newGroup(name: string): Group {
    return {
        createdDate: firebase.firestore.Timestamp.now(),
        name             
    };
}

/**
 * Simple question constructor. All fields are given default values
 * except for text and datetime, which are filled in with the argument
 * and current time, respectively.
 * 
 * @param text The text of the question
 */
export function newQuestion(text: string): Question {
    return {
        text,
        responses: [],
        upvotes: 0,
        flags: 0,
        datetime: firebase.firestore.Timestamp.now()
    };
}

/**
 * Simple Response constructor. All fields are given default values
 * except for text, id, and datetime, which are filled in with the argument,
 * a new v4 uuid, and the current time, respectively.
 * 
 * @param text The text for the response. 
 */
export function newResponse(text: string): Response {
    return {
        id: uuidv4(),
        text,
        upvotes: 0,
        flags: 0,
        datetime: firebase.firestore.Timestamp.now()
    };
}