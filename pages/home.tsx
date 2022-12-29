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
    <div className="lg:px-36 md:px-12 px-4">
      <Head>
        <title>Events | BeeCara</title>
      </Head>

      <EventList />

      {/* Organization Seeder */}
      {/* <button
        onClick={() => {
          const orgs = [
            'HIMMAT',
            'HIMKA',
            'HIMDI',
            'HIMME',
            'HIMA',
            'HIMARS',
            'HIMANDA',
            'AIESEC',
            'B-Preneur',
            'B-VOICE Radio',
            'AIKIDO',
            'HIMSTAT',
            'HIMSISFO',
            'HIMDKV',
            'HIMCOMM',
            'HIMPAR',
            'HIMFOODTECH',
            'HIMTEK',
            'HIMTES',
            'HIMHI',
            'HIMJA',
            'HIMPGSD',
            'HIMPSIKO',
            'HIMSI',
            'BSSC',
            'FOPASBIN',
            'KBMK',
            'KMBD',
            'KMH',
            'KMK',
            'MT Al Khawarizmi',
            'PO',
            'BGDC',
            'BIC',
            'BNCC',
            'BNEC',
            'BNFC',
            'BNMC',
            'BSLC',
            'CSC',
            'IMCB',
            'ISACA',
            'BAND',
            'BDM',
            'BINUS TV Club',
            'KLIFONARA',
            'PARAMABIRA',
            'STAMANARA',
            'BADMINTON',
            'BASIC',
            'BASKET',
            'BNAC',
            'BNSC',
            'BNTC',
            'CAPOEIRA',
            'KARATE',
            'MERPATI PUTIH',
            'SEPAK BOLA',
            'SWANARAPALA',
            'TAEKWONDO',
            'TENIS MEJA',
            'VOLLEY',
            'WUSHU',
            'HIMTI',
            'HOME',
            'HIMTRI',
            'HIMSLAW',
            'TFI Student Community',
            'NIPPON CLUB',
            'STMANIS',
            'HAPKIDO',
          ]

          for (const o of orgs) {
            setDoc(doc(db, 'organization', o), {
              name: o,
            })
          }
        }}
      >
        Tes
      </button> */}
    </div>
  )
}

export default Home
