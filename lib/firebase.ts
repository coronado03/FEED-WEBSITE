import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getDoc, getFirestore, limit, orderBy, query, where, getDocs } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
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
  return userDoc;
};


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
