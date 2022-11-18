import axios from 'axios';
import { ApiGet } from "lib/api/ApiGet";
import redis from 'lib/redis';

export const alwaysKeepSubs = ['animelegwear'];

export const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000);

export function axiosGet<Q, R>(url: ApiGet<Q, R>, query: Q): Promise<{data: R}> {
    return axios.get(process.env.NEXT_PUBLIC_BASE_URL + url.fullPath(query));
}

export async function runOneTask(key, func) {
    try {
        const ret = await redis.set(key, 1, "EX", 600, "NX");
        if (ret == "OK") {
            try {
                await func();
            } finally {
                await redis.del(key);
            }
        } else {
            console.log(`cannot acquire lock to run ${key}`);
        }
    } finally {
        redis.disconnect();
    }
}