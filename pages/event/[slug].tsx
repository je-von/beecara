import type { NextPage } from "next";
import React, { ReactNode, useEffect, useState } from 'react'
import {FaCalendar, FaClock} from "react-icons/fa";
import {BsPeopleFill} from "react-icons/bs";
import {GiAchievement} from "react-icons/gi";
import {IoMdArrowBack} from "react-icons/io";
import Image from 'next/image'
import { useRouter } from "next/router";
import { collection, doc, getDoc, getDocFromCache } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig/init";

interface Event {
  eventID: string 
  image: string
  name: string
  organization: string

  capacity: number
  maxCapacity: number
  eventDate: string
  benefit: string
  startTime: string
  endTime: string
  description: string
}

const EventDetail = ({name, description, organization, capacity, maxCapacity, eventDate, startTime, endTime, benefit} : Event) => {
  const router = useRouter()
  var eventID = router.query["slug"]?.toString()
  const [event, setEvent] = useState([]);
  useEffect(() => {
   async function fetchData() {
     const docRef = doc(db, "event", eventID)
     const docSnap = await getDoc(docRef);
     if(docSnap.exists()){
       console.log(docSnap.data())
       setEvent(docSnap.data())
     }
     console.log('hi')
   } 
   fetchData()
  },[])
  return(
    <div className="px-40">
      <div className="flex items-center">
        <IoMdArrowBack className="mr-2 text-xl cursor-pointer"/>
        <h1 className="font-bold text-xl">{event.name} - {event.organization}</h1>
      </div>
      <div className='overflow-hidden'>
        <Image className='rounded-xl' objectFit='contain' src={event.image} alt="event-poster" width={150} height={150}>
              </Image>
      </div>
      <p className="text-justify">{event.description} </p>
      <p>
        <div className="flex items-center">
          <FaCalendar className="mr-1"/>
          {event.startDate?.toDate().toDateString()}
        </div>
      </p>
      <p>
        <div className="flex items-center">
          <FaClock className="mr-1"/>
          {event.startDate?.toDate().toLocaleTimeString('en-US')} - {event.endDate?.toDate().toLocaleTimeString('en-US')}
        </div>
      </p>
      <p>
        <div className="flex items-center">
          <GiAchievement className="mr-1"/>
          { event.benefit?.map(b => 
            b.type  + ' : ' + b.amount + ' '
          )}
        </div>
      </p>
      <p>
        <div className="flex items-center">
          <BsPeopleFill className="mr-1"/>
          {capacity} 2 / {event.capacity}
        </div>
      </p>
      <div className="border border-blue-500 rounded-lg bg-blue-500 text-white px-3 cursor-pointer w-fit items-center mt-2">
        <button>Register</button>
      </div>
    </div>
  )
}


export default EventDetail