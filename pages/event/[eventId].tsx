import { FaCalendar, FaClock, FaMoneyBillWaveAlt } from 'react-icons/fa'
import { BsPeopleFill } from 'react-icons/bs'
import { GiAchievement } from 'react-icons/gi'
import { IoMdArrowBack } from 'react-icons/io'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Timestamp, addDoc, collection, doc, limit, query, where } from 'firebase/firestore'
import { db } from '../../lib/firebaseConfig/init'
import { Benefit, eventConverter, eventRegisteredUsersConverter } from '../../lib/types/Event'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import NotFoundPage from '../404'
import { useAuth } from '../../lib/authContext'
import { organizationConverter } from '../../lib/types/Organization'
import { userConverter } from '../../lib/types/User'

const EventDetail = () => {
  const router = useRouter()
  const { user: userAuth, loading: loadAuth } = useAuth()
  const { eventId } = router.query

  const userRef = collection(db, 'user').withConverter(userConverter)
  const [user, loadingUser, errorUser] = useCollectionData(query(userRef, where('email', '==', `${userAuth?.email}`), limit(1)))
  console.log(userRef)

  const eventRef = doc(db, 'event', `${eventId}`).withConverter(eventConverter)
  const [event, loadingEvent, errorEvent, snapshot] = useDocumentData(eventRef)

  // const registeredUsersRef = collection(db, 'event', `${eventId}`, 'registeredUsers') //.withConverter(eventConverter);
  // const [registeredUsers, loadingRegisteredUsers, errorRegisteredUsers] = useCollectionData(registeredUsersRef)

  const orgRef = event?.organization.withConverter(organizationConverter)
  const [organization, loadingOrg, errorOrg] = useDocumentData(orgRef)

  const isRegistered = user && user.length > 0 && event && event.users && event.users.length > 0 && event.users.some((u) => u.id === user[0].userId)

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

    addDoc(collection(db, `event/${eventId}/registeredUsers`).withConverter(eventRegisteredUsersConverter), {
      isPresent: false,
      paymentDeadline: event?.startDate as Timestamp, //TODO: fix,
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
    <div className="px-40">
      <div className="flex items-center">
        <div onClick={() => router.back()}>
          <IoMdArrowBack className="mr-2 text-xl cursor-pointer" />
        </div>
        <h4 className="font-secondary text-2xl mb-1 gap-2 flex md:flex-row flex-col ">
          <b>{event?.name}</b> <span className="text-gray-400">({organization?.name})</span>
        </h4>
      </div>
      <div className="overflow-hidden">
        <Image className="rounded-xl" objectFit="contain" src={`${event?.image}`} alt="event-poster" width={150} height={150} />
      </div>
      <p className="text-justify">{event?.description} </p>
      <p className="flex items-center">
        <FaCalendar className="mr-1" />
        {event?.startDate?.toDate().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
      <p className="flex items-center">
        <FaClock className="mr-1" />
        {event?.startDate?.toDate().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        })}{' '}
        - {event?.endDate?.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
      </p>
      <p className="flex items-center">
        <BsPeopleFill className="mr-1" />
        {event?.users?.length} / {event?.capacity}
      </p>

      <div className="pt-4">
        <b>Benefit:</b>
        <p className="flex items-baseline">
          <GiAchievement className="mr-1" />
          {event?.benefit?.map((b: Benefit) => (
            <>
              {b.type + ' : ' + b.amount + ' '}
              <br />
            </>
          ))}
        </p>
      </div>

      {event?.fee && (
        <div className="pt-4">
          <b>Registration Fee</b>
          <p className="flex items-center">
            <FaMoneyBillWaveAlt className="mr-1" />
            IDR{event?.fee?.amount}
          </p>
          <p className="flex items-center">Transfer to: {event?.fee?.description}</p>
        </div>
      )}

      <div className="pt-4">
        <b>Registration Deadline</b>
        <p>
          {event?.maxRegistrationDate?.toDate().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div>
        {isRegistered && (
          <button
            className="flex items-center justify-center bg-red-600 text-white font-bold rounded py-3 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
            onClick={unregisterEvent}
          >
            Unregister
          </button>
        )}
        {!isRegistered && (
          <button
            className="flex items-center justify-center bg-sky-400 text-white font-bold rounded py-3 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
            onClick={registerEvent}
          >
            Register
          </button>
        )}
      </div>
    </div>
  )
}

export default EventDetail
