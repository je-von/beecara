import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaCalendar } from 'react-icons/fa'
import { BsPeopleFill } from 'react-icons/bs'
import { GiAchievement } from 'react-icons/gi'
import { Event } from '../../lib/types/Event'

interface Props {
  event: Event
}

const Card = ({ event }: Props) => {
  return (
    <Link href={`event/${event.eventId}`} key={event.eventId} passHref>
      <div className="rounded-lg p-5 bg-blue-100 flex justify-between items-start mt-4">
        <div className="flex items-center">
          <div className="border border-gray-400 rounded-full mr-5 overflow-hidden">
            <Image className="rounded-full" objectFit="contain" src={event.image} alt="event-img" width={50} height={50}></Image>
          </div>
          <div className="flex items-center ">
            <div className="mr-8 ">
              <h4 className="font-secondary text-xl mb-2">
                {' '}
                <b>{event.name}</b> - {event.organization}
              </h4>
              <div className="flex items-center">
                <FaCalendar className="mr-1" />
                {event.startDate?.toDate().toDateString()}
              </div>
              <div className="flex items-center">
                <BsPeopleFill className="mr-1" />0 / {event.capacity}
              </div>
              <div className="flex items-center">
                <GiAchievement className="mr-1" />
                {event.benefit?.map((b) => b.type + ' : ' + b.amount + ' ')}
              </div>
            </div>
          </div>
        </div>

        <div className="border border-blue-500 rounded-lg bg-blue-500 text-white px-3 cursor-pointer">
          <button>Detail</button>
        </div>
      </div>
    </Link>
  )
}

export default Card
