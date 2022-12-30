import { FaCalendar } from 'react-icons/fa'
import { IoMdArrowBack } from 'react-icons/io'
import { Timestamp } from 'firebase/firestore'
import Card from '../../components/event/card'
import Link from 'next/link'
import { useMemo } from 'react'
import { useEvents } from '../../lib/hook/Event'

import getServerSideProps from '../../lib/serverProps'
import { User } from '../../lib/types/User'
export { getServerSideProps }
const UpcomingEvents = ({ user }: { user: User }) => {
  const today = useMemo(() => Timestamp.now(), [])
  const { data, loading, error } = useEvents()

  if (loading) {
    return <>Loading</>
  }

  return (
    <div className="lg:px-40 px-4 md:px-16 mt-8">
      <Link href={'/profile'} passHref>
        <div className="flex gap-3 items-center cursor-pointer text-slate-700 hover:text-sky-800">
          <IoMdArrowBack className="text-2xl" />
          <h4 className="font-secondary text-2xl mb-1 gap-2 flex md:flex-row flex-col ">
            <b>Profile</b>
          </h4>
        </div>
      </Link>
      <div>
        <div className="flex w-full gap-6">
          <div className="flex-1 bg-slate-50/10 rounded-lg shadow drop-shadow-sm p-6">
            <div className="flex items-center justify-between font-semibold text-gray-800">
              <div className="flex gap-3 items-center">
                <FaCalendar />
                <h4 className="tracking-wid text-base">Your Upcoming Event</h4>
              </div>
            </div>
            <div className="grid grid-cols-1 space-y-2 gap-4 mt-6">
              {data
                ?.filter((d) => d.startDate && d.startDate > today)
                .map(
                  (d) => d.registeredUsers?.length != 0 && d.registeredUsers?.filter((ru) => ru.userId == user.userId).map((ru) => <Card key={d.eventId} event={d} horizontalLayout showSlot={false} />)
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpcomingEvents
