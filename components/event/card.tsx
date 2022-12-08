import Image from 'next/image'
import Link from 'next/link'
import { FaCalendar } from 'react-icons/fa'
import { BsPeopleFill } from 'react-icons/bs'
import { Event } from '../../lib/types/Event'
import { useAuth } from '../../lib/authContext'
import Skeleton from 'react-loading-skeleton'

interface Props {
  event: Event
}

export const SkeletonCard = () => (
  <div className={`p-5 h-full w-full rounded-lg shadow-lg bg-white flex flex-col justify-between`}>
    <div className="flex flex-col gap-5">
      <Skeleton height={120} width={'100%'} />
      <Skeleton count={3} width={'100%'} height={25} />
    </div>
    <Skeleton count={2} width={'100%'} height={25} />
  </div>
)

const Card = ({ event }: Props) => {
  const { user, loading: loadingAuth } = useAuth()
  if (loadingAuth) return <SkeletonCard />
  const isRegistered = event?.users?.some((u) => u.id === user?.userId)
  return (
    <Link href={`event/${event.eventId}`} key={event.eventId} passHref>
      <div
        className={`cursor-pointer transition-all duration-[400ms] overflow-hidden rounded-lg shadow-lg hover:ring-2 hover:ring-sky-300 bg-white  flex justify-between gap-5 items-start relative p-5 flex-col`}
      >
        {isRegistered && <div className="absolute top-0 left-0 z-10 text-sm font-bold text-white bg-sky-400 px-4 py-2 rounded-br-xl">Registered</div>}
        <div className="w-full h-40 relative rounded">
          <Image
            placeholder={'blur'}
            blurDataURL={event.image}
            className="relative rounded"
            objectFit="cover"
            src={event.image}
            alt={event.name}
            sizes="100%"
            layout="fill"
          ></Image>
        </div>
        <div className="flex items-start md:basis-5/6">
          <div className="flex flex-col gap-1 h-full justify-between">
            <div className="flex flex-col gap-1">
              <h4 className="font-secondary text-xl mb-1 gap-2 flex flex-col ">
                <b>{event.name}</b>
              </h4>
              <div className="flex flex-col md:gap-6 lg:gap-1">
                <div className="flex items-center">
                  <FaCalendar className="mr-1 text-gray-400" />
                  {event.startDate?.toDate().toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className="flex items-center">
                  <BsPeopleFill className="mr-1 text-gray-400" />
                  {event.users?.length} / {event.capacity}
                </div>
              </div>
            </div>
            <div className="flex items-start flex-wrap gap-2 mt-2">
              {/* <GiAchievement className="mr-1" /> */}
              {event.benefit
                ?.sort((a, b) => {
                  return a.type.length < b.type.length ? -1 : a.type.length === b.type.length ? 0 : 1
                })
                .map((b, index) => (
                  <div key={index} className="bg-gray-200 text-gray-500 px-2 py-1 rounded-lg text-xs">
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
      </div>
    </Link>
  )
}

export default Card
