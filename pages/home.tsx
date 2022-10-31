import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/authContext'
import EventList from '../components/event/events'
import Head from 'next/head'
const Home: NextPage = () => {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (!loading && !user) {
    router.push('/')
    return null
  }

  return (
    <div className="lg:px-40 md:px-16 px-8">
      <Head>
        <title>Events | BeeCara</title>
      </Head>

      <EventList />
    </div>
  )
}

export default Home
