/**
 * The main module for saving and retrieving data from Firebase.
 */

import firebase from 'firebase/app';
import 'firebase/firestore';
import { sleep } from '../utils/loading-util';
import { converter, converterWithTransformers } from './firebase-converter-util';
import { Group, newGroup, newResponse, newQuestion, Question } from './firebase-models';

/**
 * Get the group collection
 */
function getGroupCollection() {
    return firebase.firestore()
        .collection('groups')
        .withConverter(converter<Group>());
}

/**
 * Get the snapshot for the group, or null if not present
 * 
 * @param groupId The id of the group
 */
export async function getGroupSnapshot(groupId: string) {
    const group = await getGroupCollection().doc(groupId).get();
    return group.exists ? group : null;
}

/**
 * Get the question collection for a particular group.
 * 
 * @param groupRef A reference to a group collection
 */
function getQuestionCollection(groupRef: firebase.firestore.DocumentReference) {
    return groupRef
        .collection('questions')
        .withConverter(
            converterWithTransformers<Question>({
                toTransformer: (question) =>  question.text ? ({ ...question, text: toFirebaseText(question.text) }) : question,
                fromTransformer: (question) => question.text ? ({ ...question, text: fromFirebaseText(question.text) }) : question
            })
        );
}

/**
 * Get a Question by a group id and question id
 * 
 * @param groupId The group id
 * @param questionId The question id
 */
export async function getQuestion(groupId: string, questionId: string) {
    const question = await getQuestionCollection(getGroupCollection().doc(groupId)).doc(questionId).get();
    const data = question.data();
    return data ? data : null;
}

/**
 * A listener for question updates.
 * 
 * @param doc The changing Question
 * @param type The Firebase string for the current change
 */
type GroupListener = (doc: Question, type: string) => void;

/**
 * Register a question snapshot listener
 * 
 * @param groupId The group id
 * @param listener The listener
 * 
 * @returns A callback to unregister the listener
 */
export function registerGroupListener(groupId: string, listener: GroupListener) {
    return getQuestionCollection(getGroupCollection().doc(groupId))
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                listener(change.doc.data(), change.type);
            });
        });
}

/**
 * A listener for updates to a particular question.
 * 
 * @param doc The new question
 */
type QuestionListener = (doc: Question) => void;

/**
 * Register a listener for changes to a particular question
 * 
 * @param groupId The id of the group
 * @param questionId The id of the question
 * @param listener The listener
 * 
 * @returns A callback to unregister the listener
 */
export function registerQuestionUpdateListener(groupId: string, questionId: string, listener: QuestionListener) {
    return getQuestionCollection(getGroupCollection().doc(groupId)).doc(questionId)
        .onSnapshot((snapshot) => {
            listener(snapshot.data()!);
        });
}

/**
 * Create a new group
 * 
 * @param name The name of the new group
 */
export async function startNewGroup(name: string) {
    const collection = getGroupCollection();
    return (await collection.add(newGroup(name))).id;
}

/**
 * Adds a new question to the group with the group id
 * 
 * @param groupId The group id
 * @param text The question text
 */
export async function addNewQuestion(groupId: string, text: string) {
    const question = newQuestion(text);
    const collection = await getQuestionCollection(
        await getGroupCollection().doc(groupId)
    );
    await collection.add(question);
}

/**
 * Increments or decrements a counter for a question
 * 
 * @param type Which counter to change
 * @param up Should the value be increased or decreased by 1
 * @param groupId The group id
 * @param questionId The question id
 */
export async function voteQuestion(type: 'upvote' | 'flag', up: boolean, groupId: string, questionId: string) {
    const collection = await getQuestionCollection(
        await getGroupCollection().doc(groupId)
    );
    // This could be replaced with firestore.FieldValue.increment() if typings in this app
    // are improved. increment() would probably not work for responses, however.
    firebase.firestore().runTransaction(async (transaction) => {
        const curRef = collection.doc(questionId);
        const current = (await transaction.get(curRef)).data()!;
        await transaction
            .set(curRef, 
                type === 'upvote' ? { upvotes: current.upvotes + (up ? 1 : -1) } : { flags : current.flags + (up ? 1 : -1) },
                { merge: true }
            );
    });
}

/**
 * Increments or decrements a counter for a response
 * 
 * @param type Which counter to change
 * @param up Should the value be increased or decreased by 1
 * @param groupId The group id
 * @param questionId The question id
 * @param responseId The response id
 */
export async function voteResponse(type: 'upvote' | 'flag', up: boolean, groupId: string, questionId: string, responseId: string) {
    const collection = await getQuestionCollection(
        await getGroupCollection().doc(groupId)
    );
    firebase.firestore().runTransaction(async (transaction) => {
        const curRef = collection.doc(questionId);
        const current = (await transaction.get(curRef)).data()!;
        const newResponses = current.responses.map((it) => {
            if (it.id === responseId) {
                return {
                    ...it,
                    upvotes: type === 'upvote' ? it.upvotes + (up ? 1 : -1) : it.upvotes,
                    flags: type !== 'upvote' ? it.flags + (up ? 1 : -1) : it.flags
                };
            } else {
                return it;
            }
        });
        await transaction
            .set(curRef, 
                { responses: newResponses },
                { merge: true }
            );
    });
}

/**
 * Add a new response to a question.
 * 
 * @param groupId The group id
 * @param questionId The question id
 * @param text The text
 */
export async function addNewResponse(groupId: string, questionId: string, text: string) {
    const collection = await getQuestionCollection(
        await getGroupCollection().doc(groupId)
    );
    const response = newResponse(text);
    firebase.firestore().runTransaction(async (transaction) => {
        const curRef = collection.doc(questionId);
        const current = (await transaction.get(curRef)).data()!;
        await transaction
            .set(curRef, 
                { responses: [...current.responses, response] },
                { merge: true }
            );
    });
}

/**
 * Transforms the text into a Firebase-compatible string. Right now,
 * this only makes newlines explicit.
 * 
 * @param text The text to transform to a Firebase-compatible string
 * 
 * @returns A Firebase-compatible string
 */
function toFirebaseText(text: string) {
    return text.replace('\n', '\\n');
}

/**
 * Transforms the text from a Firebase-compatible string. Right now,
 * this only makes newlines implicit.
 * 
 * @param text The text to transform from a Firebase-compatible string
 * 
 * @returns A normal string
 */
function fromFirebaseText(text: string) {
    return text.replace('\\n', '\n');
}