import { collection } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { db } from '../../lib/firebaseConfig/init'
import { eventConverter } from '../../lib/types/Event'
import Card from './card'

const EventList = () => {
  const ref = collection(db, 'event').withConverter(eventConverter)
  const [data, loading, error] = useCollectionData(ref)

  if (loading) return <h1>Loading...</h1>

  return (
    <div>
      {data?.map((d) => (
        <Card key={d.eventId} event={d} />
      ))}
    </div>
  )
}

export default EventList
