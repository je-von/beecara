import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { BsInfoCircle, BsPlusCircle } from 'react-icons/bs'
import { useAuth } from '../../lib/authContext'
import { organizationConverter } from '../../lib/types/Organization'

const AddEventPage = () => {
  const router = useRouter()

  const { user, loading } = useAuth()
  const ref = user?.adminOf?.withConverter(organizationConverter)
  const [organization, loadingOrg, error] = useDocumentData(ref)

  const [imageURL, setImageURL] = useState<string>()

  function onImageChange(e: any) {
    if (e.target.files && e.target.files.length > 0) setImageURL(URL.createObjectURL(e.target.files[0]))
  }

  //TODO: add spinner / skeleton
  if (loading) return <h1>Loading...</h1>

  //TODO: middleware
  //   if (!loading && (!user || !user.adminOf)) {
  //     router.push('/')
  //     return
  //   }

  return (
    <div className="lg:px-40 md:px-16 px-8 pt-10">
      <Head>
        <title>Add Event | BeeCara</title>
      </Head>

      <form className="flex lg:flex-row flex-col h-full px-10 gap-5 mb-10">
        <div className="lg:basis-1/3 w-full lg:h-[70vh] md:h-[50vh] h-48 flex flex-col lg:mb-0 mb-5">
          {/* <Image className="relative" objectFit="contain" src={'/assets/add_vector.svg'} alt={'Add Event'} sizes="100%" layout="fill" /> */}
          <h1 className="text-2xl font-black font-secondary">Add Event</h1>

          <div className=" flex items-center justify-center w-full h-full mt-5 mb-2">
            <label className="relative flex flex-col w-full border-4 border-dashed hover:bg-gray-100 hover:border-gray-300 h-full cursor-pointer">
              {imageURL ? (
                <Image src={imageURL} alt="Event Image" sizes="100%" layout="fill" className="relative" objectFit="contain" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-7 h-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400 group-hover:text-gray-600 " viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">Select a photo</p>
                </div>
              )}
              <input type="file" accept="image/*" className="opacity-0" onChange={onImageChange} />
            </label>
          </div>
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Upload Image (jpg,png,svg,jpeg)</label>
        </div>
        <div className="lg:basis-2/3">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Event Name</label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white place"
                type="text"
                placeholder="Event"
              />
              <p className="text-red-500 text-xs italic">Please fill out this field.</p>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="flex gap-2 uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Organization <BsInfoCircle />
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
                disabled
                value={`${organization?.name}`}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Description</label>
              <textarea
                placeholder="A very fun event"
                className="resize-none h-32 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 va"
              ></textarea>
              <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you&apos;d like</p>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Start</label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white place"
                type="datetime-local"
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="flex gap-2 uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">End</label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="datetime-local"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Location</label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white place"
                type="text"
                placeholder="Location"
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="flex gap-2 uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Capacity</label>
              <div className="flex">
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded-l py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                />
                <span className="inline-flex items-center px-3 text-gray-500 bg-gray-200 border border-y-0 border-r-0 border-gray-300 rounded-r ">People</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="flex gap-2 items-center uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Benefits <BsPlusCircle className="text-lg cursor-pointer hover:text-black" />
              </label>
              <div className="flex">
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded-l py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                />
                <select className="w-40 inline-flex items-center px-3 text-gray-500 bg-gray-200 border border-y-0 border-r-0 border-gray-300 rounded-r ">
                  <option value="SAT">SAT</option>
                  <option value="SAT">Comserv</option>
                </select>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <button className="flex items-center justify-center bg-sky-400 text-white font-bold rounded py-3 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
              SUBMIT
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddEventPage
