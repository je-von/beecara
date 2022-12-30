import Head from 'next/head'
import { useRouter } from 'next/router'
import { FormProvider, useForm } from 'react-hook-form'
import { Event, eventConverter } from '../../lib/types/Event'
import { organizationConverter } from '../../lib/types/Organization'
import { db } from '../../lib/firebaseConfig/init'
import { addDoc, collection, doc } from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import { User } from '../../lib/types/User'
import { getServerCurrentUser, unauthorizedRedirection } from '../../lib/serverProps'
import EventForm, { EventFormValues } from '../../components/form/EventForm'
import { toast } from 'react-toastify'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getServerCurrentUser(ctx)

  if (user && user.adminOf) {
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        // Karena reference organizationnya pas di parse jadi JSON hilang, jadi daripada useAuth lagi di dalem componentnya, mending gini:
        organizationId: user.adminOf.id
      }
    }
  } else {
    return {
      redirect: unauthorizedRedirection
    }
  }
}

const AddEventPage = ({ user, organizationId }: { user: User; organizationId: string }) => {
  const router = useRouter()
  const organizationRef = doc(db, 'organization', organizationId).withConverter(organizationConverter)

  const methods = useForm<EventFormValues>({ defaultValues: { benefits: [{ amount: '', type: '' }] } })

  const onSubmit = (event: Event) => {
    addDoc(collection(db, 'event').withConverter(eventConverter), event).then(() => {
      toast('Event added successfully!', { type: 'success' })
      router.push('/home')
    })
  }
  return (
    <div className="lg:px-40 md:px-16 px-4 pt-5">
      <Head>
        <title>Add Event | BeeCara</title>
      </Head>

      <FormProvider {...methods}>
        <EventForm formTitle="Add Event" onSubmit={onSubmit} organizationRef={organizationRef} />
      </FormProvider>
    </div>
  )
}

export default AddEventPage
