import { useEffect, useState } from 'react'
import {FaCalendar, FaClock} from "react-icons/fa";
import {BsPeopleFill} from "react-icons/bs";
import {GiAchievement} from "react-icons/gi";
import {IoMdArrowBack} from "react-icons/io";
import Image from 'next/image'
import { useRouter } from "next/router";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig/init";
import { Benefit, Event, eventConverter } from '../../lib/types/Event';

const EventDetail = () => {
  const router = useRouter()
  const { eventId } = router.query
  const [event, setEvent] = useState<Event>(new Event(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined));

  useEffect(() => {
    async function fetchData() {
      if (eventId) {
        const docRef = doc(db, "event", eventId.toString()).withConverter(eventConverter)
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          setEvent(docSnap.data())
        }
      }
   } 
   fetchData()
  }, [eventId])
  console.log(event)
  return 1 == 1? (
    <div className="px-40">
      <div className="flex items-center">
        <IoMdArrowBack className="mr-2 text-xl cursor-pointer"/>
        <h1 className="font-bold text-xl">{event.name} - {event.organization}</h1>
      </div>
      <div className='overflow-hidden'>
        <Image className='rounded-xl' objectFit='contain' src={event.image} alt="event-poster" width={150} height={150}/>
      </div>
      <p className="text-justify">{event.description} </p>
      <p className="flex items-center">
        <FaCalendar className="mr-1"/>
        {event.startDate?.toDate().toDateString()}
      </p>
      <p className="flex items-center">
        <FaClock className="mr-1"/>
        {event.startDate?.toDate().toLocaleTimeString('en-US')} - {event.endDate?.toDate().toLocaleTimeString('en-US')}
      </p>
      <p className="flex items-center">
        <GiAchievement className="mr-1"/>
        {event.benefit?.map((b: Benefit) =>  
          b.type  + ' : ' + b.amount + ' '
        )}
      </p>
      <p className="flex items-center">
        <BsPeopleFill className="mr-1"/>
        2 / {event.capacity}
      </p>
      <div className="border border-blue-500 rounded-lg bg-blue-500 text-white px-3 cursor-pointer w-fit items-center mt-2">
        <button>Register</button>
      </div>
    </div>
  ) : <h1>Loading</h1>
}


export default EventDetail