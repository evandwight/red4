import { ApiUrl, FormErrorType } from "lib/api/ApiUrl";

export function createCustomHandleSubmit<Q, B, R extends FormErrorType | {}>(
    apiUrl: ApiUrl<Q, B, R>,
    formToData: (element: HTMLElement) => B,
    reject: (res: Extract<FormErrorType, R>) => void,
    resolve: (res: Exclude<R, FormErrorType>) => void,
    query?: Q) {
    return async (event): Promise<void> => {
        event.preventDefault();
        const data = formToData(event.target);
        const res = await apiUrl.post(query as Q, data);
        if ("errors" in res.data) {
            reject(res.data as Extract<FormErrorType, R>);
        } else {
            resolve(res.data as Exclude<R, FormErrorType>);
        }
    }
}

export function formEle2Value(element) {
    if (!element) {
        return undefined;
    } else if (element.type === "checkbox") {
        console.log(element.id, element.checked)
        return element.checked;
    } else {
        const val = element.value;
        return val === "" ? undefined : val;
    }
}

export function createHandleSubmit<Q, B, R extends FormErrorType | {}>(
    fields: string[],
    apiUrl: ApiUrl<Q, B, R>,
    reject: (res: Extract<FormErrorType, R>) => void,
    resolve: (res: Exclude<R, FormErrorType>) => void,
    query?: Q) {
    const formToData = (target): B => fields.reduce((pv, cv) => {
        pv[cv] = formEle2Value(target[cv]);
        return pv;
    }, {}) as B;
    return createCustomHandleSubmit(apiUrl, formToData, reject, resolve, query);
}