import { DocumentData, DocumentReference, QueryDocumentSnapshot, SnapshotOptions, Timestamp, WithFieldValue } from 'firebase/firestore'

export interface Benefit {
  amount: number
  type: string
}

export interface Event {
  eventId: string
  image: string
  name: string
  organization: string
  capacity: number
  benefit?: Benefit[]
  startDate?: Timestamp
  endDate?: Timestamp
  description: string
  users?: DocumentReference[]
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
      users: event.users,
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Event {
    const data = snapshot.data(options)!
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
      users: data.users,
    }
  },
}
