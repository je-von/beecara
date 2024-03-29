import { doc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { db } from '../../lib/firebaseConfig/init'
import { Event, RegisteredUsers } from '../../lib/types/Event'
import Button from '../button/Button'

interface Props {
  event?: Event
}
const RegistrantTable = ({ event }: Props) => {
  const toggleParticipant = (registeredUser: RegisteredUsers, status: RegisteredUsers['status']) => {
    updateDoc(doc(db, 'event', `${event?.eventId}/registeredUsers/${registeredUser.userId}`), {
      status: status
    }).then(() => {
      toast(`Participant ${registeredUser.user?.name} ${status}!`, { type: 'info' })
    })
  }
  const togglePresence = (userId: string, isPresent: boolean) => {
    updateDoc(doc(db, 'event', `${event?.eventId}/registeredUsers/${userId}`), {
      isPresent: isPresent
    })
  }
  if (!event?.registeredUsers || event?.registeredUsers?.length < 1) {
    return <p className="text-gray-400">No registrant yet!</p>
  }
  return (
    <div className="overflow-x-auto relative shadow-lg">
      <table className="w-full text-sm text-left text-gray-400 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="py-3 px-6">
              Name
            </th>
            <th scope="col" className="py-3 px-6">
              Proof
            </th>
            <th scope="col" className="py-3 px-6 text-center">
              Action
            </th>
            <th scope="col" className="py-3 px-6 text-center">
              Present
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
                  <div className={`w-60 ${ru.status === 'Rejected' ? 'line-through text-gray-400' : ''}`}>
                    {ru.user?.name} <div className="text-gray-400 truncate ">{ru.user?.email}</div>
                  </div>
                </th>
                <td className="py-4 px-6">
                  {' '}
                  <div>
                    {ru?.proof ? (
                      <div>
                        {/* <Image className="" src={`${ru.proof}`} alt="event-poster" width={150} height={150} /> */}
                        <Button color="white" onClick={() => window.open(ru.proof, '_blank')}>
                          View Proof
                        </Button>
                      </div>
                    ) : (
                      'No Proof!'
                    )}
                  </div>
                </td>

                <td className="py-4 px-6 w-[25%] text-center">
                  {ru.status !== 'Rejected' && ru.status !== 'Registered' ? (
                    <div className="flex gap-4 w-full justify-center">
                      <Button
                        onClick={() => {
                          toggleParticipant(ru, 'Registered')
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        color={'red'}
                        onClick={() => {
                          toggleParticipant(ru, 'Rejected')
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <div className={ru.status === 'Registered' ? 'text-sky-500' : 'text-red-500'}>{ru.status}</div>
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  <input
                    type="checkbox"
                    disabled={ru.status === 'Rejected'}
                    checked={ru.isPresent && ru.status !== 'Rejected'}
                    className="bg-gray-100 border-gray-300 text-sky-400 focus:ring-sky-200 rounded"
                    onChange={(e) => togglePresence(ru.userId!, e.target.checked)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default RegistrantTable
