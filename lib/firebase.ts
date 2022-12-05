import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getDoc, getFirestore, limit, orderBy, query, where, getDocs } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDW7fuEX_hhXhSs3btBl-7AKUTrU3PzonU",
    authDomain: "nextfire-26a86.firebaseapp.com",
    projectId: "nextfire-26a86",
    storageBucket: "nextfire-26a86.appspot.com",
    messagingSenderId: "431021056374",
    appId: "1:431021056374:web:d8fe8b0f99021e66429a57",
    measurementId: "G-46LHZKYQSE"
  };


const firebaseApp = initializeApp(firebaseConfig);


export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();


export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);


export async function getUserWithUsername(username) {
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where('username', '==', username), limit(1));
  const userDoc = (await getDocs(q)).docs[0];
  return userDoc
}
export function postToJson(doc){

  const data = doc.data();
  return {
    ...data,
    //createdAt: data.createdAt.toMillis(),
    //updatedAt: data.updatedAt.toMillis(),
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };

}

export const STATE_CHANGED = 'state_changed';
