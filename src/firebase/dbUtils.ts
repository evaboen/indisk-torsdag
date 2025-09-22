import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
  doc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export type IArrangement = {
  id?: string;
  startTime: string;
  title: string;
  description: string;
  createdAt: Date;
  createdByEmail?: string;
  attendingEmails?: string[];
};

export type IComment = {
  id: string;
  arrangementID: string;
  createdAt: Timestamp;
  createdBy: string;
  text: string;
};

export const fetchData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Arrangements"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(data); // Array of documents from the collection
    return data as IArrangement[];
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};

export const addArrangement = async (arrangement: IArrangement) => {
  try {
    const docRef = await addDoc(collection(db, "Arrangements"), arrangement);
    console.log("Document written with ID: ", docRef.id);
    // Update the same document with its id
    await updateDoc(docRef, { id: docRef.id });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const attendArrangement = async (id: string, email: string) => {
  try {
    const docRef = doc(db, "Arrangements", id);

    await updateDoc(docRef, {
      attendingEmails: arrayUnion(email),
    });
  } catch (error) {
    console.error("Error attending arrangement: ", error);
  }
};

export const deleteArrangement = async (id: string) => {
  try {
    const docRef = doc(db, "Arrangements", id);
    await deleteDoc(docRef);
    console.log(`Arrangement ${id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting arrangement: ", error);
  }
};

export const addComment = async (
  arrangementId: string,
  text: string,
  createdBy: string
) => {
  try {
    await addDoc(collection(db, "comments"), {
      arrangementId,
      text,
      createdBy,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error adding comment:", err);
  }
};

export const subscribeComments = (
  arrangementId: string,
  callback: (comments: any[]) => void
) => {
  const q = query(
    collection(db, "comments"),
    where("arrangementId", "==", arrangementId),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(comments);
  });
};
