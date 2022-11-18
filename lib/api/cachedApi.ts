import { ApiGet } from "lib/api/ApiGet";
import { tryParse } from "lib/api/fancyApi";
import { handleApiError } from "lib/api/utils";
import redis from "lib/redis";
import { ApiError } from "next/dist/server/api-utils";
import { NextApiRequest, NextApiResponse } from "next/types";

export type CachedOptionsType = {
    ttl: number,
}

export type CachedFuncType<Q, R> = (req: NextApiRequest, props: { query: Q }) => Promise<R>;

export function sendJson<R>(res: NextApiResponse<R>, json: string, ttl: number) {
    res.status(200)
        .setHeader('Content-Type', 'application/json')
        .setHeader('Cache-Control',`public, s-maxage=${ttl}, stale-while-revalidate=${ttl}`)        
        .send(json as R);
}

export function cachedApi<Q, R>(path: ApiGet<Q, R>, options: CachedOptionsType, func: CachedFuncType<Q, R>): (req, res) => Promise<void> {
    return async (req: NextApiRequest, res: NextApiResponse<R>): Promise<void> => {
        try {
            if (req.method !== 'GET') {
                throw new ApiError(405, `Http ${req.method} not allowed`);
            }
            const {ttl} = process.env.NODE_ENV === "development" ? {ttl: 1} : options;
            const key = req.url as string;
            const val = await redis.get(key);
            if (!val) {
                const props = { query: tryParse(path.querySchema, req.query) };
                const result = await func(req, props);
                const json = JSON.stringify(result);
                sendJson(res, json, ttl);
                await redis.set(key, json, "EX", ttl*2);
            } else {
                sendJson(res, val, ttl);
            }
        } catch (err) {
            console.error(`Error on path ${req.url}`)
            handleApiError(err, res);
        }
    }
}