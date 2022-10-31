import {
  DocumentData,
  Firestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  WithFieldValue,
} from "firebase/firestore";

class Benefit {
  constructor(readonly amount: number = 0, readonly type: string = "") {}
}

class Event {
  constructor(
    readonly eventId: string = "",
    readonly image: string = "",
    readonly name: string = "",
    readonly organization: string = "",
    readonly capacity: number = 0,
    readonly maxCapacity: number = 0,
    readonly benefit?: Benefit[],
    readonly startDate?: Timestamp,
    readonly endDate?: Timestamp,
    readonly description: string = ""
  ) {
  }
}

const eventConverter = {
  toFirestore(event: WithFieldValue<Event>): DocumentData {
    return {
      eventId: event.eventId,
      image: event.image,
      name: event.name,
      organization: event.organization,
      capacity: event.capacity,
      maxCapacity: event.maxCapacity,
      benefit: event.benefit,
      startDate: event.startDate,
      endDate: event.endDate,
      description: event.description,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Event {
    const data = snapshot.data(options)!;
    return new Event(
      data.eventId,
      data.image,
      data.name,
      data.organization,
      data.capacity,
      data.maxCapacity,
      data.benefit,
      data.startDate,
      data.endDate,
      data.description,);
  },
};

export { Event, eventConverter, Benefit };