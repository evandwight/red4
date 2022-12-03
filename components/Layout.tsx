import NextIconLink2 from "components/NextIconLink2";
import { PROFILE } from "lib/paths";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from 'next/link';
import LoginCircle from 'svg/login-circle-line.svg';
import LogoutCircle from 'svg/logout-circle-line.svg';
import ProfileIcon from 'svg/user-settings-line.svg';

export default function Layout({ children, extraButtons, subTitle }
    : { children: any, extraButtons?: any, subTitle?: string }) {
    const { data: session, status } = useSession()

    return <div className="bg-stone-500 custom-word-breaks overflow-x-hidden">
        <Head>
            <title>Mm</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <div className="min-h-screen mx-auto max-w-5xl px-1 bg-stone-900 text-stone-300">
            <div className="flex flex-row w-full">
                <div className="text-fuchsia-500 font-bold">
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a href="/posts">
                        Mm
                    </a>
                </div>
                {subTitle && <div className="text-stone-500 pl-1">- {subTitle}</div>}
                <div className="ml-auto flex flex-row justify-around">
                    {extraButtons}
                    <div className="pl-2">
                        {status === "authenticated"
                            ? <NextIconLink2 href={PROFILE} title="profile">
                                <ProfileIcon className="w-6 fill-green-500" />
                            </NextIconLink2>
                            : status === "loading"
                                ? <button title="profile" disabled>
                                    <ProfileIcon className="w-6 fill-stone-500" />
                                </button>
                                : <button title="profile" onClick={() => signIn('cognito')}>
                                    <ProfileIcon className="w-6 fill-stone-500" />
                                </button>
                        }
                    </div>
                    <div className="pl-2">
                        {status === "loading"
                            ? <button title="login" disabled>
                                <LoginCircle className="w-6 fill-stone-500" />
                            </button>
                            : status === "authenticated"
                                ? <button title="logout" onClick={() => signOut()}>
                                    <LogoutCircle className="w-6  fill-red-500" />
                                </button>
                                : <button title="login" onClick={() => signIn('cognito')}>
                                    <LoginCircle className="w-6 fill-green-500" />
                                </button>}
                    </div>
                </div>
            </div>
            <hr className="border-stone-500" />
            {children}
        </div>
    </div >
}