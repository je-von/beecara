// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6AbD_JOYcR6NMUTWbzrcj29-HT3My3wk",
  authDomain: "beecara-rig.firebaseapp.com",
  projectId: "beecara-rig",
  storageBucket: "beecara-rig.appspot.com",
  messagingSenderId: "493945434144",
  appId: "1:493945434144:web:67b99f28adf53208784c45"
};

// Initialize Firebase
const apps=getApps()
if(!apps.length){
  const app = initializeApp(firebaseConfig);
}
const db = getFirestore();
export {db}