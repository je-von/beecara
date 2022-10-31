import { FaCalendar, FaClock } from 'react-icons/fa'
import { BsPeopleFill } from 'react-icons/bs'
import { GiAchievement } from 'react-icons/gi'
import { IoMdArrowBack } from 'react-icons/io'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebaseConfig/init'
import { Benefit, eventConverter } from '../../lib/types/Event'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import NotFoundPage from '../404'
import { useAuth } from '../../lib/authContext'

const EventDetail = () => {
  const router = useRouter()
  const { user, loading: loadAuth } = useAuth()
  const { eventId } = router.query
  const docRef = doc(db, 'event', `${eventId}`).withConverter(eventConverter)
  const [event, loading, error, snapshot] = useDocumentData(docRef)

  if (loading) {
    return <>Loading</>
  }

  if (!loading && (error || !event)) {
    return <NotFoundPage />
  }

  const registerEvent = () => {
    updateDoc(doc(db, 'event', `${eventId}`), { users: arrayUnion(doc(db, 'user', user?.claims.user_id)) }).then(() => {
      console.log('Register Success') // TODO: create alert / toast
    })
  }

  return (
    <div className="px-40">
      <div className="flex items-center">
        <IoMdArrowBack className="mr-2 text-xl cursor-pointer" />
        <h1 className="font-bold text-xl">
          {event?.name} - {event?.organization}
        </h1>
      </div>
      <div className="overflow-hidden">
        <Image className="rounded-xl" objectFit="contain" src={`${event?.image}`} alt="event-poster" width={150} height={150} />
      </div>
      <p className="text-justify">{event?.description} </p>
      <p className="flex items-center">
        <FaCalendar className="mr-1" />
        {event?.startDate?.toDate().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <p className="flex items-center">
        <FaClock className="mr-1" />
        {event?.startDate?.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })} -{' '}
        {event?.endDate?.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
      </p>
      <p className="flex items-center">
        <GiAchievement className="mr-1" />
        {event?.benefit?.map((b: Benefit) => b.type + ' : ' + b.amount + ' ')}
      </p>
      <p className="flex items-center">
        <BsPeopleFill className="mr-1" />
        {event?.users?.length} / {event?.capacity}
      </p>
      <div className="border border-blue-500 rounded-lg bg-blue-500 text-white px-3 cursor-pointer w-fit items-center mt-2">
        <button onClick={registerEvent}>Register</button>
      </div>
    </div>
  )
}

export default EventDetail
