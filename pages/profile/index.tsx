import { FaCalendar, FaUser } from 'react-icons/fa'
import { IoMdArrowBack } from 'react-icons/io'
import NotFoundPage from '../404'
import { useAuth } from '../../lib/authContext'
import { useRouter } from 'next/router'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { collection, limit, orderBy, query } from 'firebase/firestore'
import { db } from '../../lib/firebaseConfig/init'
import { eventConverter } from '../../lib/types/Event'
import Card from '../../components/event/card'
import Link from 'next/link'
import { BiPencil } from 'react-icons/bi'

const EventDetail = () => {
  const router = useRouter()
  const { user, loading: loadAuth } = useAuth()

  const ref = collection(db, 'event').withConverter(eventConverter)
  const [data, loading, error] = useCollectionData(query(ref, orderBy('startDate', 'asc'), limit(3)))
  if (loadAuth || loading) {
    return <>Loading</>
  }

  if (!user) {
    return <NotFoundPage />
  }

  return (
    <div className="px-10">
      <div className="flex items-center">
        <div onClick={() => router.back()}>
          <IoMdArrowBack className="mr-2 text-xl cursor-pointer" />
        </div>
        <h4 className="font-secondary text-2xl mb-1 gap-2 flex md:flex-row flex-col ">
          <b>View Profile</b>
        </h4>
      </div>
      <div>
        <div className="w-full mx-2 h-64">
          <div className="w-1/3 bg-white p-3 hover:shadow">
            <div className="flex items-center justify-between px-2 font-semibold text-gray-900 leading-8">
              <div className="flex items-center gap-2">
                <FaUser className="mr-1" />
                <span className="tracking-wide">Profile</span>
              </div>
              <Link href={'/profile/edit'} passHref>
                <BiPencil className="cursor-pointer" />
              </Link>
            </div>
            <div className="text-gray-700">
              <div className="grid grid-cols-2 text-sm">
                <div className="px-4 py-2 font-semibold">Name</div>
                <div className="px-4 py-2">{user?.name}</div>
                <div className="px-4 py-2 font-semibold">Email</div>
                <div className="px-4 py-2">
                  <a className="text-blue-800" href={`mailto:${user?.email}`}>
                    {user?.email}
                  </a>
                </div>
                <div className="px-4 py-2 font-semibold">Line ID</div>
                <div className="px-4 py-2">{user?.lineID != null ? user.lineID : '-'}</div>
                <div className="px-4 py-2 font-semibold">Phone Number</div>
                <div className="px-4 py-2">{user?.phoneNumber != null ? user.phoneNumber : '-'}</div>
                <div className="px-4 py-2 font-semibold">Instagram</div>
                <div className="px-4 py-2">{user?.instagram != null ? user.instagram : '-'}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 shadow-sm rounded-sm">
          <div className="bg-white p-3 hover:shadow">
            <div>
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                <FaCalendar className="mr-1" />
                <span className="tracking-wide">Registered Event</span>
              </div>
              <div className="grid grid-cols-3 space-y-2 gap-8">
                {data?.map((d) => (
                  <Card key={d.eventId} event={d} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
