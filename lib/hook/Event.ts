import { Unsubscribe, collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import { useAuth } from '../authContext'
import { db } from '../firebaseConfig/init'
import { Event, RegisteredUsers, eventConverter, eventRegisteredUsersConverter } from '../types/Event'
import { userConverter } from '../types/User'

export function useUserRegisterStatus(event?: Event) {
  const { user, loading } = useAuth()

  const [registerStatus, setRegisterStatus] = useState<string | undefined>()

  useEffect(() => {
    setRegisterStatus(event?.registeredUsers?.find((ru) => ru.userId === user?.userId)?.status)
  }, [event, user])

  return { registerStatus, loading }
}

export function useEvent(eventId?: string, includeUserData?: boolean, status?: string) {
  const { user, loading } = useAuth()
  const eventRef = doc(db, 'event', `${eventId}`).withConverter(eventConverter)
  const [eventTemp, loadingEvent, errorEvent] = useDocumentData(eventRef)
  const registeredUsersRef = collection(db, `event/${eventId}/registeredUsers`).withConverter(eventRegisteredUsersConverter)
  const [registeredUsers, loadingReg, errorReg] = useCollectionData(status ? query(registeredUsersRef, where('status', '==', status)) : registeredUsersRef)
  const [event, setEvent] = useState<Event>()
  const [loadingRegUsers, setLoadingRegUsers] = useState(false)

  useEffect(() => {
    if (loadingEvent || loadingReg || loading || !eventTemp) return
    const getRegisteredUsers = async () => {
      if (includeUserData && registeredUsers && user?.adminOf?.id === eventTemp?.organization.id) {
        setLoadingRegUsers(true)

        for (const ru of registeredUsers) {
          const d = await getDoc(doc(db, 'user', `${ru.userId}`).withConverter(userConverter))
          ru.user = d.data()
        }
      }
      setEvent({ ...(eventTemp as Event), registeredUsers: registeredUsers })
      setLoadingRegUsers(false)
    }
    getRegisteredUsers()
  }, [eventTemp, loadingEvent, loadingReg, registeredUsers, includeUserData, loading, user])

  return { data: event, loading: loadingRegUsers || loadingEvent || loadingReg, error: errorEvent || errorReg }
}

export function useEvents(status?: string) {
  const ref = collection(db, 'event').withConverter(eventConverter)
  const [data, loadingEvent, error] = useCollectionData(query(ref, orderBy('startDate', 'asc')))
  const [loadingRegUsers, setLoadingRegUsers] = useState(true)
  const [events, setEvents] = useState(data)
  useEffect(() => {
    if (loadingEvent) return
    let unsubscribe: Unsubscribe
    setEvents(
      data?.map((d) => {
        const registeredUsers: RegisteredUsers[] = []
        const col = collection(db, `event/${d.eventId}/registeredUsers`).withConverter(eventRegisteredUsersConverter)
        unsubscribe = onSnapshot(status ? query(col, where('status', '==', status)) : col, (snapshot) => {
          registeredUsers.length = 0
          setLoadingRegUsers(true)
          for (const s of snapshot.docs) {
            const registeredUser = s.data()

            registeredUsers.push(registeredUser)
          }
          setLoadingRegUsers(false)
        })

        return {
          ...d,
          registeredUsers: registeredUsers
        }
      })
    )
    return () => unsubscribe()
  }, [data, loadingEvent, status])

  return { data: events, loading: loadingEvent || loadingRegUsers, error }
}
