import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import { db } from '../firebaseConfig/init'
import { Event, RegisteredUsers, eventConverter, eventRegisteredUsersConverter } from '../types/Event'
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

export function useEvents(status?: string) {
  const ref = collection(db, 'event').withConverter(eventConverter)
  const [data, loadingEvent, error] = useCollectionData(query(ref, orderBy('startDate', 'asc')))
  const [loadingRegUsers, setLoadingRegUsers] = useState(true)
  const [events, setEvents] = useState(data)
  useEffect(() => {
    if (loadingEvent) return
    setEvents(
      data?.map((d) => {
        const registeredUsers: RegisteredUsers[] = []
        onSnapshot(query(collection(db, `event/${d.eventId}/registeredUsers`).withConverter(eventRegisteredUsersConverter), where('status', '==', status)), (snapshot) => {
          let i = 0
          snapshot.forEach((s) => {
            i++
            registeredUsers.push(s.data())
          })
          if (i >= snapshot.size) setLoadingRegUsers(false)
        })

        return {
          ...d,
          registeredUsers: registeredUsers,
        }
      })
    )
  }, [data, loadingEvent, status])

  return { data: events, loading: loadingEvent || loadingRegUsers, error }
}
