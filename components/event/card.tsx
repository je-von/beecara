import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaCalendar } from 'react-icons/fa'
import { BsPeopleFill } from 'react-icons/bs'
import { Event } from '../../lib/types/Event'
import { organizationConverter } from '../../lib/types/Organization'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import { useAuth } from '../../lib/authContext'
import { collection, limit, query, where } from 'firebase/firestore'
import { db } from '../../lib/firebaseConfig/init'
import { userConverter } from '../../lib/types/User'

interface Props {
  event: Event
}

const Card = ({ event }: Props) => {
  const { user: userAuth, loading: loadingAuth } = useAuth()
  const organizationRef = event.organization.withConverter(organizationConverter)
  const userRef = collection(db, 'user').withConverter(userConverter)
  const [user, loadingUser, errorUser] = useCollectionData(query(userRef, where('email', '==', userAuth?.email), limit(1)))
  const [organization, loadingOrganization, errorOrganization] = useDocumentData(organizationRef)
  //TODO: add spinner / skeleton
  if (loadingAuth || loadingUser || loadingOrganization) return <h1>Loading...</h1>
  const isRegistered = user && user.length > 0 && event && event.users && event.users.length > 0 && event.users.some(u => u.id === user[0].userId)
  return (
    <Link href={`event/${event.eventId}`} key={event.eventId} passHref>
      <div className={`cursor-pointer transition-colors duration-500 rounded-lg border border-blue-100 bg-white hover:bg-blue-50 flex justify-between gap-5 items-start relative md:h-56 p-5 md:flex-row flex-col`}>
        { isRegistered && <div className="absolute bottom-6 right-6 text-sm font-bold text-white bg-blue-400 px-4 py-2 rounded-lg">Registered</div> }
        <div className="md:basis-1/6 lg:w-auto w-full h-40 md:w-20 md:h-full relative rounded">
          <Image className="relative rounded" objectFit="cover" src={event.image} alt={event.name} sizes="100%" layout="fill"></Image>
        </div>
        <div className="flex items-center md:basis-5/6">
          <div className="mr-8 flex flex-col gap-1">
            <h4 className="font-secondary text-xl mb-1 gap-2 flex md:flex-row flex-col ">
              <b>{event.name}</b> <span className="text-gray-400">({organization?.name})</span>
            </h4>
            <div className="flex lg:flex-col md:flex-row flex-col md:gap-6 lg:gap-1">
              <div className="flex items-center">
                <FaCalendar className="mr-1 text-gray-400" />
                {event.startDate?.toDate().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
                  {b.type == 'Others' ? (
                    b.amount
                  ) : (
                    <>
                      <b>{b.amount}</b> {b.type}
                    </>
                  )}
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
