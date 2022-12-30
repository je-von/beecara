import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { BsInfoCircle } from 'react-icons/bs'
import { BiMinusCircle, BiPlusCircle } from 'react-icons/bi'
import Input from '../../../components/form/FormInput'
import { Benefit, Event, Fee, eventConverter } from '../../../lib/types/Event'
import { organizationConverter } from '../../../lib/types/Organization'
import { Fade } from 'react-awesome-reveal'
import ClipLoader from 'react-spinners/ClipLoader'
import Button from '../../../components/button/Button'
import { IoMdArrowBack } from 'react-icons/io'
import { useEvent } from '../../../lib/hook/Event'
import { getDateTimeFormat } from '../../../lib/helper/util'
import { DynamicReactTooltip } from '../../../lib/helper/util'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { db, storage } from '../../../lib/firebaseConfig/init'
import { DocumentReference, Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import { User } from '../../../lib/types/User'
import { getServerCurrentUser } from '../../../lib/serverProps'
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getServerCurrentUser(ctx)

  const eventId = ctx.params?.eventId
  const eventSnapshot = await getDoc(doc(db, 'event', `${eventId}`).withConverter(eventConverter))
  const event = eventSnapshot.data()

  if (user?.adminOf?.id === event?.organization.id) {
    return {
      props: { user: JSON.parse(JSON.stringify(user)) }
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }
}

const EditEventPage = ({ user }: { user: User }) => {
  const router = useRouter()
  const { eventId } = router.query

  const { data: event, loading: loadingEvent } = useEvent(`${eventId}`, true)

  const organizationRef = event?.organization.withConverter(organizationConverter)
  const [organization, loadingOrg, error] = useDocumentData(organizationRef)
  const [imageURL, setImageURL] = useState<string>()
  const methods = useForm<FormValues>({ defaultValues: { benefits: [{ amount: '', type: '' }] } })
  const { fields, append, remove, replace } = useFieldArray({
    name: 'benefits',
    control: methods.control
  })
  const [hasFee, setHasFee] = useState(false)
  const [hasMaxRegDate, setHasMaxRegDate] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const benefitTypes = ['SAT Points', 'ComServ Hours', 'Others']

  useEffect(() => {
    //Prefill form
    if (event) {
      setHasMaxRegDate(event?.maxRegistrationDate !== undefined)
      setHasFee(event?.fee !== undefined)
      methods.setValue('name', event.name)
      methods.setValue('description', event.description)
      methods.setValue('startDate', getDateTimeFormat(event?.startDate))
      methods.setValue('endDate', getDateTimeFormat(event?.endDate))
      methods.setValue('maxRegistrationDate', getDateTimeFormat(event?.maxRegistrationDate))
      methods.setValue('location', event.location)
      methods.setValue('capacity', event.capacity)
      methods.setValue('fee.amount', event.fee?.amount || 0)
      methods.setValue('fee.description', event.fee?.description || '')
      methods.setValue('postRegistrationDescription', event.postRegistrationDescription || '')
      if (event.benefit) {
        const benefits: Benefit[] = []

        for (const b of event.benefit) {
          benefits.push({ amount: b.amount, type: b.type })
        }
        replace(benefits)
      }
    }
  }, [event, replace, methods])

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true)
    const imageFile = data.image[0]

    const updatedData: Event = {
      name: data.name,
      description: data.description,
      capacity: data.capacity,
      organization: organizationRef as DocumentReference,
      image: event?.image,
      benefit: data.benefits.filter((b) => b.amount),
      startDate: Timestamp.fromDate(new Date(data.startDate)),
      endDate: Timestamp.fromDate(new Date(data.endDate)),
      location: data.location,
      fee: hasFee ? data.fee : { amount: 0, description: '' },
      maxRegistrationDate: hasMaxRegDate ? Timestamp.fromDate(new Date(data.maxRegistrationDate)) : Timestamp.fromDate(new Date(data.startDate)),
      postRegistrationDescription: data.postRegistrationDescription
    }

    if (imageFile) {
      const snapshot = await uploadBytesResumable(ref(storage, `image/event/${imageFile.name}`), imageFile)
      const value = await getDownloadURL(snapshot.ref)
      updatedData.image = value
    }
    updateDoc(doc(db, 'event', `${eventId}`).withConverter(eventConverter), updatedData).then(() => {
      setIsSubmitting(false)
      router.push(`/event/${eventId}`)
    })

    //TODO: show toast / alert after update
  }

  function onImageChange(e: any) {
    if (e.target.files && e.target.files.length > 0) setImageURL(URL.createObjectURL(e.target.files[0]))
  }

  return (
    <div className="lg:px-40 md:px-16 px-4 pt-5">
      <Head>
        <title>Edit Event | BeeCara</title>
      </Head>

      <FormProvider {...methods}>
        <form className="flex lg:flex-row flex-col h-full gap-7 mb-10" onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="lg:basis-1/3 w-full lg:h-[70vh] md:h-[50vh] h-48 flex flex-col lg:mb-0 mb-5">
            <div className="flex items-start">
              <div onClick={() => router.back()}>
                <IoMdArrowBack className="mr-2 mt-[0.4rem] text-xl cursor-pointer stroke-black" strokeWidth={40} />
              </div>
              <h1 className="text-2xl font-black font-secondary">Edit Event</h1>
            </div>

            <div className=" flex items-center justify-center w-full h-full mt-5 mb-2">
              <label
                className={`relative flex flex-col w-full border-4 border-dashed ${
                  methods.getFieldState('image', methods.formState).error ? 'border-red-500' : ''
                } hover:bg-gray-100 hover:border-gray-300 h-full cursor-pointer`}
              >
                {imageURL || event?.image ? (
                  <Image src={imageURL || event?.image!} alt="Event Image" sizes="100%" layout="fill" className="relative" objectFit="contain" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-7 h-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400 group-hover:text-gray-600 " viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">Select a photo</p>
                  </div>
                )}
                <input type="file" {...methods.register('image')} accept="image/*" className="opacity-0" onChange={onImageChange} />
              </label>
            </div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Upload Image (jpg,png,svg,jpeg) *</label>
          </div>
          <div className="lg:basis-2/3">
            <div className="flex flex-wrap -mx-3 ">
              <Input name="name" inputType="text" validation={{ required: true, maxLength: 255 }} placeholder="Event" titleLabel="Event Name" width="1/2" />
              <Input
                value={organization?.name}
                inputType="text"
                name="organization"
                titleLabel={
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
              />
              <DynamicReactTooltip html multiline className="max-w-sm text-center leading-5" place="bottom" id="org-info" />
            </div>
            <div className="flex flex-wrap -mx-3 ">
              <Input name="description" inputType="textarea" validation={{ required: true }} placeholder="A Very Fun Event" titleLabel="Event Description" width="full" />
            </div>
            <div className="flex flex-wrap -mx-3 ">
              <Input name="startDate" inputType="datetime-local" validation={{ required: true }} titleLabel="Start Time" width="1/3" />
              <Input name="endDate" inputType="datetime-local" validation={{ required: true }} titleLabel="End Time" width="1/3" />
              {/* TODO: validate date must before start date */}
              <Input
                name="maxRegistrationDate"
                inputType="datetime-local"
                isDisabled={!hasMaxRegDate}
                validation={{ required: hasMaxRegDate }}
                title={'Max Registration Date'}
                titleLabel={
                  <>
                    <input
                      type="checkbox"
                      checked={hasMaxRegDate}
                      className="bg-gray-100 border-gray-300 text-sky-400 focus:ring-sky-200 rounded"
                      onChange={(e) => {
                        setHasMaxRegDate(e.target.checked)
                      }}
                    />
                    <span className="truncate">Max Registration Date </span>
                    <BsInfoCircle
                      data-for="max-reg-date-info"
                      data-tip={`Leave this field unchecked and empty if user may register until the very last minute before the event start (no maximum registration date).`}
                      className="min-w-fit"
                    />
                  </>
                }
                width="1/3"
              />
              <DynamicReactTooltip html multiline className="max-w-sm text-center leading-5" place="bottom" id="max-reg-date-info" />
            </div>
            <div className="flex flex-wrap -mx-3 ">
              <Input name="location" inputType="text" validation={{ required: true, maxLength: 255 }} titleLabel="Location" width="1/2" placeholder="Location" />
              <Input
                name="capacity"
                inputType="number"
                validation={{ required: true, min: 1 }}
                titleLabel="Capacity"
                width="1/2"
                placeholder="Capacity"
                additionalAppend={<span className="inline-flex items-center px-3 text-gray-600 bg-gray-300 rounded-r">People</span>}
              />
            </div>
            <div className="flex flex-wrap -mx-3 ">
              <Input
                name="fee.amount"
                inputType="number"
                validation={{ min: hasFee ? 1000 : undefined, required: hasFee }}
                isDisabled={!hasFee}
                title={'Fee'}
                titleLabel={
                  <>
                    <input
                      checked={hasFee}
                      type="checkbox"
                      className="bg-gray-100 border-gray-300 text-sky-400 focus:ring-sky-200 rounded"
                      onChange={(e) => {
                        setHasFee(e.target.checked)
                        methods.resetField('fee')
                      }}
                    />
                    Fee <BsInfoCircle data-for="fee-info" data-tip={`Leave this field unchecked and empty if this event is <b>FREE</b>.`} />
                  </>
                }
                width="full"
                placeholder="0"
                additionalPrepend={<span className="inline-flex items-center px-3 text-gray-600 bg-gray-300 rounded-l">Rp</span>}
              />
              <DynamicReactTooltip html multiline className="text-center leading-5" place="right" id="fee-info" />
              <Fade triggerOnce className={`w-full ${!hasFee ? 'hidden' : ''}`}>
                <Input
                  name="fee.description"
                  inputType="textarea"
                  isDisabled={!hasFee}
                  validation={{ required: hasFee }}
                  placeholder="Put the available payment methods here, e.g: the bank account number and the account holder name. Make sure to describe it clearly and as detail as possible to avoid payment errors at the user's end."
                  titleLabel="Fee Description"
                  width="full"
                />
              </Fade>
            </div>
            <div className="flex flex-wrap -mx-3 ">
              <div className="w-full px-3">
                <label className="flex gap-2 items-center justify-between uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Benefits{' '}
                  <BiPlusCircle
                    strokeWidth={0.5}
                    className="text-xl cursor-pointer hover:text-sky-400 transition hover:scale-105 duration-300 ease-in-out "
                    onClick={() => {
                      if (fields.length < 3) append({ amount: '', type: '' })
                    }}
                  />
                </label>
                {fields.map((f, index) => {
                  const el = (
                    <>
                      <div className="flex w-full">
                        <input
                          {...methods.register(`benefits.${index}.amount`)}
                          className={`appearance-none block w-full bg-white text-gray-700 border-gray-300 focus:ring-sky-400 border rounded py-3 px-4 leading-tight focus:outline-none rounded-r-none`}
                          type={methods.watch(`benefits.${index}.type`) == 'Others' ? 'text' : 'number'}
                          min={1}
                        />
                        <select
                          {...methods.register(`benefits.${index}.type`)}
                          value={methods.watch(`benefits.${index}.type`)}
                          onChange={(e) => methods.setValue(`benefits.${index}.type`, e.target.value)}
                          className="w-52 inline-flex items-center px-2 text-gray-600 bg-gray-300 rounded-r border-0"
                        >
                          <option value="" hidden>
                            Type
                          </option>
                          {benefitTypes
                            .filter((b) => methods.watch(`benefits`).find((m, innerIndex) => innerIndex != index && m.type == b) == null)
                            .map((b, innerInnerIndex) => {
                              return (
                                <option value={b} key={innerInnerIndex}>
                                  {b}
                                </option>
                              )
                            })}
                        </select>
                      </div>
                      <BiMinusCircle
                        onClick={() => remove(index)}
                        className="ml-3 text-xl min-w-fit cursor-pointer text-red-300 hover:text-red-500 transition hover:scale-105 duration-300 ease-in-out "
                      />
                    </>
                  )
                  if (index === 0)
                    return (
                      <div className="flex mb-3 items-center" key={f.id}>
                        {el}
                      </div>
                    )
                  return (
                    <Fade triggerOnce className="w-full flex mb-3 items-center" key={f.id}>
                      {el}
                    </Fade>
                  )
                })}
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 ">
              <Input
                name="postRegistrationDescription"
                inputType="textarea"
                placeholder="Show a text to the user after they have succesfully registered to this event and their registration has been approved. E.g: zoom meeting link, meeting id, and/or meeting passcode."
                titleLabel="Post-Registration Description"
                width="full"
              />
            </div>
            <div className="w-full flex justify-end">
              <Button isSubmitButton className={isSubmitting ? 'cursor-wait' : 'cursor-pointer'}>
                {isSubmitting ? <ClipLoader size={24} color={'#ffffff'} /> : 'SUBMIT'}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default EditEventPage
