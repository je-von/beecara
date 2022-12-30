// Import the functions you need from the SDKs you need
import { FirebaseOptions, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage } from 'firebase/storage'
// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket: 'beecara-rig-2cbb9.appspot.com',
  messagingSenderId: '19808445734',
  appId: process.env.NEXT_PUBLIC_appId
}

// Initialize Firebase
const apps = getApps()
// if (!apps.length) {
const app = apps[0] || initializeApp(firebaseConfig)
// }
// const db = initializeFirestore(app, { ignoreUndefinedProperties: true })
// enableIndexedDbPersistence(db)
const db = getFirestore(app)
const storage = getStorage(app)
export { db, storage, app }
