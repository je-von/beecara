// Import the functions you need from the SDKs you need
import { FirebaseOptions, getApps, initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore'
// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket: 'beecara-rig.appspot.com',
  messagingSenderId: '493945434144',
  appId: process.env.NEXT_PUBLIC_appId,
}

// Initialize Firebase
const apps = getApps()
if (!apps.length) {
  const app = initializeApp(firebaseConfig)
}
const db = getFirestore()
export { db }
