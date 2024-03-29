import { Timestamp, doc, setDoc, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import Image from 'next/image'
import { ReactNode, useState } from 'react'
import { useAuth } from '../../lib/authContext'
import { db, storage } from '../../lib/firebaseConfig/init'
import { Event, eventRegisteredUsersConverter } from '../../lib/types/Event'
import Linkify from 'react-linkify'
import { FaCalendar, FaClock } from 'react-icons/fa'
import { DynamicReactTooltip, getDateFormat, getMoneyFormat, getTimeFormat } from '../../lib/helper/util'
import { IoMdPricetag } from 'react-icons/io'
import { BsPeopleFill } from 'react-icons/bs'
import Button from '../button/Button'
import Modal from '../modal/Modal'
import moment from 'moment'
import { getRegistrantCount } from '../../lib/hook/Event'
import { isProfileComplete } from '../../lib/types/User'
import { BiPencil } from 'react-icons/bi'
import Link from 'next/link'
import { toast } from 'react-toastify'

interface RegistrationCardProps {
  registerStatus?: string
  event: Event
}

interface BaseCardProps {
  content: ReactNode
  button?: ReactNode
  modalContent?: string
  onModalClose?: () => void
  onModalRegister?: () => void
}

const RegistrationCard = ({ registerStatus, event }: RegistrationCardProps) => {
  const { user, loading } = useAuth()
  const [imageURL, setImageURL] = useState<string>()
  const [showModal, setShowModal] = useState(false)
  if (loading) return null
  function onImageChange(e: any) {
    if (e.target.files && e.target.files.length > 0) {
      setImageURL(URL.createObjectURL(e.target.files[0]))
      const imageFile = e.target.files[0]

      // Upload Image to Storage
      uploadBytesResumable(ref(storage, `image/event/${event?.eventId}/proof/${imageFile.name}`), imageFile).then((snapshot) => {
        // Get URL
        getDownloadURL(snapshot.ref).then((value) => {
          // Add to firestore
          updateDoc(doc(db, 'event', `${event?.eventId}/registeredUsers/${user?.userId}`).withConverter(eventRegisteredUsersConverter), {
            proof: value
            // status: "Registered",
          }).then(() => {
            toast('Proof uploaded successfully!', { type: 'success' })
          })
        })
      })
    }
  }

  const registerEvent = () => {
    //TODO: kasih terms and condition dulu mungkin, pokoknya ada prosesnya, biar gabisa gasengajar keklik. terus validasi juga, profile udah complete belom
    const expectedDeadline = moment().add(3, 'd') //TODO: fix deadline? ini jadi 3 hari setelah regis
    const startDate = moment(event?.startDate?.toDate())
    const isDeadlineBeforeStartDate = expectedDeadline.diff(startDate) < 0 // jadi kalo deadlinenya tryt setelah start date, ya pakenya start date eventnya

    setDoc(
      doc(db, `event/${event.eventId}/registeredUsers/${user?.userId}`).withConverter(eventRegisteredUsersConverter),
      {
        isPresent: false,
        paymentDeadline: isDeadlineBeforeStartDate ? Timestamp.fromDate(expectedDeadline.toDate()) : (event?.startDate as Timestamp), //TODO: test
        status: 'Pending'
      }
      // { mergeFields: ['isPresent', 'paymentDeadline', 'status'] }
    ).then(() => {
      toast('You are registered to this event! Please wait for the admin approval', { type: 'success' })
      setShowModal(false)
    })
  }

  const unregisterEvent = () => {
    //TODO: unregister jadi gak ya
    updateDoc(doc(db, 'event', `${event.eventId}/registeredUsers/${user?.userId}`), {
      status: ''
    }).then(() => {
      toast('You are unregistered from this event!', { type: 'info' })

      setShowModal(false)
    })
  }

  const BaseCard = ({ content, button, modalContent, onModalClose, onModalRegister }: BaseCardProps) => {
    return (
      <>
        <div className="flex-col flex gap-3">
          {content}
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
            <b className="text-gray-600">Quota</b>
            <p className="flex items-center">
              <BsPeopleFill className="mr-2 text-gray-400" />
              {getRegistrantCount(event?.registeredUsers)} / {event?.capacity}
              {/* {event?.users?.length} / {event?.capacity} */}
            </p>
          </div>
          {button}
        </div>
        {showModal && <Modal content={modalContent} onClose={onModalClose} onRegister={onModalRegister} />}
      </>
    )
  }

  const PendingCard = () => {
    const proof = event?.registeredUsers?.find((ru) => ru.userId === user?.userId)?.proof
    return (
      <BaseCard
        content={
          <>
            <b className="text-sky-500 text-justify">Your registration is being reviewed by the organization&apos; admin!</b>
            {event?.fee?.amount !== 0 && proof !== null && (
              <div className="flex flex-col gap-1">
                <b>Upload Payment Proof</b>
                <p className="flex items-center whitespace-pre-wrap text-justify">{event?.fee?.description}</p>
                <label className={`relative flex flex-col w-full border-4 border-dashed  hover:bg-gray-100 hover:border-gray-300 h-52 cursor-pointer`}>
                  {imageURL || proof ? (
                    <Image src={imageURL || proof!} alt="Event Image" sizes="100%" layout="fill" className="relative" objectFit="contain" />
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
        }
        button={
          <Button onClick={() => setShowModal(true)} color={'red'}>
            Unregister
          </Button>
        }
        modalContent="Are you sure you want to unregister?"
        onModalClose={() => setShowModal(false)}
        onModalRegister={() => unregisterEvent()}
      />
    )
  }

  const RegisteredCard = () => (
    <BaseCard
      content={
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
              <p className="text-justify whitespace-pre-wrap">{event?.postRegistrationDescription?.trim() || '-'}</p>
            </Linkify>
          </div>
        </>
      }
      // button={
      //   <Button onClick={unregisterEvent} color={'red'}>
      //     Unregister
      //   </Button>
      // }
      // modal={<Modal content="Are you sure you want to unregister?" onClose={() => setShowModal(false)} onRegister={() => unregisterEvent()} />}
    />
  )

  const UnregistredCard = () => (
    <BaseCard
      content={
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
      }
      button={
        <>
          <Button className="w-full" disabled={!isProfileComplete(user!)} onClick={() => setShowModal(true)}>
            <span data-for="disabled-info" data-tip="You need to complete your profile first!" className="w-full">
              Register
            </span>
          </Button>
          {!isProfileComplete(user!) && <DynamicReactTooltip multiline className="max-w-sm text-center leading-5" place="top" id="disabled-info" />}
        </>
      }
      modalContent={'Are you sure want to register?'}
      onModalClose={() => setShowModal(false)}
      onModalRegister={() => registerEvent()}
    />
  )

  const AdminCard = () => (
    <BaseCard
      content={
        <div>
          <b className="text-gray-600">Post-Registration Announcement</b>
          <Linkify
            componentDecorator={(decoratedHref, decoratedText, key) => (
              <a target="_blank" rel="noreferrer" href={decoratedHref} key={key} className="text-sky-500">
                {decoratedText}
              </a>
            )}
          >
            <p className="text-justify whitespace-pre-wrap">{event?.postRegistrationDescription?.trim() || '-'}</p>
          </Linkify>
        </div>
      }
      button={
        <Link passHref href={`/event/${event.eventId}/edit`}>
          <Button className="flex gap-1">
            Edit Event <BiPencil className="text-sm" />
          </Button>
        </Link>
      }
    />
  )

  if (user?.adminOf?.id == event.organization.id) return <AdminCard />
  else if (registerStatus === 'Registered') return <RegisteredCard />
  else if (registerStatus === 'Pending') return <PendingCard />
  else return <UnregistredCard />
}

export default RegistrationCard
