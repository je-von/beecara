import EventList from '../components/event/events'
import Head from 'next/head'
import getServerSideProps from '../lib/serverProps'
import { User } from '../lib/types/User'
export { getServerSideProps }
const Home = ({ user }: { user: User }) => {
  return (
    <div className="lg:px-36 md:px-12 px-4">
      <Head>
        <title>Events | BeeCara</title>
      </Head>

      <EventList />
    </div>
  )
}

export default Home
