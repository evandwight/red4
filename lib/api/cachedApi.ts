import { profile } from "@prisma/client";
import { ApiUrl, ApiUrlNoBody } from "lib/api/ApiUrl";
import { tryParse } from "lib/api/fancyApi";
import { assertAdmin, assertInvited, getUserId, getUserIdOrNull, handleApiError } from "lib/api/utils";
import { getOrCreateProfile } from "lib/getOrCreateProfile";
import redis from "lib/redis";
import { ApiError } from "next/dist/server/api-utils";
import { NextApiRequest, NextApiResponse } from "next/types";
import { ZodUndefined } from "zod";

export type CachedOptionsType = {
    ttl: number,
}

type CachedFuncType<Q, R> = (req: NextApiRequest, props: { query: Q }) => Promise<R>;

export function sendJson<R>(res: NextApiResponse<R>, json: string, ttl: number) {
    res.status(200)
        .setHeader('Content-Type', 'application/json')
        .setHeader('Cache-Control',`public, s-maxage=${ttl}, stale-while-revalidate=${ttl}`)        
        .send(json as R);
}

export function cachedApi<Q, R>(path: ApiUrlNoBody<Q, R>, options: CachedOptionsType, func: CachedFuncType<Q, R>): (req, res) => Promise<void> {
    return async (req: NextApiRequest, res: NextApiResponse<R>): Promise<void> => {
        try {
            if (req.method !== 'POST') {
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