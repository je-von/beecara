import { useEffect, useRef, useState } from 'react'
import { BsCalendar, BsCheckSquareFill, BsFilter, BsSquare, BsViewStacked } from 'react-icons/bs'
import { useEvents } from '../../lib/hook/EventRegistrant'
import UnderlineButton from '../button/UnderlineButton'
import CalendarEventView from './calendar'
import Card, { SkeletonCard } from './card'

const EventList = () => {
  const [showFilterDropdown, setShowFilterDropdown] = useState<Boolean>(false)
  const [isCalendarView, setIsCalendarView] = useState<Boolean>(false)
  const [calendarStyle, setCalendarStyle] = useState('')
  const [benefitFilters, setFilters] = useState<string[]>([])
  const [keyword, setKeyword] = useState('')
  const listHeight = useRef(null)
  // const ref = collection(db, 'event').withConverter(eventConverter)
  // const [data, loading, error] = useCollectionData(query(ref, orderBy('startDate', 'asc')))
  const { data, loading, error } = useEvents('Registered')
  useEffect(() => {
    console.log(benefitFilters)
  }, [benefitFilters])

  useEffect(() => {
    if (isCalendarView === false) {
      setTimeout(() => {
        setCalendarStyle('hidden')
      }, 300)
    } else setCalendarStyle('')
  }, [isCalendarView])

  const toggleDropdown = () => setShowFilterDropdown((s) => !s)

  return (
    <div className="py-5 flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-black font-secondary">Events</h1>
        <p>Blablabla, kasih text gitu kek: register to any of the following events to increase your SAT ato apa gt!</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex md:flex-row flex-col gap-2 justify-between items-center">
          <div className="relative">
            <div className="flex items-center gap-7 text-sm my-2 relative">
              <UnderlineButton className="flex gap-2 items-center cursor-pointer" onClick={() => setIsCalendarView(!isCalendarView)}>
                {isCalendarView ? (
                  <>
                    <BsViewStacked />
                    Change to List View
                  </>
                ) : (
                  <>
                    <BsCalendar />
                    Change to Calendar View
                  </>
                )}
              </UnderlineButton>
              {!isCalendarView && (
                <div className="relative">
                  <UnderlineButton className="flex gap-2 items-center cursor-pointer" onClick={toggleDropdown}>
                    <BsFilter /> Filter
                  </UnderlineButton>
                  <div className={`${!showFilterDropdown && 'hidden'} fixed z-20 top-0 left-0 w-[100vw] h-[100vh]`} onClick={toggleDropdown}></div>
                  <div className={`${!showFilterDropdown && 'hidden'} absolute z-50 w-52 origin-top-right rounded-md border border-gray-100 bg-white shadow-lg`}>
                    <div className="p-2">
                      {['SAT Points', 'ComServ Hours'].map((e, index) => (
                        <div
                          key={index}
                          className="rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer flex items-center justify-between"
                          onClick={() => {
                            setFilters((filters) => (filters.includes(e) ? filters.filter((f) => f != e) : filters.concat(e)))
                          }}
                        >
                          {e}
                          {benefitFilters.includes(e) ? <BsCheckSquareFill className="text-sky-400" /> : <BsSquare className="text-gray-400" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {!isCalendarView && (
            <input
              type="search"
              className="border border-gray-300 rounded-md px-2 py-1"
              placeholder="Search events..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value.toLowerCase())}
            />
          )}
        </div>
      </div>
      {/* <div className="-translate-y-[120%]"></div> */}
      <div className="overflow-hidden pb-4">
        <div
          ref={listHeight}
          className={`transition-all grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-center items-stretch gap-8`}
          style={{
            marginTop: isCalendarView ? `-${listHeight?.current?.clientHeight + 20}px` : '0',
          }}
        >
          {loading ? (
            <SkeletonCard />
          ) : (
            data
              ?.filter((d) => d.benefit && benefitFilters.filter((bf) => d.benefit?.find((b) => b.type == bf)).length == benefitFilters.length)
              .filter((d) => d.name.toLowerCase().includes(keyword) || d.organization.id.toLowerCase().includes(keyword))
              .map((d) => <Card key={d.eventId} event={d} />)
          )}
        </div>
        <div className={`transition-all mt-8 ${calendarStyle}`}>
          <CalendarEventView events={data} />
        </div>
      </div>
    </div>
  )
}

export default EventList
