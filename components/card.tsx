import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import {FaClock, FaUsers, FaCalendar} from "react-icons/fa";
import {BsPeopleFill} from "react-icons/bs";
import {GiAchievement} from "react-icons/gi";


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
  return(
    <Link href={`eventDetail/${eventID}`} key={eventID}>
      <div className='rounded-lg p-5 bg-blue-100 flex justify-between items-start mt-4'>
        <div className='flex items-center'>
          <div className='border border-gray-400 rounded-full mr-5 overflow-hidden'>
            <Image className='rounded-full' objectFit='contain' src={image} alt="event-img" width={50} height={50}>
            </Image>
          </div>
          <div className='flex items-center '>

            <div className='mr-8'>
              <h3 className=''> <b>{name}</b> - {organization}</h3>
              <p>
                <div className='flex items-center'>
                  <FaCalendar className='mr-1'/>
                  {eventDate}
                </div>
              </p>
              <p>
                <div className='flex items-center'>
                  <BsPeopleFill className='mr-1'/>
                  {capacity} / {maxCapacity}
                </div>
              </p>
              <p>
                <div className='flex items-center'>
                  <GiAchievement className='mr-1'/>
                  {benefit}
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
  )
}

export default Card