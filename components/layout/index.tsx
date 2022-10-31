import Header from './header'
import Footer from './footer'
import Head from 'next/head'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>BeeCara</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        {/* <div className="flex-grow"> */}
        {children}
        {/* </div> */}
        <Footer />
      </div>
    </>
  )
}
