import axios from 'axios';
import { ApiUrl } from 'lib/api/ApiUrl';
import redis from 'lib/redis';

export const alwaysKeepSubs = ['animelegwear'];

export const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000);

export function axiosPost<Q, B, R>(url: ApiUrl<Q, B, R>, query: Q, body: B): Promise<{data: R}> {
    return axios.post(process.env.NEXT_PUBLIC_BASE_URL + url.fullPath(query), body);
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