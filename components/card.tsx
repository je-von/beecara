import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode, useEffect, useState } from 'react'
import {FaCalendar, FaMonument} from "react-icons/fa";
import {BsPeopleFill} from "react-icons/bs";
import {GiAchievement} from "react-icons/gi";
import { collection, onSnapshot, query} from 'firebase/firestore';
import { db } from '../lib/firebaseConfig/init';


interface Event {
  eventID: string 
  image: string
  name: string
  organization: string

  capacity: number
  maxCapacity: number
  eventDate: string
  benefit: string
}

const Card=({ eventID, image, name, organization, capacity, maxCapacity, eventDate, benefit}: Event)=>{
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const collectionRef = collection(db, "event")
    const q = query(collectionRef);
    const test = onSnapshot(q, (querySnapshot) =>{
      setEvents(querySnapshot.docs.map(doc => (
        // console.log(doc.data() + ' ' + doc.id)
        {...doc.data(), id: doc.id}
        )))
    })
    return test
  }, [])
  
  

  return(
    <div>
      {events.map(event=>
    <Link href={`event/${event.id}`} key={event.id}>
      <div className='rounded-lg p-5 bg-blue-100 flex justify-between items-start mt-4'>
        <div className='flex items-center'>
          <div className='border border-gray-400 rounded-full mr-5 overflow-hidden'>
            <Image className='rounded-full' objectFit='contain' src={event.image} alt="event-img" width={50} height={50}>
            </Image>
          </div>
          <div className='flex items-center '>

            <div className='mr-8'>
              <h3> <b>{event.name}</b> - {event.organization}</h3>
              <p>
                <div className='flex items-center'>
                  <FaCalendar className='mr-1'/>
                  {event.startDate.toDate().toDateString()}
                </div>
              </p>
              <p>
                <div className='flex items-center'>
                  <BsPeopleFill className='mr-1'/>
                  {capacity} / {event.capacity}
                </div>
              </p>
              <p>
                <div className='flex items-center'>
                  <GiAchievement className='mr-1'/>
                  { event.benefit?.map(b => 
                    b.type  + ' : ' + b.amount + ' '
                  )}
                </div>
              </p>
            </div>
          </div>
            
        </div>

          <div className='border border-blue-500 rounded-lg bg-blue-500 text-white px-3 cursor-pointer'>
            <button>Detail</button>

          </div>


      </div>
      
    </Link>
        )}
    </div>
  )
}

export default Card