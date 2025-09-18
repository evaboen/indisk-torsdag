import { collection, getDocs ,addDoc,updateDoc, arrayUnion, doc} from "firebase/firestore";
import { db } from "./firebase";

export type IArrangement = {
    id?: string
    startTime: string
    endTime: string
    title: string
    description: string
    createdAt: Date
    createdByEmail?: string
    attendingEmails?: string[]

}


export const fetchData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Arrangements"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    console.log(data); // Array of documents from the collection
    return data as IArrangement[]
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}


export const addData = async (arrangement: IArrangement) => {
    try {
      const docRef = await addDoc(collection(db, "Arrangements"), arrangement);
      console.log("Document written with ID: ", docRef.id);
      // Update the same document with its id
    await updateDoc(docRef, { id: docRef.id });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }


export const attendArrangement = async (id: string, email: string) => {
  try {
    const docRef = doc(db, "Arrangements", id);

    // arrayUnion ensures no duplicate emails are added
    await updateDoc(docRef, {
      attendingEmails: arrayUnion(email),
    });

    console.log(`User ${email} added to arrangement ${id}`);
  } catch (error) {
    console.error("Error attending arrangement: ", error);
  }
};
