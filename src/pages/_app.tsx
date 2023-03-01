import { AppProps, type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page)
  const layout = getLayout(<Component {...pageProps} />)
  return (
    <SessionProvider session={session}>
      <ToastContainer />
      {/* <Component {...pageProps} /> */}
      {layout}
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
