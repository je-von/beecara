import { DocumentData, DocumentReference, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from 'firebase/firestore'

export interface User {
  userId: string
  name: string
  email: string
  lineID: string
  instagram: string
  phoneNumber: string
  adminOf?: DocumentReference
}

export const userConverter = {
  toFirestore(user: WithFieldValue<User>): DocumentData {
    return {
      name: user.name,
      email: user.email,
      adminOf: user.adminOf,
      lineID: user.lineID,
      instagram: user.instagram,
      phoneNumber: user.phoneNumber
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): User {
    const data = snapshot.data(options)!
    return {
      userId: snapshot.id,
      name: data.name,
      email: data.email,
      lineID: data.lineID,
      phoneNumber: data.phoneNumber,
      instagram: data.instagram,
      adminOf: data.adminOf,
    }
  },
}
