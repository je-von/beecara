import { useEffect, useRef, useState } from 'react'
import { BsCalendar, BsCheckSquareFill, BsFilter, BsSquare, BsViewStacked } from 'react-icons/bs'
import { useEvents } from '../../lib/hook/Event'
import UnderlineButton from '../button/UnderlineButton'
import CalendarEventView from './calendar'
import Card, { SkeletonCard } from './card'

const BENEFIT_FILTER_LIST = ['SAT Points', 'ComServ Hours']
const STATUS_FILTER_LIST = ['Registered', 'Pending', 'Rejected', 'Unregistered']

const EventList = () => {
  const [showFilterDropdown, setShowFilterDropdown] = useState<Boolean>(false)
  const [isCalendarView, setIsCalendarView] = useState<Boolean>(false)
  const [calendarStyle, setCalendarStyle] = useState('')
  const [benefitFilters, setBenefitFilters] = useState<string[]>([])
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [keyword, setKeyword] = useState('')
  const listHeight = useRef(null)

  const { data, loading, error } = useEvents()

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
      <div className="px-4">
        <h1 className="text-2xl font-black font-secondary">Events</h1>
        <p>Welcome to BeeCara! Providing you available events at the moment and in the future. Register to any of the following events to receive the benefits from SAT, Comserv Hours, and E-Certificate!</p>
      </div>
      <div className="flex flex-col gap-4 px-4">
        <div className="flex md:flex-row flex-col gap-2 justify-between items-center">
          <div className="relative md:w-auto w-full">
            <div className="flex items-center justify-between gap-7 text-sm my-2 relative">
              {!isCalendarView && (
                <div className="relative">
                  <UnderlineButton className="flex gap-2 items-center cursor-pointer" onClick={toggleDropdown}>
                    <BsFilter /> Filter
                  </UnderlineButton>
                  <div className={`${!showFilterDropdown && 'hidden'} fixed z-20 top-0 left-0 w-[100vw] h-[100vh]`} onClick={toggleDropdown}></div>
                  <div className={`${!showFilterDropdown && 'hidden'} absolute z-50 w-52 origin-top-right rounded-md border border-gray-100 bg-white shadow-lg`}>
                    <div className="p-2">
                      <div
                        className="rounded-lg px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-100 hover:text-gray-900 cursor-pointer flex items-center justify-between"
                        onClick={() => {
                          setBenefitFilters(BENEFIT_FILTER_LIST.every((bf) => benefitFilters.includes(bf)) ? [] : BENEFIT_FILTER_LIST)
                        }}
                      >
                        Benefit
                        {BENEFIT_FILTER_LIST.every((bf) => benefitFilters.includes(bf)) ? <BsCheckSquareFill className="text-sky-400" /> : <BsSquare className="text-gray-400" />}
                      </div>

                      {BENEFIT_FILTER_LIST.map((bfl, index) => (
                        <div
                          key={index}
                          className="pl-8 rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer flex items-center justify-between"
                          onClick={() => {
                            setBenefitFilters((filters) => (filters.includes(bfl) ? filters.filter((f) => f != bfl) : filters.concat(bfl)))
                          }}
                        >
                          {bfl}
                          {benefitFilters.includes(bfl) ? <BsCheckSquareFill className="text-sky-400" /> : <BsSquare className="text-gray-400" />}
                        </div>
                      ))}

                      <div
                        className="rounded-lg px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-100 hover:text-gray-900 cursor-pointer flex items-center justify-between"
                        onClick={() => {
                          setStatusFilters(STATUS_FILTER_LIST.every((bf) => statusFilters.includes(bf)) ? [] : STATUS_FILTER_LIST)
                        }}
                      >
                        Status
                        {STATUS_FILTER_LIST.every((bf) => statusFilters.includes(bf)) ? <BsCheckSquareFill className="text-sky-400" /> : <BsSquare className="text-gray-400" />}
                      </div>

                      {STATUS_FILTER_LIST.map((sfl, index) => (
                        <div
                          key={index}
                          className="pl-8 rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer flex items-center justify-between"
                          onClick={() => {
                            setStatusFilters((filters) => (filters.includes(sfl) ? filters.filter((f) => f != sfl) : filters.concat(sfl)))
                          }}
                        >
                          {sfl}
                          {statusFilters.includes(sfl) ? <BsCheckSquareFill className="text-sky-400" /> : <BsSquare className="text-gray-400" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
            </div>
          </div>
          {!isCalendarView && (
            <input
              type="search"
              className="border border-gray-300 rounded-md px-2 py-1 md:w-auto w-full"
              placeholder="Search events..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value.toLowerCase())}
            />
          )}
        </div>
      </div>
      {/* <div className="-translate-y-[120%]"></div> */}
      <div className={'overflow-hidden p-4'}>
        <div
          ref={listHeight}
          className={`transition-all grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-center items-stretch gap-8`}
          style={{
            marginTop: isCalendarView ? `-${(listHeight?.current as any).clientHeight + 40}px` : '0'
          }}
        >
          {loading ? (
            <SkeletonCard />
          ) : (
            data
              ?.filter((d) => d.benefit && benefitFilters.filter((bf) => d.benefit?.find((b) => b.type == bf)).length == benefitFilters.length)
              .filter((d) => d.name.toLowerCase().includes(keyword) || d.organization.id.toLowerCase().includes(keyword))
              .map((d) => <Card key={d.eventId} event={d} statusFilterList={statusFilters} />)
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
