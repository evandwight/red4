import { NextApiRequest } from "next/types";
import redis from "lib/redis";
import { ApiError } from "next/dist/server/api-utils";

export function requestToIp(req: NextApiRequest) {
    return req.headers['HTTP_X_REAL_IP']
}

export function rateLimitByIp(req: NextApiRequest, key: string, ratePerMinute: number){
    const ipKey = `${key}-${requestToIp(req)}`
    return rateLimit(ipKey, ratePerMinute)
}

export async function rateLimit(key, ratePerMinute) {
    const count = await redis.set(key, 0, "EX", 60, "NX", "GET")
        .then(val => !val ? 0 : parseInt(val));
    
    console.log({count, ratePerMinute});
    if (count >= ratePerMinute) {
        throw new ApiError(429, "Too many requests");
    } else {
        redis.incr(key)
    }
}
