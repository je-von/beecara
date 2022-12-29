import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebaseConfig/init'
import { Event, RegisteredUsers } from '../../lib/types/Event'
import Button from '../button/Button'

interface Props {
  event?: Event
}
const RegistrantTable = ({ event }: Props) => {
  const toggleParticipant = (userId: string, status: RegisteredUsers['status']) => {
    updateDoc(doc(db, 'event', `${event?.eventId}/registeredUsers/${userId}`), {
      status: status
    }).then(() => {
      console.log('participant ' + status) // TODO: create alert / toast
    })
  }
  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg  ">
      <table className="w-full text-sm text-left text-gray-400 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="py-3 px-6">
              Name
            </th>
            <th scope="col" className="py-3 px-6">
              Proof
            </th>
            <th scope="col" className="py-3 px-6">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {event?.registeredUsers
            // ?.filter(
            //   (ru) =>
            //     // ru.status !== 'Registered' &&
            //     ru.status !== 'Rejected'
            // )
            ?.map((ru) => (
              <tr className="bg-white border-b hover:bg-gray-50 " key={ru.userId}>
                <th scope="row" className="py-4 px-6 font-medium text-gray-900 w-60">
                  <div className="w-60">
                    {ru.user?.name} <div className="text-gray-400 truncate ">{ru.user?.email}</div>
                  </div>
                </th>
                <td className="py-4 px-6">
                  {' '}
                  <div>
                    {ru?.proof ? (
                      <div>
                        {/* <Image className="" src={`${ru.proof}`} alt="event-poster" width={150} height={150} /> */}
                        <Button color="white">View Proof</Button>
                      </div>
                    ) : (
                      'No Proof!'
                    )}
                  </div>
                </td>

                <td className="py-4 px-6 w-[20%]">
                  {ru.status !== 'Rejected' && ru.status !== 'Registered' ? (
                    <div className="flex gap-4 w-full">
                      <Button
                        onClick={() => {
                          toggleParticipant(ru?.userId!, 'Registered')
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        color={'red'}
                        onClick={() => {
                          toggleParticipant(ru?.userId!, 'Rejected')
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <div className="">{ru.status}</div>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default RegistrantTable
