import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import { useAuth } from '../authContext'
import { db } from '../firebaseConfig/init'
import { Event, RegisteredUsers, eventConverter, eventRegisteredUsersConverter } from '../types/Event'

export function useUserRegisterStatus(event?: Event) {
  const { user, loading } = useAuth()

  const [registerStatus, setRegisterStatus] = useState<string | undefined>()

  useEffect(() => {
    setRegisterStatus(event?.registeredUsers?.find((ru) => ru.userId === user?.userId)?.status)
  }, [event, user])

  return { registerStatus, loading }
}

export function useEvent(eventId?: string, status?: string) {
  const eventRef = doc(db, 'event', `${eventId}`).withConverter(eventConverter)
  const [eventTemp, loadingEvent, errorEvent] = useDocumentData(eventRef)
  const registeredUsersRef = collection(db, `event/${eventId}/registeredUsers`).withConverter(eventRegisteredUsersConverter)
  const [registeredUsers, loadingReg, errorReg] = useCollectionData(status ? query(registeredUsersRef, where('status', '==', status)) : registeredUsersRef)

  const [event, setEvent] = useState<Event>()
  useEffect(() => {
    if (loadingEvent || loadingReg) return
    setEvent({ ...(eventTemp as Event), registeredUsers: registeredUsers })
  }, [eventTemp, loadingEvent, loadingReg, registeredUsers])

  return { data: event, loading: loadingEvent || loadingReg, error: errorEvent || errorReg }
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
        const col = collection(db, `event/${d.eventId}/registeredUsers`).withConverter(eventRegisteredUsersConverter)
        onSnapshot(status ? query(col, where('status', '==', status)) : col, (snapshot) => {
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
