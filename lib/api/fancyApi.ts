import { profile } from "@prisma/client";
import { ApiUrl } from "lib/api/ApiUrl";
import { assertAdmin, assertInvited, getUserId, getUserIdOrNull, handleApiError } from "lib/api/utils";
import { getOrCreateProfile } from "lib/getOrCreateProfile";
import { ApiError } from "next/dist/server/api-utils";
import { NextApiRequest, NextApiResponse } from "next/types";
import { ZodUndefined } from "zod";

type OptionsType = {
    isInvited?: boolean,
    isAdmin?: boolean,
    withUserId?: boolean,
    withProfile?: boolean,
    maybeWithUserIdAndProfile?: boolean,
}

type FancyPropType<OT, Q, B> =
    { body: B, query: Q }
    & (OT extends { isInvited: true } ? { invitedProfile: profile & { is_invited: true } } : {})
    & (OT extends { isAdmin: true } ? { adminProfile: profile & { is_admin: true } } : {})
    & (OT extends { withUserId: true } ? { userId: string } : {})
    & (OT extends { withProfile: true } ? { profile: profile } : {})
    & (OT extends { maybeWithUserIdAndProfile: true } ? { userId?: string, profile?: profile } : {})


type FancyFuncType<OT, Q, B, R> =
    (req: NextApiRequest, res: NextApiResponse<R>, props: FancyPropType<OT, Q, B>) => Promise<void>;

export function tryParse<T>(schema: Zod.Schema<T>, obj: Object): T {
    try {
        if (schema instanceof ZodUndefined) {
            return undefined as unknown as T;
        } else {
            return schema.parse(obj);
        }
    } catch (err) {
        console.error("Failed to parse", {obj});
        throw err;
    }
}

export function fancyApi<OT extends OptionsType, Q, B, R>(path: ApiUrl<Q, B, R>, options: OT, func: FancyFuncType<OT, Q, B, R>): (req, res) => Promise<void> {
    return async (req: NextApiRequest, res: NextApiResponse<R>): Promise<void> => {
        try {
            if (req.method !== 'POST') {
                throw new ApiError(405, `Http ${req.method} not allowed`);
            }
            let props: any = {};
            props.query = tryParse(path.querySchema, req.query);
            props.body = tryParse(path.bodySchema, req.body);
            if (options.withUserId) {
                props.userId = await getUserId(req);
            }
            if (options.maybeWithUserIdAndProfile) {
                props.userId = await getUserIdOrNull(req);
            }
            if (options.withProfile || (options.maybeWithUserIdAndProfile && props.userId)) {
                props.profile = await getOrCreateProfile(props.userId);
            }
            if (options.isInvited) {
                props.invitedProfile = await assertInvited(req);
            }
            if (options.isAdmin) {
                props.profile = await assertAdmin(req);
            }

            await func(req, res, props);
        } catch (err) {
            console.error(`Error on path ${req.url}`)
            handleApiError(err, res);
        }
    }
}
