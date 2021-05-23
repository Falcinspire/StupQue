import firebase from "firebase/app";

import 'firebase/firestore';
import { FirebaseDocument } from "./firebase-models";

export const converter = <T extends FirebaseDocument>() => ({
  toFirestore: (data: Partial<T>) => {
    delete data.id;
    return data;
  },
  fromFirestore: (snap: firebase.firestore.QueryDocumentSnapshot) => {
    let data = snap.data() as T;
    data.id = snap.id;
    return data;
  }
});

export const converterWithTransformers = <T extends FirebaseDocument>(transformers: { toTransformer: (data: Partial<T>) => Partial<T>, fromTransformer: (data: T) => T }) => ({
  toFirestore: (data: Partial<T>) => {
    delete data.id;
    return transformers.toTransformer(data);
  },
  fromFirestore: (snap: firebase.firestore.QueryDocumentSnapshot) => {
    let data = snap.data() as T;
    data = transformers.fromTransformer(data);
    data.id = snap.id;
    return data;
  }
});