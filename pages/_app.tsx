import Layout from 'components/Layout';
import { useStoreScrollPosition } from 'lib/restoreScroll';
import { SessionProvider } from "next-auth/react";
import '../styles/globals.css';


function MyApp({ Component, pageProps: { session, ...pageProps }, }) {
    useStoreScrollPosition();
    const getLayout = Component.getLayout || (({ Component, pageProps }) => <Layout><Component {...pageProps} /></Layout>)
    return <SessionProvider session={session}>
        {getLayout({ Component, pageProps })}
    </SessionProvider>
}

export default MyApp
