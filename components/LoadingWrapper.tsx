export default function LoadingWrapper({ ActualEle, children, props, requiredProps}) {
    const missingProps = requiredProps.filter(prop => !prop);
    if (missingProps.length) {
        return <Loading />
    } else {
        return <ActualEle {...props}>
            {children}
        </ActualEle>;
    }
}

export function Loading() {
    return <div>Loading ...</div>
}