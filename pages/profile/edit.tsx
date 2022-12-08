import { doc, updateDoc } from 'firebase/firestore'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { IoMdArrowBack } from 'react-icons/io'
import ReactTooltip from 'react-tooltip'
import Input from '../../components/form/FormInput'
import { useAuth } from '../../lib/authContext'
import { db} from '../../lib/firebaseConfig/init'
interface FormValues {
    lineID: string,
    instagram: string,
    phoneNumber: string,
}

const AddEventPage = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const methods = useForm<FormValues>()
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    user && updateDoc(doc(db, 'user', user?.userId), {
        lineID: data.lineID,
        instagram: data.instagram,
        phoneNumber: data.phoneNumber,
    }).then(() => {
        router.push('/profile/view')
    })
    //TODO: show toast / alert after add
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
        <title>Edit Profile | BeeCara</title>
      </Head>

      <FormProvider {...methods}>
        <form className="flex lg:flex-row flex-col h-full px-10 gap-7 mb-10" onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="lg:basis-1/3 flex">
          <div onClick={() => router.back()} >
                <IoMdArrowBack className="mr-2 text-xl cursor-pointer" />
                </div>
            <h1 className="text-2xl font-black font-secondary">Edit Profile</h1>
          </div>
          <div className="lg:basis-2/3">
            <div className="flex flex-wrap -mx-3 mb-6">
              <Input name="name" inputType="text" titleLabel="Name" placeholder={user?.name} isDisabled={true} width="full" />
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <Input name="email" inputType="text" titleLabel="Email" placeholder={user?.email} isDisabled={true} width="full" />
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <Input name="lineID" inputType="text" validation={{ required: true, maxLength: 255 }} placeholder="Line ID" value={user?.lineID} titleLabel="Line ID" width="full" />
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <Input name="instagram" inputType="text" validation={{ required: true, maxLength: 255 }} placeholder="@example" value={user?.instagram} titleLabel="Username Instagram" width="full" />
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <Input name="phoneNumber" inputType="tel" validation={{ required: true, maxLength: 15, minLength:12 }} placeholder="08XXXXXXXXXX" value={user?.phoneNumber} titleLabel="Phone Number" width="full" />
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
