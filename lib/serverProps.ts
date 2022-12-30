import { doc, getDoc } from 'firebase/firestore'
import { GetServerSideProps, GetServerSidePropsContext, PreviewData, Redirect } from 'next'
import { NextParsedUrlQuery } from 'next/dist/server/request-meta'
import { db } from './firebaseConfig/init'
import { authServer } from './session'
import { userConverter } from './types/User'

export const getServerCurrentUser = async (ctx: GetServerSidePropsContext<NextParsedUrlQuery, PreviewData>) => {
  const auth = await authServer(ctx)

  const userSnapshot = await getDoc(doc(db, 'user', `${auth?.uid}`).withConverter(userConverter))
  const user = userSnapshot.data()

  return user
}

export const unauthorizedRedirection: Redirect = {
  permanent: false,
  destination: '/401'
}

// GLOBAL getServerSideProps
const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getServerCurrentUser(ctx)

  if (user) {
    return {
      props: { user: JSON.parse(JSON.stringify(user)) }
    }
  } else {
    return {
      redirect: unauthorizedRedirection
    }
  }
}

export default getServerSideProps
