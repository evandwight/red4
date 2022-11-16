import Layout from 'components/Layout';
import { SessionProvider } from "next-auth/react";
import '../styles/globals.css';


function MyApp({  Component,  pageProps: { session, ...pageProps },}) {
    const getLayout = Component.getLayout || (({Component, pageProps}) => <Layout><Component {...pageProps}/></Layout>)
    return <SessionProvider session={session}>
        {getLayout({Component, pageProps})}
    </SessionProvider>
}

export default MyApp
