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
import { getServerCurrentUser } from '../../../lib/serverProps'
import EventForm, { EventFormValues } from '../../../components/form/EventForm'

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
      router.push('/home')
    })

    //TODO: show toast / alert after update
  }

  return (
    <div className="lg:px-40 md:px-16 px-4 pt-5">
      <Head>
        <title>Edit Event | BeeCara</title>
      </Head>

      <FormProvider {...methods}>
        <EventForm
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
