import { doc, updateDoc } from 'firebase/firestore'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { IoMdArrowBack } from 'react-icons/io'
import ClipLoader from 'react-spinners/ClipLoader'
import Button from '../../components/button/Button'
import Input from '../../components/form/FormInput'
import getServerSideProps from '../../lib/serverProps'
import { db } from '../../lib/firebaseConfig/init'
import { User } from '../../lib/types/User'
interface FormValues {
  lineID: string
  instagram: string
  phoneNumber: string
}
export { getServerSideProps }
const EditProfilePage = ({ user }: { user: User }) => {
  const router = useRouter()
  const methods = useForm<FormValues>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsSubmitting(true)

    user &&
      updateDoc(doc(db, 'user', user?.userId), {
        lineID: data.lineID,
        instagram: data.instagram,
        phoneNumber: data.phoneNumber
      }).then(() => {
        setIsSubmitting(false)

        router.push('/profile')
      })
    //TODO: show toast / alert after add
  }

  return (
    <div className="lg:px-40 md:px-16 px-4 pt-10">
      <Head>
        <title>Edit Profile | BeeCara</title>
      </Head>

      <FormProvider {...methods}>
        <form className="flex lg:flex-row flex-col h-full px-10 gap-7 mb-10" onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="lg:basis-1/3 flex">
            <div onClick={() => router.back()}>
              <IoMdArrowBack className="mr-2 text-xl cursor-pointer" />
            </div>
            <h1 className="text-2xl font-black font-secondary">Edit Profile</h1>
          </div>
          <div className="lg:basis-2/3">
            <div className="flex flex-wrap -mx-3">
              <Input name="name" inputType="text" titleLabel="Name" placeholder={user?.name} isDisabled={true} width="full" />
            </div>
            <div className="flex flex-wrap -mx-3">
              <Input name="email" inputType="text" titleLabel="Email" placeholder={user?.email} isDisabled={true} width="full" />
            </div>
            <div className="flex flex-wrap -mx-3">
              <Input name="lineID" inputType="text" validation={{ required: true, maxLength: 255 }} placeholder="Line ID" value={user?.lineID} titleLabel="Line ID" width="full" />
            </div>
            <div className="flex flex-wrap -mx-3">
              <Input name="instagram" inputType="text" validation={{ required: true, maxLength: 255 }} placeholder="@example" value={user?.instagram} titleLabel="Username Instagram" width="full" />
            </div>
            <div className="flex flex-wrap -mx-3">
              <Input
                name="phoneNumber"
                inputType="tel"
                validation={{ required: true, maxLength: 15, minLength: 12 }}
                placeholder="08XXXXXXXXXX"
                value={user?.phoneNumber}
                titleLabel="Phone Number"
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

export default EditProfilePage
