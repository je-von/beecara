import { DocumentData, DocumentReference, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from 'firebase/firestore'

export interface User {
  userId: string
  name: string
  email: string
  adminOf?: DocumentReference
}

export const userConverter = {
  toFirestore(user: WithFieldValue<User>): DocumentData {
    return {
      name: user.name,
      email: user.email,
      adminOf: user.adminOf,
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): User {
    const data = snapshot.data(options)!
    return {
      userId: snapshot.id,
      name: data.name,
      email: data.email,
      adminOf: data.adminOf,
    }
  },
}
