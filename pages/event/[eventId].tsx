import { FaCalendar, FaClock } from 'react-icons/fa'
import { IoMdArrowBack } from 'react-icons/io'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { collection, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebaseConfig/init'
import NotFoundPage from '../404'
import { useAuth } from '../../lib/authContext'
import BenefitTags from '../../components/event/BenefitTags'
import { getDateFormat, getTimeFormat } from '../../lib/helper/util'
import Button from '../../components/button/Button'
import { useEvent, useUserRegisterStatus } from '../../lib/hook/Event'
import { userConverter } from '../../lib/types/User'
import Linkify from 'react-linkify'
import RegistrationCard from '../../components/event/RegistrationCard'
interface FormValues {
  proof: File
}

const EventDetail = () => {
  const router = useRouter()
  const { user: userAuth, loading: loadAuth } = useAuth()
  const { eventId } = router.query

  const { data: event, loading, error } = useEvent(`${eventId}`, true)
  const { registerStatus } = useUserRegisterStatus(event)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showModal, setShowModal] = useState(false)

  const refUser = collection(db, 'user').withConverter(userConverter)

  // useEffect(() => {
  //   console.log(event)
  //   getDocs(collection(db, `event/${eventId}/registeredUsers`)).then((value) => {
  //     value.forEach((v) => console.log(v.data()))
  //   })
  // }, [event])
  if (loading && !event) {
    // TODO: skeleton
    return <>Loading</>
  }

  if (!event || error) {
    return <NotFoundPage />
  }

  const acceptParticipant = (userId: string | undefined) => {
    updateDoc(doc(db, 'event', `${eventId}/registeredUsers/${userId}`), {
      status: 'Registered'
    }).then(() => {
      console.log('Success accept participant') // TODO: create alert / toast
      setShowModal(false)
    })
    // console.log(userId)
  }

  const rejectParticipant = (userId: string | undefined) => {
    updateDoc(doc(db, 'event', `${eventId}/registeredUsers/${userId}`), {
      status: 'Rejected'
    }).then(() => {
      console.log('Reject participant') // TODO: create alert / toast
      setShowModal(false)
    })
  }

  return (
    <div className="lg:px-40 md:px-16 px-8 pb-5 pt-5 flex flex-col gap-5">
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
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg  ">
            <table className="w-full text-sm text-left text-gray-400 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="py-3 px-6">
                    Name
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Proof
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {event?.registeredUsers
                  // ?.filter(
                  //   (ru) =>
                  //     // ru.status !== 'Registered' &&
                  //     ru.status !== 'Rejected'
                  // )
                  ?.map((ru) => (
                    <tr className="bg-white border-b hover:bg-gray-50 " key={ru.userId}>
                      <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                        <div>
                          {ru.user?.name} <span className="text-gray-400">({ru.user?.email})</span>
                        </div>
                      </th>
                      <td className="py-4 px-6">
                        {' '}
                        <div>
                          {ru?.proof ? (
                            <div>
                              <Image className="" src={`${ru.proof}`} alt="event-poster" width={150} height={150} />
                            </div>
                          ) : (
                            'No Proof!'
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        {ru.status !== 'Rejected' && ru.status !== 'Registered' ? (
                          <div className="flex gap-4">
                            <Button
                              onClick={() => {
                                acceptParticipant(ru?.userId)
                              }}
                            >
                              Approve
                            </Button>
                            <Button
                              color={'red'}
                              onClick={() => {
                                rejectParticipant(ru?.userId)
                              }}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <div className="">{ru.status}</div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventDetail
