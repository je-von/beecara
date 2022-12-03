import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { BsInfoCircle } from 'react-icons/bs'
import { useAuth } from '../../lib/authContext'
import { organizationConverter } from '../../lib/types/Organization'

const AddEventPage = () => {
  const router = useRouter()

  const { user, loading } = useAuth()
  const ref = user?.adminOf?.withConverter(organizationConverter)
  const [organization, loadingOrg, error] = useDocumentData(ref)

  //TODO: add spinner / skeleton
  if (loading) return <h1>Loading...</h1>

  if (!loading && (!user || !user.adminOf)) {
    router.push('/')
    return
  }

  return (
    <div className="lg:px-40 md:px-16 px-8 pt-10">
      <Head>
        <title>Add Event | BeeCara</title>
      </Head>

      <div className="flex md:flex-row flex-col relative h-full px-10">
        <div className="md:basis-1/3 w-full h-96 relative">
          <Image className="relative" objectFit="contain" src={'/assets/add_vector.svg'} alt={'Add Event'} sizes="100%" layout="fill" />
        </div>
        <form className="basis-2/3">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                Event Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white place"
                type="text"
                placeholder="Event"
              />
              <p className="text-red-500 text-xs italic">Please fill out this field.</p>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="flex gap-2 uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                Organization <BsInfoCircle />
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
                disabled
                value={organization?.name}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                Description
              </label>
              <textarea
                placeholder="A very fun event"
                className="resize-none h-32 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 va"
              ></textarea>
              <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you&apos;d like</p>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                Start
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white place"
                type="datetime-local"
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="flex gap-2 uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                End
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="datetime-local"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                Location
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white place"
                type="text"
                placeholder="Location"
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="flex gap-2 uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                Capacity
              </label>
              <div className="flex">
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded-l py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                />
                <span className="inline-flex items-center px-3 text-gray-500 bg-gray-200 border border-y-0 border-r-0 border-gray-300 rounded-r ">People</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEventPage
