import { DocumentReference, Timestamp, addDoc, collection } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { BsInfoCircle, BsPlusCircle } from 'react-icons/bs'
import ReactTooltip from 'react-tooltip'
import Input from '../../components/form/FormInput'
import { useAuth } from '../../lib/authContext'
import { db, storage } from '../../lib/firebaseConfig/init'
import { Benefit, Fee, eventConverter } from '../../lib/types/Event'
import { organizationConverter } from '../../lib/types/Organization'
interface FormValues {
  name: string
  description: string
  startDate: string
  endDate: string
  location: string
  capacity: number
  benefits: Benefit[]
  image: FileList
  fee: Fee
  postRegistrationDescription: string
  maxRegistrationDate: string
}

const AddEventPage = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const organizationRef = user?.adminOf?.withConverter(organizationConverter)
  const [organization, loadingOrg, error] = useDocumentData(organizationRef)
  const [imageURL, setImageURL] = useState<string>()
  const methods = useForm<FormValues>({ defaultValues: { benefits: [{ amount: '', type: '' }] } })
  const { fields, append } = useFieldArray({
    name: 'benefits',
    control: methods.control,
  })
  const [hasFee, setHasFee] = useState(false)
  const benefitTypes = ['SAT Points', 'ComServ Hours', 'Others']
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const imageFile = data.image[0]

    // Upload Image to Storage
    uploadBytesResumable(ref(storage, `image/event/${imageFile.name}`), imageFile).then((snapshot) => {
      // Get URL
      getDownloadURL(snapshot.ref).then((value) => {
        // Add to firestore
        addDoc(collection(db, 'event').withConverter(eventConverter), {
          name: data.name,
          description: data.description,
          capacity: data.capacity,
          organization: organizationRef as DocumentReference,
          image: value,
          benefit: data.benefits.filter((b) => b.amount),
          startDate: Timestamp.fromDate(new Date(data.startDate)),
          endDate: Timestamp.fromDate(new Date(data.endDate)),
          users: [],
        }).then(() => {
          router.push('/home')
        })
      })
    })
    //TODO: show toast / alert after add
  }

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
    <div className="lg:px-40 md:px-16 px-4 pt-10">
      <Head>
        <title>Add Event | BeeCara</title>
      </Head>

      <FormProvider {...methods}>
        <form className="flex lg:flex-row flex-col h-full px-10 gap-5 mb-10" onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="lg:basis-1/3 w-full lg:h-[70vh] md:h-[50vh] h-48 flex flex-col lg:mb-0 mb-5">
            {/* <Image className="relative" objectFit="contain" src={'/assets/add_vector.svg'} alt={'Add Event'} sizes="100%" layout="fill" /> */}
            <h1 className="text-2xl font-black font-secondary">Add Event</h1>

            <div className=" flex items-center justify-center w-full h-full mt-5 mb-2">
              <label
                className={`relative flex flex-col w-full border-4 border-dashed ${
                  methods.formState.errors.image ? 'border-red-500' : ''
                } hover:bg-gray-100 hover:border-gray-300 h-full cursor-pointer`}
              >
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
                <input type="file" {...methods.register('image', { required: true })} accept="image/*" className="opacity-0" onChange={onImageChange} />
              </label>
            </div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Upload Image (jpg,png,svg,jpeg) *</label>
          </div>
          <div className="lg:basis-2/3">
            <div className="flex flex-wrap -mx-3 mb-6">
              <Input name="name" inputType="text" validation={{ required: true, maxLength: 255 }} placeholder="Event" title="Event Name" width="1/2" />
              <Input
                inputType="text"
                name="organization"
                title={
                  <>
                    Organization{' '}
                    <BsInfoCircle
                      data-for="org-info"
                      data-tip={`You are the admin of <b>${organization?.name}</b>. After submitting, the event you added will be the responsibility of <b>${organization?.name}</b>.`}
                    />
                  </>
                }
                width="1/2"
                isDisabled
                value={`${organization?.name}`}
              />
              <ReactTooltip html multiline className="max-w-sm text-center leading-5" place="bottom" id="org-info" />
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <Input name="description" inputType="textarea" validation={{ required: true }} placeholder="A Very Fun Event" title="Event Description" width="full" />
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <Input name="startDate" inputType="datetime-local" validation={{ required: true }} title="Start Time" width="1/2" />
              <Input name="endDate" inputType="datetime-local" validation={{ required: true }} title="End Time" width="1/2" />
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <Input name="location" inputType="text" validation={{ required: true, maxLength: 255 }} title="Location" width="1/2" placeholder="Location" />
              <Input
                name="capacity"
                inputType="number"
                validation={{ required: true, min: 1 }}
                title="Capacity"
                width="1/2"
                placeholder="Capacity"
                additionalAppend={<span className="inline-flex items-center px-3 text-gray-600 bg-gray-300 rounded-r">People</span>}
              />
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <Input
                name="fee.amount"
                inputType="number"
                validation={{ min: 1000 }}
                isDisabled={!hasFee}
                title={
                  <>
                    <input type="checkbox" className="bg-gray-100 border-gray-300 text-sky-400 focus:ring-sky-200 rounded" onChange={(e) => setHasFee(e.target.checked)} />
                    Fee <BsInfoCircle data-for="fee-info" data-tip={`Leave this field unchecked and empty if this event is <b>FREE</b>.`} />
                  </>
                }
                width="full"
                placeholder="0"
                additionalPrepend={<span className="inline-flex items-center px-3 text-gray-600 bg-gray-300 rounded-l">Rp</span>}
              />
              <ReactTooltip html multiline className="text-center leading-5" place="right" id="fee-info" />
              {hasFee && (
                <Input
                  name="fee.description"
                  inputType="textarea"
                  validation={{ required: hasFee }}
                  placeholder="Put the available payment methods here, e.g: the bank account number and the account holder name. Make sure to describe it clearly and as detail as possible to avoid payment errors at the user's end."
                  title="Fee Description"
                  width="full"
                />
              )}
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="flex gap-2 items-center uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Benefits{' '}
                  <BsPlusCircle
                    strokeWidth={0.5}
                    className="text-lg cursor-pointer hover:text-sky-400 transition hover:scale-105 duration-300 ease-in-out "
                    onClick={() => {
                      if (fields.length < 3) append({ amount: '', type: '' })
                    }}
                  />
                </label>
                {fields.map((f, index) => (
                  <div className="flex mb-3" key={index}>
                    <input
                      {...methods.register(`benefits.${index}.amount`)}
                      className={`appearance-none block w-full bg-white text-gray-700 border-gray-300 focus:ring-sky-400 border rounded py-3 px-4 leading-tight focus:outline-none rounded-r-none`}
                      type={methods.watch(`benefits.${index}.type`) == 'Others' ? 'text' : 'number'}
                    />
                    <select {...methods.register(`benefits.${index}.type`)} className="w-40 inline-flex items-center px-2 text-gray-600 bg-gray-300 rounded-r border-0">
                      <option value="" disabled hidden>
                        Type
                      </option>
                      {benefitTypes
                        .filter((b) => methods.watch(`benefits`).find((m, innerIndex) => innerIndex != index && m.type == b) == null)
                        .map((b, index) => {
                          return (
                            <option value={b} key={index}>
                              {b}
                            </option>
                          )
                        })}
                    </select>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full flex justify-end">
              <button
                type="submit"
                className="flex items-center justify-center bg-sky-400 text-white font-bold rounded py-3 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default AddEventPage
