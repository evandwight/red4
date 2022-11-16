import { request } from "https";
import Link from "next/link";
import React, { useCallback, useState } from "react";

enum LoadingState {
    None,
    Loading,
    Error,
}

const colorMap = {
    [LoadingState.None]: "fill-fuchsia-500",
    [LoadingState.Loading]: "fill-blue-600",
    [LoadingState.Error]: "fill-red-600",
}

export default function TaskIcon(props: { title: string, func: () => Promise<any>, imageObj: any }) {
    const [loadingState, setLoadingState] = useState(LoadingState.None)
    const {func, title} = props;

    const onClick = useCallback(() => {
        setLoadingState(LoadingState.Loading);
        func()
            .then(() => setLoadingState(LoadingState.None))
            .catch(_ => setLoadingState(LoadingState.Error));
    }, [func]);

    return <button title={title} onClick={onClick} disabled={loadingState === LoadingState.Loading}>
        <props.imageObj className={`w-6 ${colorMap[loadingState]}`} />
    </button>
}