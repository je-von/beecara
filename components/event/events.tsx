import { collection } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { BsFilter } from 'react-icons/bs'
import { db } from '../../lib/firebaseConfig/init'
import { eventConverter } from '../../lib/types/Event'
import Card from './card'

const EventList = () => {
  const ref = collection(db, 'event').withConverter(eventConverter)
  const [data, loading, error] = useCollectionData(ref)

  //TODO: add spinner / skeleton
  if (loading) return <h1>Loading...</h1>

  return (
    <div className="py-5 flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-black font-secondary">Events</h1>
        <p>Blablabla, kasih text gitu kek: register to any of the following events to increase your SAT ato apa gt!</p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <BsFilter /> Filter
        </div>
        <input type="search" className="border border-gray-300 rounded-md px-2 py-1" placeholder="Search events..." />
      </div>
      <div className="flex flex-col gap-4">
        {data?.map((d) => (
          <Card key={d.eventId} event={d} />
        ))}
      </div>
    </div>
  )
}

export default EventList
