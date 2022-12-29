import { FaCalendar, FaUser } from 'react-icons/fa'
import { useAuth } from '../../lib/authContext'
import { useRouter } from 'next/router'
import { Timestamp } from 'firebase/firestore'
import Card from '../../components/event/card'
import Link from 'next/link'
import { BiPencil } from 'react-icons/bi'
import { BsChevronRight } from 'react-icons/bs'
import { useMemo } from 'react'
import { useEvents } from '../../lib/hook/Event'
import { TiWarningOutline } from 'react-icons/ti'
import { isProfileComplete } from '../../lib/types/User'
const ProfilePage = () => {
  const router = useRouter()
  const { user, loading: loadAuth } = useAuth()

  const today = useMemo(() => Timestamp.now(), [])
  const { data, loading, error } = useEvents()
  if (loadAuth || loading) {
    return <>Loading</>
  }

  if (!loadAuth && !user) {
    router.push('/')
    return null
  }

  return (
    <div className="lg:px-40 px-4 md:px-16 mt-8 flex w-full gap-6 justify-between">
      <div className="basis-2/5 bg-white px-6 pt-6 pb-5 h-fit drop-shadow-lg rounded-lg">
        <div className="flex items-center justify-between font-bold text-gray-900">
          <div className="flex items-center gap-2">
            <FaUser className="mr-1" />
            <span className="tracking-wide">Profile</span>
          </div>
          <Link href={'/profile/edit'} passHref>
            <BiPencil className="cursor-pointer hover:text-sky-700" />
          </Link>
        </div>
        <div className="text-gray-700 grid grid-cols-2 text-sm mt-6 gap-4">
          <div className=" font-semibold">Name</div>
          <div className="">{user?.name}</div>
          <div className=" font-semibold">Email</div>
          <div className="">
            <a className="text-sky-400" href={`mailto:${user?.email}`}>
              {user?.email}
            </a>
          </div>
          <div className=" font-semibold">Line ID</div>
          <div className="">{user?.lineID != null ? user.lineID : '-'}</div>
          <div className=" font-semibold">Phone Number</div>
          <div className="">{user?.phoneNumber != null ? user.phoneNumber : '-'}</div>
          <div className=" font-semibold">Instagram</div>
          <div className="">{user?.instagram != null ? user.instagram : '-'}</div>
          {!isProfileComplete(user!) && (
            <div className="col-span-2 text-orange-400 flex items-center gap-1 mt-2">
              <TiWarningOutline className="text-base" /> You haven&apos;t completed your profile!
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 bg-slate-50/10 rounded-lg shadow drop-shadow-sm p-6">
        <div className="flex items-center justify-between font-semibold text-gray-800">
          <div className="flex gap-3 items-center">
            <FaCalendar />
            <h4 className="tracking-wid text-base">Your Upcoming Event</h4>
          </div>
          <Link href={'/profile/upcoming-events'} passHref>
            <div className="flex items-center gap-3 text-base cursor-pointer hover:text-sky-700 font-bold">
              <h5>View All</h5>
              <BsChevronRight className="stroke-1" />
            </div>
          </Link>
        </div>
        <div className="grid grid-cols-1 space-y-2 gap-4 mt-6">
          {data
            ?.filter((d) => d.startDate && d.startDate > today)
            .slice(0, 3)
            .map(
              (d) => d.registeredUsers?.length != 0 && d.registeredUsers?.filter((ru) => ru.userId == user?.userId).map((ru) => <Card key={d.eventId} event={d} horizontalLayout showSlot={false} />)
            )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
