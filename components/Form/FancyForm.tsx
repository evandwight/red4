import { useState } from "react"
import { ImSpinner2 } from "react-icons/im";

type PropType = {
    children: JSX.Element[] | JSX.Element,
    onSubmit: (event) => Promise<void>,
    submitButtonText?: string,
    fullWidth?: boolean,
};

export default function FancyForm({ children, onSubmit, submitButtonText, fullWidth }: PropType) {
    const [submitting, setSubmitting] = useState(false);
    const wrappedSubmit = (event) => {
        setSubmitting(true);
        onSubmit(event).finally(() => setSubmitting(false));
    }
    return <form onSubmit={wrappedSubmit}>
        <table className={`${fullWidth ? "w-full" : "w-fit"} table-auto text-left`}>
            <tbody>
                {children}
            </tbody>
        </table>
        <div className="flex flex-row py-2">
            <input
                disabled={submitting}
                className={`block w-fit text-white font-bold my-1 py-1 px-4 rounded ${submitting
                    ? "bg-stone-500"
                    : "bg-fuchsia-600 hover:bg-fuchsia-800"}`}
                type="submit" value={submitButtonText || "Submit"} />
            {submitting && <div className="flex items-center px-2">
                <ImSpinner2 className="animate-spin" size={24} />
            </div>}
        </div>
    </form>
}