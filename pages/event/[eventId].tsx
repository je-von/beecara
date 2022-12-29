import { FaCalendar, FaClock } from 'react-icons/fa'
import { IoMdArrowBack, IoMdPricetag } from 'react-icons/io'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Timestamp, collection, doc, setDoc, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../lib/firebaseConfig/init'
import { eventRegisteredUsersConverter } from '../../lib/types/Event'
import NotFoundPage from '../404'
import { useAuth } from '../../lib/authContext'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import BenefitTags from '../../components/event/BenefitTags'
import { getDateFormat, getMoneyFormat, getTimeFormat } from '../../lib/helper/util'
import { BsPeopleFill } from 'react-icons/bs'
import moment from 'moment'
import Button from '../../components/button/Button'
import { useEvent, useUserRegisterStatus } from '../../lib/hook/Event'
import Modal from '../../components/modal/Modal'
import { userConverter } from '../../lib/types/User'
import Linkify from 'react-linkify'
interface FormValues {
  proof: File
}

const EventDetail = () => {
  const router = useRouter()
  const { user: userAuth, loading: loadAuth } = useAuth()
  const { eventId } = router.query

  const [imageURL, setImageURL] = useState<string>()

  const { data: event, loading, error } = useEvent(`${eventId}`, true)
  const { registerStatus } = useUserRegisterStatus(event)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showModal, setShowModal] = useState(false)

  const refUser = collection(db, 'user').withConverter(userConverter)

  function onImageChange(e: any) {
    if (e.target.files && e.target.files.length > 0) {
      setImageURL(URL.createObjectURL(e.target.files[0]))
      const imageFile = e.target.files[0]

      // Upload Image to Storage
      uploadBytesResumable(ref(storage, `image/event/${event?.eventId}/proof/${imageFile.name}`), imageFile).then((snapshot) => {
        // Get URL
        getDownloadURL(snapshot.ref).then((value) => {
          // Add to firestore
          updateDoc(doc(db, 'event', `${event?.eventId}/registeredUsers/${userAuth?.userId}`).withConverter(eventRegisteredUsersConverter), {
            proof: value
            // status: "Registered",
          }).then(() => {
            setIsSubmitting(false)
            router.push(`/event/${event?.eventId}`)
          })
        })
      })
      //TODO: show toast / alert after update
      console.log('uploaded proof')
    }
  }

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
  console.log(loading, error, event, !loading && (!event || error))

  if (!loading && (!event || error)) {
    return <NotFoundPage />
  }

  const registerEvent = () => {
    //TODO: kasih terms and condition dulu mungkin, pokoknya ada prosesnya, biar gabisa gasengajar keklik. terus validasi juga, profile udah complete belom
    // updateDoc(doc(db, 'event', `${eventId}`), {
    //   users: arrayUnion(doc(db, 'user', `${userAuth?.userId}`)),
    // }).then(() => {
    //   console.log('Register Success') // TODO: create alert / toast
    // })
    const expectedDeadline = moment().add(3, 'd') //TODO: fix deadline? ini jadi 3 hari setelah regis
    const startDate = moment(event?.startDate?.toDate())
    const isDeadlineBeforeStartDate = expectedDeadline.diff(startDate) < 0 // jadi kalo deadlinenya tryt setelah start date, ya pakenya start date eventnya

    setDoc(doc(db, `event/${eventId}/registeredUsers/${userAuth?.userId}`).withConverter(eventRegisteredUsersConverter), {
      isPresent: false,
      paymentDeadline: isDeadlineBeforeStartDate ? Timestamp.fromDate(expectedDeadline.toDate()) : (event?.startDate as Timestamp), //TODO: test
      status: 'Pending',
      proof: '' //TODO: fix
    }).then(() => {
      setShowModal(false)
    })

    // addDoc(collection(db, `event/${eventId}/registeredUsers`).withConverter(eventRegisteredUsersConverter), {
    //   isPresent: false,
    //   paymentDeadline: isDeadlineBeforeStartDate ? Timestamp.fromDate(expectedDeadline.toDate()) : (event?.startDate as Timestamp), //TODO: test
    //   status: 'Pending',
    //   user: doc(db, 'user', `${userAuth?.userId}`),
    //   proof: '', //TODO: fix
    // }).then(() => {
    //   console.log('Register Success') // TODO: create alert / toast
    // })
  }

  const unregisterEvent = () => {
    //TODO: unregister jadi gak ya
    updateDoc(doc(db, 'event', `${eventId}/registeredUsers/${userAuth?.userId}`), {
      status: ''
    }).then(() => {
      console.log('Unregister success') // TODO: create alert / toast
      setShowModal(false)
    })
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

        <div className="flex flex-col gap-5 w-full lg:w-[45%]">
          <div className="">
            <b className="text-gray-600">About the Event</b>
            <Linkify
              componentDecorator={(decoratedHref, decoratedText, key) => (
                <a target="_blank" rel="noreferrer" href={decoratedHref} key={key} className="text-sky-500">
                  {decoratedText}
                </a>
              )}
            >
              <p className="text-justify break-all whitespace-pre-wrap">{event?.description.trim() || '-'}</p>
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
        <div className="flex border flex-col rounded-lg p-4 shadow-lg w-full lg:w-[25%] justify-between">
          <div className="flex-col flex gap-3">
            {registerStatus === 'Pending' ? (
              <>
                <b className="text-sky-500 text-justify">Your registration is being reviewed by the organization&apos; admin!</b>
                {event?.fee?.amount !== 0 && event?.registeredUsers?.find((ru) => ru.userId === userAuth?.userId)?.proof !== null && (
                  <div className="flex flex-col">
                    {/* TODO: kalo udah upload, show gambarnya */}
                    <b>Upload Payment Proof</b>
                    <p className="flex items-center whitespace-pre-wrap text-justify">{event?.fee?.description}</p>
                    <label className={`relative flex flex-col w-full border-4 border-dashed  hover:bg-gray-100 hover:border-gray-300 h-full cursor-pointer`}>
                      {imageURL ? (
                        <Image src={imageURL} alt="Event Image" sizes="100%" layout="fill" className="relative" objectFit="contain" />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-7 h-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400 group-hover:text-gray-600 " viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                          <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">Select a photo</p>
                        </div>
                      )}
                      <input type="file" accept="image/*" className="opacity-0" onChange={onImageChange} />
                    </label>
                  </div>
                )}
              </>
            ) : registerStatus === 'Registered' ? (
              <>
                <b className="text-sky-500 text-justify">You have succesfully registered to this event!</b>

                <div>
                  <b className="text-gray-600">Announcement</b>
                  <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a target="_blank" rel="noreferrer" href={decoratedHref} key={key} className="text-sky-500">
                        {decoratedText}
                      </a>
                    )}
                  >
                    <p className="text-justify break-all whitespace-pre-wrap">{event?.postRegistrationDescription?.trim() || '-'}</p>
                  </Linkify>
                </div>
              </>
            ) : (
              <>
                <div className=" ">
                  <b className="text-gray-600">Register Yourself Before</b>
                  <p className="flex items-center">
                    <FaCalendar className="mr-2 text-gray-400" />
                    {getDateFormat(event?.maxRegistrationDate)}
                  </p>
                  <p className="flex items-center">
                    <FaClock className="mr-2 text-gray-400" />

                    {getTimeFormat(event?.maxRegistrationDate)}
                  </p>
                </div>
              </>
            )}
            {event?.fee?.amount !== 0 && (
              <div className=" ">
                <b className="text-gray-600">Registration Fee</b>
                <p className="flex items-center">
                  <IoMdPricetag className="mr-2 text-gray-400" />
                  {getMoneyFormat(event?.fee?.amount)}
                </p>
              </div>
            )}
            <div>
              <b className="text-gray-600">Available Slots</b>
              <p className="flex items-center">
                <BsPeopleFill className="mr-2 text-gray-400" />
                {event?.registeredUsers?.filter((ru) => ru.status === 'Registered').length} / {event?.capacity}
                {/* {event?.users?.length} / {event?.capacity} */}
              </p>
            </div>
          </div>
          {/* TODO: validasi juga kalo slot udah penuh */}
          {registerStatus === 'Pending' ? (
            <Button onClick={() => setShowModal(true)} color={'red'}>
              Unregister
            </Button>
          ) : registerStatus === 'Registered' ? (
            <Button onClick={unregisterEvent} color={'red'}>
              Unregister
            </Button>
          ) : (
            <Button onClick={() => setShowModal(true)}>Register</Button>
          )}

          {showModal && registerStatus === 'Pending' ? (
            <Modal content="Are you sure you want to unregister?" onClose={() => setShowModal(false)} onRegister={() => unregisterEvent()} />
          ) : showModal && registerStatus === 'Registered' ? (
            <Modal content="Are you sure you want to unregister?" onClose={() => setShowModal(false)} onRegister={() => unregisterEvent()} />
          ) : showModal && registerStatus === '' ? (
            <Modal content="Are you sure you want to register?" onClose={() => setShowModal(false)} onRegister={() => registerEvent()} />
          ) : showModal ? (
            <Modal content="Are you sure you want to register?" onClose={() => setShowModal(false)} onRegister={() => registerEvent()} />
          ) : null}
        </div>
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
