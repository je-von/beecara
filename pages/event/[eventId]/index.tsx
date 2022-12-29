import { FaCalendar, FaClock } from 'react-icons/fa'
import { IoMdArrowBack } from 'react-icons/io'
import Image from 'next/image'
import { useRouter } from 'next/router'
import NotFoundPage from '../../404'
import { useAuth } from '../../../lib/authContext'
import BenefitTags from '../../../components/event/BenefitTags'
import { getDateFormat, getTimeFormat } from '../../../lib/helper/util'
import { useEvent, useUserRegisterStatus } from '../../../lib/hook/Event'
import Linkify from 'react-linkify'
import RegistrationCard from '../../../components/event/RegistrationCard'
import RegistrantTable from '../../../components/event/RegistrantTable'
import { HiLocationMarker } from 'react-icons/hi'
const EventDetail = () => {
  const router = useRouter()
  const { user: userAuth } = useAuth()
  const { eventId } = router.query

  const { data: event, loading, error } = useEvent(`${eventId}`, true)
  const { registerStatus } = useUserRegisterStatus(event)

  if (loading && !event) {
    // TODO: skeleton
    return <>Loading</>
  }

  if (!event || error) {
    return <NotFoundPage />
  }

  return (
    <div className="lg:px-40 md:px-16 px-8 pb-9 pt-5 flex flex-col gap-5">
      <div className="flex items-start">
        <div onClick={() => router.back()}>
          <IoMdArrowBack className="mr-2 mt-[0.4rem] text-xl cursor-pointer stroke-black" strokeWidth={40} />
        </div>
        <h4 className="font-secondary text-2xl mb-1 gap-2 ">
          <b>{event?.name}</b> <span className="text-gray-400">({event?.organization.id})</span>
        </h4>
      </div>
      <div className="flex flex-col lg:flex-row justify-between gap-7">
        <div className="h-96 relative rounded-lg shadow-lg border w-full lg:w-[25%]">
          {registerStatus ? (
            <div
              className={`absolute top-0 left-0 z-10 text-sm font-bold text-white ${
                registerStatus === 'Registered' ? 'bg-sky-400' : registerStatus === 'Pending' ? 'bg-orange-400' : 'bg-red-400'
              } px-4 py-2 rounded-br-lg rounded-tl-lg`}
            >
              {registerStatus}
            </div>
          ) : undefined}
          <Image
            className="relative rounded-lg object-cover transition-all hover:rounded-none hover:object-contain"
            src={`${event?.image}`}
            alt="event-poster"
            layout="fill"
            width={150}
            height={200}
          />
        </div>

        <div className={`flex flex-col gap-5 w-full lg:w-[45%]`}>
          <div className="">
            <b className="text-gray-600">About the Event</b>
            <Linkify
              componentDecorator={(decoratedHref, decoratedText, key) => (
                <a target="_blank" rel="noreferrer" href={decoratedHref} key={key} className="text-sky-500">
                  {decoratedText}
                </a>
              )}
            >
              <p className="text-justify whitespace-pre-wrap">{event?.description.trim() || '-'}</p>
            </Linkify>
          </div>
          <div className="">
            <b className="text-gray-600">Mark the Date!</b>
            <p className="flex items-center">
              <FaCalendar className="mr-2 text-gray-400" />
              {getDateFormat(event?.startDate)}
            </p>
            <p className="flex items-center">
              <FaClock className="mr-2 text-gray-400" />
              {getTimeFormat(event?.startDate)} - {getTimeFormat(event?.endDate)}
            </p>
            <p className="flex items-center">
              <HiLocationMarker className="mr-2 text-gray-400 -ml-[0.08rem] text-lg" />
              {event.location || '-'}
            </p>
          </div>

          <div className=" ">
            <b className="text-gray-600">Benefit</b>
            <div className="flex items-start flex-wrap gap-2 mt-2">{<BenefitTags benefits={event?.benefit} />}</div>
          </div>
        </div>
        {/* {userAuth?.adminOf?.id !== event.organization.id && ( */}
        <div className="flex border flex-col rounded-lg p-4 shadow-lg w-full lg:w-[25%] justify-between h-fit">
          <RegistrationCard event={event} registerStatus={registerStatus} />
        </div>
        {/* )} */}
      </div>

      {userAuth?.adminOf?.id === event?.organization?.id && (
        <div className="flex flex-col gap-5 mt-5">
          <h3>Registrants</h3>
          <RegistrantTable event={event} />
        </div>
      )}
    </div>
  )
}

export default EventDetail
