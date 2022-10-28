import type { NextPage } from "next";
import React, { ReactNode } from 'react'
import {FaCalendar, FaClock} from "react-icons/fa";
import {BsPeopleFill} from "react-icons/bs";
import {GiAchievement} from "react-icons/gi";
import {IoMdArrowBack} from "react-icons/io";
import Image from 'next/image'

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


  return(
    <div className="px-40">
      <div className="flex items-center">
        <IoMdArrowBack className="mr-2 text-xl cursor-pointer"/>
        <h1 className="font-bold text-xl">{name} Event 1 - HIMSISFO {organization}</h1>
      </div>
      <div className='overflow-hidden'>
        <Image className='rounded-xl' objectFit='contain' src={'/assets/home_vector.png'} alt="event-poster" width={150} height={150}>
              </Image>
      </div>
      <p className="text-justify">{description} Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestias, inventore neque nihil recusandae aspernatur quidem impedit, necessitatibus deserunt accusamus nostrum provident modi corrupti? Ab doloribus culpa quidem quia quo perferendis!</p>
      <p>
        <div className="flex items-center">
          <FaCalendar className="mr-1"/>
          {eventDate} 27 Oct 2022
        </div>
      </p>
      <p>
        <div className="flex items-center">
          <FaClock className="mr-1"/>
          {startTime} 09:00 - 13:00{endTime}
        </div>
      </p>
      <p>
        <div className="flex items-center">
          <GiAchievement className="mr-1"/>
          {benefit} 5 SAT
        </div>
      </p>
      <p>
        <div className="flex items-center">
          <BsPeopleFill className="mr-1"/>
          {capacity} 2 / 100{maxCapacity}
        </div>
      </p>
      <div className="border border-blue-500 rounded-lg bg-blue-500 text-white px-3 cursor-pointer w-fit items-center mt-2">
        <button>Register</button>
      </div>
    </div>
  )
}


export default EventDetail