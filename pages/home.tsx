import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/authContext'
import Card from '../components/card'

const Home: NextPage = () => {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) return <h1>Loading...</h1>

  if (!user) {
    router.push('/')
    return null
  }
  
  return (
    <div className=" px-40 ">
      {/* <h1>
        Welcome, <b>{user?.claims.name}</b> ({user?.claims.email}) !
      </h1> */}
      <h1 className='text-3xl font-bold'>
        BeeCara
      </h1>
      <p>
        An application for Binusian to seek and join events to get SAT points and Comserv Hour!
      </p>

      <Card  eventID='' image='/assets/logo_binus.png' name='Event 1' organization='HIMSISFO' capacity={2} maxCapacity={100} eventDate={'27 Oct 2022'} benefit={'SAT'}></Card>

    </div>
  )
}

export default Home
