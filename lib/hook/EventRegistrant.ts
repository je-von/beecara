import { collection, doc, query, where } from 'firebase/firestore'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import { db } from '../firebaseConfig/init'
import { Event, eventRegisteredUsersConverter } from '../types/Event'
import { User } from '../types/User'

export function useEventRegistrant(event?: Event, user?: User) {
  const registeredUserRef = doc(db, `event/${event?.eventId}/registeredUsers/${user?.userId}`).withConverter(eventRegisteredUsersConverter)
  const [data, loading, error] = useDocumentData(registeredUserRef)

  return { data, loading, error }
}

export function useEventRegistrants(event?: Event, status?: string) {
  const registeredUserRef = collection(db, `event/${event?.eventId}/registeredUsers`).withConverter(eventRegisteredUsersConverter)
  const [data, loading, error] = useCollectionData(status ? query(registeredUserRef, where('status', '==', status)) : registeredUserRef)

  return { data, loading, error }
}
