import { FaCalendar, FaUser } from 'react-icons/fa'
import { IoMdArrowBack } from 'react-icons/io'
import NotFoundPage from '../404'
import { useAuth } from '../../lib/authContext'
import { useRouter } from 'next/router'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import { collection, limit, orderBy, query, where } from 'firebase/firestore'
import { db } from "../../lib/firebaseConfig/init";
import { eventConverter } from "../../lib/types/Event";
import { organizationConverter } from '../../lib/types/Organization'
import Card from '../../components/event/card'

const EventDetail = () => {
    const router = useRouter()
    const { user, loading: loadAuth } = useAuth()

    const ref = collection(db, "event").withConverter(eventConverter);
    const [data, loading, error] = useCollectionData(
        query(ref, orderBy("startDate", "asc"), limit(3))
    );
    if (loadAuth || loading) {
        return <>Loading</>
    }

    if (!user){
        return <NotFoundPage />
    }
  

//   const registerEvent = () => {
//     updateDoc(doc(db, 'event', `${eventId}`), { users: arrayUnion(doc(db, 'user', `${user?.userId}`)) }).then(() => {
//       console.log('Register Success') // TODO: create alert / toast
//     })
//   }

    
    

  return (
    <div className='px-10'>
      <div className="flex items-center">
        <div onClick={() => router.back()}>
          <IoMdArrowBack className="mr-2 text-xl cursor-pointer" />
        </div>
        <h4 className="font-secondary text-2xl mb-1 gap-2 flex md:flex-row flex-col ">
          <b>View Profile</b> 
        </h4>
      </div>
      <div>
      <div className="w-full mx-2 h-64" >
        <div className="bg-white p-3 hover:shadow">
            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <FaUser className="mr-1" />
                <span className="tracking-wide">Profile</span>
            </div>
            <div className="text-gray-700">
                <div className="grid md:grid-cols-2 text-sm">
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Name</div>
                        <div className="px-4 py-2">{user?.name}</div>
                    </div>
                    <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Email</div>
                        <div className="px-4 py-2">
                            <a className="text-blue-800" href="mailto:jane@example.com">{user?.email}</a>
                        </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Line ID</div>
                        <div className="px-4 py-2">{user?.lineID}</div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Phone Number</div>
                        <div className="px-4 py-2">{user?.phoneNumber}</div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Instagram</div>
                        <div className="px-4 py-2">{user?.instagram}</div>
                    </div>
                </div>
            </div>
            <button className="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">Update Profile</button>
        </div>   
        </div>   
        <div className="bg-white p-3 shadow-sm rounded-sm">

        <div className="bg-white p-3 hover:shadow">
            <div>
                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                    <FaCalendar className="mr-1" />
                    <span className="tracking-wide">Registered Event</span>
                </div>
                <ul className="list-inside space-y-2">
                    {data?.map((d) => (
                        <Card key={d.eventId} event={d} />
                        ))
                    }
                </ul>
            </div>
            </div>
      </div>
      </div>
    </div>
  )
}

export default EventDetail
