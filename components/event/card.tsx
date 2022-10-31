import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaCalendar } from 'react-icons/fa'
import { BsPeopleFill } from 'react-icons/bs'
import { Event } from '../../lib/types/Event'

interface Props {
  event: Event
}

const Card = ({ event }: Props) => {
  return (
    <Link href={`event/${event.eventId}`} key={event.eventId} passHref>
      <div className="cursor-pointer transition-colors duration-500 rounded-lg border border-blue-100 hover:bg-blue-50 flex justify-between gap-2 items-start mt-4 relative md:h-48 p-5 md:flex-row flex-col">
        <div className="md:basis-1/6 hidden md:block lg:w-auto w-20 h-10 md:h-full relative">
          <Image className="relative" objectFit="cover" src={event.image} alt={event.name} sizes="100%" layout="fill"></Image>
        </div>
        <div className="flex items-center md:basis-5/6">
          <div className="mr-8 flex flex-col gap-1">
            <h4 className="font-secondary text-xl mb-1 gap-2 flex md:flex-row flex-col ">
              <b>{event.name}</b> <span className="text-gray-400">({event.organization})</span>
            </h4>
            <div className="flex lg:flex-col flex-row gap-6 lg:gap-1">
              <div className="flex items-center">
                <FaCalendar className="mr-1 text-gray-400" />
                {event.startDate?.toDate().toDateString()}
              </div>
              <div className="flex items-center">
                <BsPeopleFill className="mr-1 text-gray-400" />
                {event.users?.length} / {event.capacity}
              </div>
            </div>
            <div className="flex items-start md:items-center gap-2 mt-2 md:flex-row flex-col">
              {/* <GiAchievement className="mr-1" /> */}
              {event.benefit?.map((b, index) => (
                <div key={index} className="bg-gray-300 px-2 py-1 rounded-lg">
                  <b>{b.amount}</b> {b.type}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <div className="border border-blue-500 rounded-lg bg-blue-500 text-white px-3 cursor-pointer">
          <button className="">Detail</button>
        </div> */}
      </div>
    </Link>
  )
}

export default Card
