import { collection, query } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { db } from '../firebaseConfig/init'
import { Event, eventRegisteredUsersConverter } from '../types/Event'
import { User } from '../types/User'

interface Props {
  event?: Event
  user?: User
}

export function useEventRegistrant({ event, user }: Props) {
  const registeredRef = collection(db, `event/${event?.eventId}/registeredUsers`).withConverter(eventRegisteredUsersConverter)
  const [data, loadingRegistered, error] = useCollectionData(query(registeredRef))
}
