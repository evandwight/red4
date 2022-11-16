import { signIn } from "next-auth/react"

export default function AccessDenied() {
    return (
        <>
            <h1>Access Denied</h1>
            <p>You must be
                <button className="underline px-1" onClick={e => signIn('cognito')}>
                    signed in
                </button>
                to view this page
            </p>
        </>
    )
}