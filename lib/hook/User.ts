import { doc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useDocumentData } from "react-firebase-hooks/firestore"
import { db } from "../firebaseConfig/init"
import { User, userConverter } from "../types/User"

export function useUser(userId?: string) : User{
    const userRef = doc(db, 'user', `${userId}`).withConverter(userConverter)
    const [userTemp, loadinguser, erroruser] = useDocumentData(userRef)
    return userTemp as User
  }