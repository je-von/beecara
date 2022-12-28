import { DocumentData, DocumentReference, QueryDocumentSnapshot, SnapshotOptions, Timestamp, WithFieldValue } from 'firebase/firestore'
import { User } from './User'

export interface Benefit {
  amount: number | string
  type: string
}

export interface Fee {
  amount: number
  description: string
}

export interface RegisteredUsers {
  // id nya pake id usernya
  userId?: string
  status: 'Pending' | 'Registered' | 'Rejected'
  proof?: string
  isPresent: boolean
  paymentDeadline: Timestamp
  // user: DocumentReference
  user?: User
}

export interface Event {
  eventId?: string
  image: string
  name: string
  organization: DocumentReference
  capacity: number
  benefit?: Benefit[]
  startDate?: Timestamp
  endDate?: Timestamp
  description: string
  // users?: DocumentReference[]
  postRegistrationDescription?: string
  maxRegistrationDate?: Timestamp
  fee?: Fee // kalo null, berarti eventnya free

  registeredUsers?: RegisteredUsers[]
}

export const eventConverter = {
  toFirestore(event: WithFieldValue<Event>): DocumentData {
    return {
      image: event.image,
      name: event.name,
      organization: event.organization,
      capacity: event.capacity,
      benefit: event.benefit,
      startDate: event.startDate,
      endDate: event.endDate,
      description: event.description,
      // users: event.users,
      postRegistrationDescription: event.postRegistrationDescription,
      maxRegistrationDate: event.maxRegistrationDate,
      fee: event.fee
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Event {
    const data = snapshot.data(options)! as Event
    // const ref = data.organization.withConverter(eventConverter)
    // getDoc(ref)
    return {
      eventId: snapshot.id,
      image: data.image,
      name: data.name,
      organization: data.organization,
      capacity: data.capacity,
      benefit: data.benefit,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
      // users: data.users,
      postRegistrationDescription: data.postRegistrationDescription,
      maxRegistrationDate: data.maxRegistrationDate,
      fee: data.fee
    }
  }
}

export const eventRegisteredUsersConverter = {
  toFirestore(ru: WithFieldValue<RegisteredUsers>): DocumentData {
    return {
      status: ru.status,
      proof: ru.proof,
      isPresent: ru.isPresent,
      paymentDeadline: ru.paymentDeadline
      // user: ru.user,
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): RegisteredUsers {
    const data = snapshot.data(options)! as RegisteredUsers
    return {
      userId: snapshot.id,
      status: data.status,
      proof: data.proof,
      isPresent: data.isPresent,
      paymentDeadline: data.paymentDeadline
      // user: data.user,
    }
  }
}
