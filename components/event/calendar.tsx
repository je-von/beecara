import { useEffect, useMemo, useState } from 'react'
import { Event } from '../../lib/types/Event'
import Card from './card'

interface CalendarDay {
  day?: number
  date?: Date
}

interface Props {
  initialDate?: Date
  events?: Event[]
}

const CalendarEventView = ({ initialDate, events }: Props) => {
  const getEarliestEventInMonth = (date: Date): Date => {
    const filteredEvent = events?.filter(
      (e) => e.startDate && date && e.startDate.toDate().getMonth() === date.getMonth() && e.startDate.toDate().getFullYear() === date.getFullYear()
    )
    return filteredEvent && filteredEvent?.length > 0 && filteredEvent[0].startDate ? filteredEvent[0].startDate?.toDate() : date
  }

  const calendarHeader = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const colorDateToday = 'bg-blue-600',
    colorDateSelected = 'bg-blue-400',
    colorDateEvent = 'bg-violet-700'
  const [activeDate, setActiveDate] = useState<Date>(initialDate ? initialDate : getEarliestEventInMonth(new Date()))
  const [activeDays, setActiveDays] = useState<CalendarDay[][]>([])

  const today = useMemo(() => new Date(), [])
  useEffect(() => {
    let _active = new Date(activeDate.getFullYear(), activeDate.getMonth(), 1)
    let _prev = new Date(activeDate.getFullYear(), activeDate.getMonth() - 1, 1)
    let _after = new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 1)
    let _prevActiveTotalDay = new Date(activeDate.getFullYear(), activeDate.getMonth(), 0).getDate()
    let _activeTotalDay = new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 0).getDate()
    let _activeStartingDay = _active.getDay()
    let _calendarDays: CalendarDay[] = []

    for (let i = _activeStartingDay; i > 0; i--) {
      if (_active.getFullYear() === today.getFullYear() && _active.getMonth() === today.getMonth()) {
        _calendarDays.push({
          day: undefined,
          date: undefined,
        })
      } else {
        let _d = _prevActiveTotalDay - i + 1
        _calendarDays.push({
          day: _d,
          date: new Date(_prev.getFullYear(), _prev.getMonth(), _d),
        })
      }
    }
    for (let i = 0; i < _activeTotalDay; i++) {
      _calendarDays.push({
        day: i + 1,
        date: new Date(_active.getFullYear(), _active.getMonth(), i + 1),
      })
    }
    for (let i = 0; i <= 38 - _calendarDays.length; i++) {
      let _d = i + 1
      _calendarDays.push({
        day: _d,
        date: new Date(_after.getFullYear(), _after.getMonth(), _d),
      })
    }
    let splitted: CalendarDay[][] = []
    for (let i = 0; i < 5; i++) {
      splitted.push(_calendarDays.slice(7 * i, 7 + 7 * i))
    }
    setActiveDays(splitted)
  }, [activeDate, today])

  const isEqualDate = (firstDate: Date, secondDate: Date) => {
    return firstDate.getDate() === secondDate.getDate() && firstDate.getMonth() === secondDate.getMonth() && firstDate.getFullYear() === secondDate.getFullYear()
  }

  return (
    <div className="flex min-h-[100vh] items-stretch justify-center ">
      <div className="flex flex-col-reverse md:flex-row w-full shadow-lg">
        <div className="flex-1 w-full md:w-2/3 h-full md:py-8 py-5 md:px-16 px-5 bg-[#0290d1]/10 rounded-none rounded-b md:rounded-l">
          <div className="flex flex-col gap-4">
            {events
              ?.filter((ev) => ev.startDate && isEqualDate(ev.startDate?.toDate(), activeDate))
              .map((en, index) => {
                return <Card key={en.eventId} event={en} horizontalLayout />
              })}
          </div>
        </div>
        <div className="p-8 basis-5/12 bg-[#daeffb]/10 rounded-none rounded-t md:rounded-r">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-800 cursor-pointer">
              {activeDate.getFullYear() > today.getFullYear() && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-chevron-left transition-all stroke-1 hover:stroke-2"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  onClick={() => {
                    activeDate.setMonth(activeDate.getMonth() - 1)
                    setActiveDate(getEarliestEventInMonth(new Date(activeDate)))
                  }}
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <polyline points="15 6 9 12 15 18" />
                </svg>
              )}
            </div>
            <h1 className="text-sm md:text-xl font-bold text-gray-800">
              {`${activeDate.toLocaleString('default', {
                month: 'long',
              })} ${activeDate.getFullYear()}`}
            </h1>
            <div className="flex items-center text-gray-800 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-chevron-right transition-all stroke-1 hover:stroke-2"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => {
                  activeDate.setMonth(activeDate.getMonth() + 1)
                  setActiveDate(getEarliestEventInMonth(new Date(activeDate)))
                }}
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-between pt-12">
            <table className="w-full">
              <thead>
                <tr>
                  {calendarHeader.map((header, index) => {
                    return (
                      <th key={index}>
                        <div className="w-full flex justify-center">
                          <p className="text-sm font-medium text-center text-gray-800">{header}</p>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {activeDays.map((dayArr, i) => {
                  return (
                    <tr key={i}>
                      {dayArr.map((day, index) => {
                        return (
                          <td className="pt-4" key={index}>
                            <div
                              className={`cursor-pointer flex w-full items-center justify-center`}
                              onClick={() => {
                                day.date && setActiveDate(day.date)
                              }}
                            >
                              <div
                                className={`h-full rounded-full aspect-square text-center w-6 flex items-center justify-center ${
                                  day.date &&
                                  (isEqualDate(activeDate, day.date)
                                    ? `${colorDateSelected} text-white`
                                    : isEqualDate(today, day.date)
                                    ? `${colorDateToday} text-white`
                                    : events?.some((e) => e.startDate && day.date && isEqualDate(e.startDate?.toDate(), day.date))
                                    ? `${colorDateEvent} text-white`
                                    : activeDate.getMonth() === day.date?.getMonth()
                                    ? 'text-gray-500'
                                    : 'text-gray-300')
                                }`}
                              >
                                <p className={`text-sm font-medium`}>{day.day}</p>
                              </div>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col pt-8 w-full gap-1">
            <div className="flex gap-4 items-center">
              <div className={`w-3 h-full aspect-square rounded-full ${colorDateSelected}`}></div>
              <p className="flex-1 text-sm text-gray-600">Selected</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className={`w-3 h-full aspect-square rounded-full ${colorDateToday}`}></div>
              <p className="flex-1 text-sm text-gray-600">Today</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className={`w-3 h-full aspect-square rounded-full ${colorDateEvent}`}></div>
              <p className="flex-1 text-sm text-gray-600">Available Event</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarEventView
