/**
 * Handles memory in the browser's localstorage.
 * 
 * It was decided that the application would store voting and other
 * information on the client's browser. This module handles most, if not
 * all, of the storage and retrieval logic for this information.
 * 
 * Each group has its own key in localstorage with the name "group-<groupId>". Each
 * group storage tree contains voting information about questions and responses in
 * that group.
 * 
 * Recent groups are stored in localstorage for the home page of the app. If more than
 * 10 groups are ever stored, the oldest visited is removed.
 */

import { DateTime } from "luxon"; 

const SENTINAL_DATE_VALUE = DateTime.fromMillis(0).toISO();

/**
 * Stores information about a group
 */
type GroupStorage = {
    questions: { [x: string]: QuestionInteractionsStorage }
}

/**
 * Stores information about a question. This includes
 * if the user has voted or flagged this question. 
 * This also includes response storage.
 */
type QuestionInteractionsStorage = {
    responses: { [x: string]: ResponseInteractionsStorage },
    hasUpvoted: boolean,
    hasFlagged: boolean
};

/**
 * Stores information about a response. This includes
 * if the user has voted or flagged this response. 
 */
type ResponseInteractionsStorage = {
    hasUpvoted: boolean
    hasFlagged: boolean
};

/**
 * Creates an empty group storage
 */
function newGroupStorage(): GroupStorage {
    return { 
        questions: {} as { [x: string]: QuestionInteractionsStorage } 
    };
}

/**
 * Creates an empty question interactions storage
 */
function newQuestionInteractionsStorage(): QuestionInteractionsStorage {
    return {
        responses: {} as { [x: string]: ResponseInteractionsStorage },
        hasUpvoted: false,
        hasFlagged: false
    }
}

/**
 * Creates a new response interactions storage
 */
function newResponseInteractionsStorage(): ResponseInteractionsStorage {
    return {
        hasUpvoted: false,
        hasFlagged: false
    }
}

/**
 * Convenient object for editing group storage data or retrieving
 * question editors. All edits are immedietely saved
 * to local storage and reflected in future property
 * get functions.
 */
export class GroupStorageEditor {
    constructor(
        private groupId: string,
        public data: GroupStorage
    ) {}
    saveData() {
        localStorage.setItem(`group-${this.groupId}`, JSON.stringify(this.data));
    }
    question(questionId: string) {
        let question = null as QuestionInteractionsStorage | null;
        if (questionId in this.data.questions) {
            question = this.data.questions[questionId];
        } else {
            question = newQuestionInteractionsStorage();
            this.data.questions[questionId] = question;
            this.saveData();
        }
        return new QuestionEditor(question, this.saveData.bind(this));
    }
}

/**
 * Convenient object for editing question storage data or retrieving
 * response editors. All edits are immedietely saved
 * to local storage and reflected in future property
 * get functions.
 */
export class QuestionEditor {
    constructor(
        public data: QuestionInteractionsStorage,
        private saveGroup: () => void
    ) {}
    saveData() {
        this.saveGroup();
    }
    hasUpvoted() {
        return this.data.hasUpvoted;
    }
    setHasUpvoted(upvoted: boolean) {
        this.data.hasUpvoted = upvoted;
        this.saveGroup();
        return this;
    }
    hasFlagged() {
        return this.data.hasFlagged;
    }
    setHasFlagged(flagged: boolean) {
        this.data.hasFlagged = flagged;
        this.saveGroup();
        return this;
    }
    responses(responseId: string) {
        let response = null as ResponseInteractionsStorage | null;
        if (responseId in this.data.responses) {
            response = this.data.responses[responseId];
        } else {
            response = newResponseInteractionsStorage();
            this.data.responses[responseId] = response;
            this.saveData();
        }
        return new ResponseEditor(response, this.saveGroup);
    }
}

/**
 * Convenient object for editing response storage data. All edits are immedietely saved
 * to local storage and reflected in future property
 * get functions.
 */
export class ResponseEditor {
    constructor(
        public data: ResponseInteractionsStorage,
        private saveGroup: () => void
    ) {}
    saveData() {
        this.saveGroup();
    }
    hasUpvoted() {
        return this.data.hasUpvoted;
    }
    setHasUpvoted(upvoted: boolean) {
        this.data.hasUpvoted = upvoted;
        this.saveGroup();
        return this;
    }
    hasFlagged() {
        return this.data.hasFlagged;
    }
    setHasFlagged(flagged: boolean) {
        this.data.hasFlagged = flagged;
        this.saveGroup();
        return this;
    }
}

/**
 * Get the editor for the group to read or write updates.
 * 
 * @param groupId The id of the group
 */
export function getGroupStorageEditor(groupId: string): GroupStorageEditor {
    let groupJSON = localStorage.getItem(`group-${groupId}`) as string | null;
    let groupEditor = null as GroupStorageEditor | null;
    if (groupJSON === null) {
        groupEditor = new GroupStorageEditor(groupId, newGroupStorage());
        groupEditor.saveData();
    } else {
        groupEditor = new GroupStorageEditor(groupId, JSON.parse(groupJSON) as GroupStorage);
    }
    return groupEditor;
}

/**
 * A group that was recently visited.
 */
type RecentGroup = {
    name: string,
    id: string,
    datetime: string
};

/**
 * Get the groups that were recently visited from local storage. This will
 * automatically sort the recent groups by their last visited date.
 */
export function getRecentGroups() {
    let recentGroupsJSON = localStorage.getItem('recent-groups');
    let recentGroups = null as RecentGroup[] | null;
    if (!recentGroupsJSON) {
        recentGroups = [] as RecentGroup[];
        localStorage.setItem('recent-groups', JSON.stringify(recentGroups));
    } else {
        recentGroups = JSON.parse(recentGroupsJSON) as RecentGroup[];
    }
    recentGroups = recentGroups.sort(
        (a, b) => DateTime.fromISO(a.datetime).diff(DateTime.fromISO(b.datetime)).milliseconds
    );
    return recentGroups;
}

/**
 * Removes the oldest visited group on the list.
 * 
 * @param recentGroups The list of groups to remove an element from
 */
function removeOldest(recentGroups: RecentGroup[]) {
    //TODO test this function

    let oldest = recentGroups[0];
    for (const group of recentGroups) {
        if (DateTime.fromISO(group.datetime).diff(DateTime.fromISO(oldest.datetime)).milliseconds < 0) {
            oldest = group;
        }
    }
    recentGroups = recentGroups.filter(it => it.id !== oldest.id);
    return recentGroups;
}

/**
 * Adds a group to the list of recently visited groups in localstorage. If 
 * the group already exists, its name and last visited date are updated
 * to the new values. 
 * 
 * @param recent The group to add
 */
export function upsertRecentGroup(recent: RecentGroup) {
    let recentGroups = getRecentGroups();
    let modifyGroup = null as RecentGroup | null;
    for (let recentGroup of recentGroups) {
        if (recentGroup.id === recent.id) {
            modifyGroup = recentGroup;
            break;
        }
    }
    if (modifyGroup) {
        modifyGroup.name = recent.name;
    } else {
        recentGroups.push(recent);
        if (recentGroups.length > 10) {
            recentGroups = removeOldest(recentGroups);
        }
    }
    localStorage.setItem('recent-groups', JSON.stringify(recentGroups));
}

// export function filterOldDates(datelist: DateTime[], startDaysAgo: number) {
//     const cutoff = DateTime.now().minus({ days: startDaysAgo });
//     return datelist.filter((it) => it.diff(cutoff).milliseconds > 0);
// }

// export function getRecentDatetimeList(storageKey: string) {
//     let recentJSON = localStorage.getItem(`recent-${storageKey}`);
//     let isoData = null as string[] | null;
//     if (recentJSON) {
//         isoData = JSON.parse(recentJSON) as string[];
//     } else {
//         isoData = [] as string[];
//     }
//     let datetimeData = isoData.map(it => DateTime.fromISO(it));
//     return filterOldDates(datetimeData, 7);
// }