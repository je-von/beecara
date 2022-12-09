import { Timestamp } from 'firebase/firestore'

export const getMoneyFormat = (num?: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num || 0)
}

export const getDateFormat = (date?: Timestamp) => {
  return date?.toDate().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const getTimeFormat = (date?: Timestamp) => {
  return date?.toDate().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  })
}
