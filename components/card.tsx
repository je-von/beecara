import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'

interface Event {
  eventID: string 
  image: string
  name: string
  organization: string
  startDate: Date 
  endDate: Date
}

const Card=({ eventID, image, name, organization, startDate, endDate}: Event)=>{
  return(
    <Link href={`eventDetail/${eventID}`} key={eventID}>
      <div className='flex border border-black rounded-lg items-center w-full'>
        <div>
          <Image src={image} alt="event-img" width={100} height={100}>
          </Image>
        </div>
        <div>
          <h3>{name}</h3>
          <p>{organization}</p>
          <p>{startDate}</p>
          <p>{endDate}</p>
        </div>
      </div>
    </Link>
  )
}

export default Card