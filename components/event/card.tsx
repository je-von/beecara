import Image from 'next/image'
import Link from 'next/link'
import { FaCalendar } from 'react-icons/fa'
import { BsPeopleFill } from 'react-icons/bs'
import { Event, eventRegisteredUsersConverter } from '../../lib/types/Event'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { useAuth } from '../../lib/authContext'
import { doc } from 'firebase/firestore'
import { db } from '../../lib/firebaseConfig/init'
import Skeleton from 'react-loading-skeleton'
import BenefitTags from './BenefitTags'

interface Props {
  event: Event
  showRegisterStatus?: Boolean
  showImage?: Boolean
  showTitle?: Boolean
  showDate?: Boolean
  showSlot?: Boolean
  showOrganizer?: Boolean
  showBenefits?: Boolean
  horizontalLayout?: Boolean
}

export const SkeletonCard = ({ horizontalLayout }: { horizontalLayout?: Boolean }) => (
  <div className={`p-5 h-full w-full rounded-lg shadow-lg bg-white flex ${horizontalLayout ? 'flex-row' : 'flex-col'} justify-between`}>
    <div className={`flex ${horizontalLayout ? 'flex-row' : 'flex-col'} gap-5 w-full`}>
      <Skeleton height={160} width={horizontalLayout ? 160 : '100%'} />
      <Skeleton count={horizontalLayout ? 5 : 3} width={horizontalLayout ? 370 : '100%'} height={25} />
    </div>
    {!horizontalLayout && <Skeleton count={2} width={'100%'} height={25} />}
  </div>
)

const Card = ({
  event,
  showRegisterStatus = true,
  showImage = true,
  showTitle = true,
  showDate = true,
  showSlot = true,
  showOrganizer = true,
  showBenefits = true,
  horizontalLayout,
}: Props) => {
  const { user, loading: loadingAuth } = useAuth()
  const registeredRef = doc(db, `event/${event?.eventId}/registeredUsers/${user?.userId}`).withConverter(eventRegisteredUsersConverter)
  const [data, loadingRegistered, error] = useDocumentData(registeredRef)

  if (loadingAuth || loadingRegistered) return <SkeletonCard />

  const isRegistered = data?.status
  return (
    <Link href={`event/${event.eventId}`} key={event.eventId} passHref>
      <div
        className={`border cursor-pointer transition-all duration-[400ms] overflow-hidden rounded-lg shadow-lg hover:ring-2 hover:ring-sky-300 bg-white flex justify-between gap-5 items-start relative p-2 sm:p-3 md:p-5 ${
          !horizontalLayout ? 'flex-col' : ''
        }`}
      >
        {showRegisterStatus && isRegistered ? (
          <div
            className={`absolute top-0 left-0 z-10 text-xs sm:text-sm font-bold text-white ${
              isRegistered === 'Registered' ? 'bg-sky-400' : isRegistered === 'Pending' ? 'bg-orange-400' : 'bg-red-400'
            } px-4 py-2 rounded-br-xl`}
          >
            {isRegistered}
          </div>
        ) : undefined}
        {showImage && (
          <div className={`w-full h-40 ${horizontalLayout ? 'basis-1/3' : ''} relative rounded`}>
            <Image className="relative rounded" objectFit="cover" src={event.image} alt={event.name} sizes="100%" layout="fill"></Image>
          </div>
        )}
        <div className="flex flex-1 items-start">
          <div className="flex flex-col gap-1 h-full justify-between">
            <div className="flex flex-col gap-1">
              {showTitle && <h4 className="font-secondary text-md md:text-xl mb-1 gap-2 flex flex-col ">{event.name}</h4>}
              <div className="flex flex-col md:gap-6 lg:gap-1">
                {showDate && (
                  <div className="flex items-center gap-1">
                    <FaCalendar className="text-gray-400" />
                    {event.startDate?.toDate().toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                )}

                {showSlot && (
                  <div className="flex items-center gap-1">
                    <BsPeopleFill className="text-gray-400" />
                    {/* {data ? data.filter((d) => d.status === 'Registered').length : 0} / {event.capacity} */}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {showBenefits && (
                <div className="flex items-start flex-wrap gap-2 mt-2">
                  <BenefitTags benefits={event.benefit} />
                </div>
              )}
              {showOrganizer && (
                <div className="flex justify-start">
                  <h5 className="text-xs sm:text-sm font-bold">{event.organization.id}</h5>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Card
