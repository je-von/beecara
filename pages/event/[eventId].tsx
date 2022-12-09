import { FaCalendar, FaClock } from 'react-icons/fa'
import { IoMdArrowBack, IoMdPricetag } from 'react-icons/io'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Timestamp, addDoc, collection, doc, query, updateDoc, where } from 'firebase/firestore'
import { db, storage } from '../../lib/firebaseConfig/init'
import { eventConverter, eventRegisteredUsersConverter } from '../../lib/types/Event'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import NotFoundPage from '../404'
import { useAuth } from '../../lib/authContext'
import { organizationConverter } from '../../lib/types/Organization'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import BenefitTags from '../../components/event/BenefitTags'
import { getDateFormat, getMoneyFormat, getTimeFormat } from '../../lib/helper/util'
import { BsPeopleFill } from 'react-icons/bs'
import moment from 'moment'

interface FormValues {
  proof: File
}

const EventDetail = () => {
  const router = useRouter()
  const { user: userAuth, loading: loadAuth } = useAuth()
  const { eventId } = router.query

  const [imageURL, setImageURL] = useState<string>()

  const eventRef = doc(db, 'event', `${eventId}`).withConverter(eventConverter)
  const [event, loadingEvent, errorEvent, snapshot] = useDocumentData(eventRef)
  const registeredRef = collection(db, `event/${event?.eventId}/registeredUsers`).withConverter(eventRegisteredUsersConverter)
  const [data, loadingRegistered, error] = useCollectionData(query(registeredRef, where('user', '==', doc(db, 'user', `${userAuth?.userId}`))))

  const isRegistered = data?.length && data[0].status

  // const registeredUsersRef = collection(db, 'event', `${eventId}`, 'registeredUsers') //.withConverter(eventConverter);
  // const [registeredUsers, loadingRegisteredUsers, errorRegisteredUsers] = useCollectionData(registeredUsersRef)

  const orgRef = event?.organization.withConverter(organizationConverter)
  const [organization, loadingOrg, errorOrg] = useDocumentData(orgRef)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const methods = useForm<FormValues>()

  useEffect(() => {
    console.log(methods.formState)
  }, [methods.formState])

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsSubmitting(true)
    const imageFile = data.proof

    // Upload Image to Storage
    uploadBytesResumable(ref(storage, `image/event/${imageFile.name}`), imageFile).then((snapshot) => {
      // Get URL
      getDownloadURL(snapshot.ref).then((value) => {
        // Add to firestore
        updateDoc(doc(db, 'event', `${event?.eventId}/registeredUsers`).withConverter(eventRegisteredUsersConverter), {
          proof: value,
          // status: "Registered",
        }).then(() => {
          setIsSubmitting(false)
          router.push('/event/${event?.eventId}')
        })
      })
    })
    //TODO: show toast / alert after update
    console.log('uploaded proof')
  }

  function onImageChange(e: any) {
    if (e.target.files && e.target.files.length > 0) {
      setImageURL(URL.createObjectURL(e.target.files[0]))
      methods.handleSubmit(onSubmit)()
    }
  }

  // useEffect(() => {
  //   console.log(event)
  //   getDocs(collection(db, `event/${eventId}/registeredUsers`)).then((value) => {
  //     value.forEach((v) => console.log(v.data()))
  //   })
  // }, [event])
  if (loadingEvent || loadingOrg) {
    return <>Loading</>
  }

  if (!loadingEvent && (errorEvent || !event)) {
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

    addDoc(collection(db, `event/${eventId}/registeredUsers`).withConverter(eventRegisteredUsersConverter), {
      isPresent: false,
      paymentDeadline: isDeadlineBeforeStartDate ? Timestamp.fromDate(expectedDeadline.toDate()) : (event?.startDate as Timestamp), //TODO: test
      status: 'Pending',
      user: doc(db, 'user', `${userAuth?.userId}`),
      proof: '', //TODO: fix
    }).then(() => {
      console.log('Register Success') // TODO: create alert / toast
    })
  }

  const unregisterEvent = () => {
    //TODO: updatenya nanti change status di dalem collectionnya aja
    // updateDoc(doc(db, 'event', `${eventId}`), {
    //   users: arrayRemove(doc(db, 'user', `${userAuth?.userId}`)),
    // }).then(() => {
    //   console.log('Unregister success') // TODO: create alert / toast
    // })
  }

  return (
    <div className="px-40 pb-5 flex flex-col gap-4">
      <div className="flex items-center">
        <div onClick={() => router.back()}>
          <IoMdArrowBack className="mr-2 text-xl cursor-pointer stroke-black" strokeWidth={40} />
        </div>
        <h4 className="font-secondary text-2xl mb-1 gap-2 flex md:flex-row flex-col ">
          <b>{event?.name}</b> <span className="text-gray-400">({organization?.name})</span>
        </h4>
      </div>
      <div className="grid grid-cols-7 gap-7">
        <div className="h-96 relative rounded-lg shadow-lg border col-span-2">
          {isRegistered ? (
            <div
              className={`absolute top-0 left-0 z-10 text-sm font-bold text-white ${
                data[0].status === 'Registered' ? 'bg-sky-400' : data[0].status === 'Pending' ? 'bg-orange-400' : 'bg-red-400'
              } px-4 py-2 rounded-br-lg rounded-tl-lg`}
            >
              {data[0].status}
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

        <div className="flex w-full flex-col col-span-3 gap-5">
          <div className="">
            <b className="text-gray-600">About the Event</b>
            <p className="text-justify whitespace-pre-wrap">{event?.description.trim()} </p>
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
        <div className="flex border flex-col rounded-lg p-4 shadow-md w-full col-span-2 justify-between">
          <FormProvider {...methods}>
            <div className="flex-col flex gap-3">
              {isRegistered === 'Pending' ? (
                <>
                  <b className="text-sky-500 text-justify">Your registration is being reviewed by the organization&apos; admin!</b>
                  {event?.fee?.amount !== 0 && (
                    <div className="flex flex-col">
                      <b>Upload Payment Proof</b>
                      <p className="flex items-center whitespace-pre-wrap text-justify">{event?.fee?.description}</p>
                      <label
                        className={`relative flex flex-col w-full border-4 border-dashed ${
                          methods.formState.errors.proof ? 'border-red-500' : ''
                        } hover:bg-gray-100 hover:border-gray-300 h-full cursor-pointer`}
                      >
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
                        <input type="file" {...methods.register('proof', { required: true })} accept="image/*" className="opacity-0" onChange={onImageChange} />
                      </label>
                    </div>
                  )}
                </>
              ) : isRegistered === 'Registered' ? (
                <>
                  <b className="text-sky-500 text-justify">You have succesfully registered to this event!</b>

                  <div>
                    <b className="text-gray-600">Announcement</b>
                    <p className="flex items-center text-justify whitespace-pre-wrap">{event?.postRegistrationDescription || '-'}</p>
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
                  {event?.users?.length} / {event?.capacity}
                </p>
              </div>
            </div>
            {/* TODO: validasi juga kalo slot udah penuh */}
            {isRegistered === 'Pending' ? (
              <button
                className="mt-3 flex items-center justify-center bg-red-400 text-white font-bold rounded py-3 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                onClick={unregisterEvent}
              >
                Unregister
              </button>
            ) : isRegistered === 'Registered' ? (
              <button
                className="mt-3 flex items-center justify-center bg-red-400 text-white font-bold rounded py-3 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                onClick={unregisterEvent}
              >
                Unregister
              </button>
            ) : (
              <button
                className="mt-3 flex items-center justify-center bg-sky-400 text-white font-bold rounded py-3 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                onClick={registerEvent}
              >
                Register
              </button>
            )}
          </FormProvider>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
