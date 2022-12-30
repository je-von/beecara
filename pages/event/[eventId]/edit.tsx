import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Event, eventConverter } from '../../../lib/types/Event'
import { organizationConverter } from '../../../lib/types/Organization'
import { useEvent } from '../../../lib/hook/Event'
import { getDateTimeFormat } from '../../../lib/helper/util'
import { db } from '../../../lib/firebaseConfig/init'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import { User } from '../../../lib/types/User'
import { getServerCurrentUser, unauthorizedRedirection } from '../../../lib/serverProps'
import EventForm, { EventFormValues } from '../../../components/form/EventForm'
import { toast } from 'react-toastify'

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
      redirect: unauthorizedRedirection
    }
  }
}

const EditEventPage = ({ user }: { user: User }) => {
  const router = useRouter()
  const { eventId } = router.query

  const { data: event, loading } = useEvent(`${eventId}`, true)

  const organizationRef = event?.organization.withConverter(organizationConverter)

  const methods = useForm<EventFormValues>({ defaultValues: { benefits: [{ amount: '', type: '' }] } })

  useEffect(() => {
    //Prefill form
    if (event) {
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
    }
  }, [event, methods])

  const onSubmit = (event: Event) => {
    updateDoc(doc(db, 'event', `${eventId}`).withConverter(eventConverter), event).then(() => {
      toast('Event updated successfully!', { type: 'success' })
      router.push('/home')
    })
  }

  if (loading) return null

  return (
    <div className="lg:px-40 md:px-16 px-4 pt-5">
      <Head>
        <title>Edit Event | BeeCara</title>
      </Head>

      <FormProvider {...methods}>
        <EventForm
          formTitle="Edit Event"
          onSubmit={onSubmit}
          organizationRef={organizationRef!}
          initialImageUrl={event?.image}
          initialHasFee={event?.fee !== undefined}
          initialHasMaxRegDate={event?.maxRegistrationDate !== undefined}
          initialBenefits={event?.benefit}
        />
      </FormProvider>
    </div>
  )
}

export default EditEventPage
