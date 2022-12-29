import { Timestamp } from 'firebase/firestore'
import moment from 'moment'
import dynamic from 'next/dynamic'

export const getMoneyFormat = (num?: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num || 0)
}

export const getDateFormat = (date?: Timestamp) => {
  return date?.toDate().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const getTimeFormat = (date?: Timestamp) => {
  return date?.toDate().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric'
  })
}

export const getDateTimeFormat = (date?: Timestamp) => {
  return moment(date?.toDate()).format('YYYY-MM-DD hh:mm')
}

export const DynamicReactTooltip = dynamic(() => import('react-tooltip'), {
  ssr: false
})
