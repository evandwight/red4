import { FormErrorType, FormUrl } from "lib/api/ApiUrl";

export function createCustomHandleSubmit<Q,B,E,S>(apiUrl: FormUrl<Q, B, E, S>,
    formToData: (element: HTMLElement) => B,
    reject: (res: E & FormErrorType) => void, resolve: (res: S) => void, 
    query?: Q){
    return async (event): Promise<void> => {
        event.preventDefault();
        const data = formToData(event.target);
        const res =  await apiUrl.post(query as Q, data as B);
        if ("errors" in res.data) {
            reject(res.data);
        } else {
            resolve(res.data);
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

export function createHandleSubmit<Q,B,E,S>(fields: string[], apiUrl: FormUrl<Q, B, E, S>,
    reject: (res: E & FormErrorType) => void, resolve: (res: S) => void, 
    query?: Q){
        const formToData = (target) => fields.reduce((pv, cv) => {
            pv[cv] = formEle2Value(target[cv]);
            return pv;
        }, {}) as B;
    return createCustomHandleSubmit(apiUrl, formToData,reject, resolve, query);
}