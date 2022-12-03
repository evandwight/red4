import axios from "axios";
import { ApiGet } from "./ApiGet";


export function axiosGet<Q, R>(url: ApiGet<Q, R>, query: Q): Promise<{ data: R; }> {
    return axios.get(process.env.NEXT_PUBLIC_BASE_URL + url.fullPath(query));
}
