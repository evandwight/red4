export default function ErrorList({errors}) {
    return !errors || !errors.length ? <></> : <div className="text-red-600">
            {errors.map((err, i) => <div key={i}>
                {err}
                </div>)}
        </div>
}