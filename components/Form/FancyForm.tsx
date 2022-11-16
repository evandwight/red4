export default function FancyForm({ children, onSubmit, submitButtonText }:
    { children: JSX.Element[] | JSX.Element, onSubmit: (event) => void, submitButtonText?: string }) {
    return <form onSubmit={onSubmit}>
        <table className="w-fit table-auto text-left">
            <tbody>
                {children}
            </tbody>
        </table>
        <div className="py-2">
            <input className="block w-fit bg-fuchsia-600 hover:bg-fuchsia-800 text-white font-bold my-1 py-1 px-4 rounded"
                type="submit" value={submitButtonText || "Submit"} />
        </div>
    </form>
}