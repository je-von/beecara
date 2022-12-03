import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from 'firebase/firestore'

export interface Organization {
  organizationId: string
  name: string
}

export const organizationConverter = {
  toFirestore(org: WithFieldValue<Organization>): DocumentData {
    return {
      name: org.name,
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Organization {
    const data = snapshot.data(options)!
    return {
      organizationId: snapshot.id,
      name: data.name,
    }
  },
}
