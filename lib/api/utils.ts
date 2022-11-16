import { Prisma } from "@prisma/client";
import { getOrCreateProfile } from "lib/getOrCreateProfile";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { ApiError } from "next/dist/server/api-utils";
import { ZodError } from "zod";

export function assertPost(req) {
    if (req.method !== 'POST') {
        throw new ApiError(405, `Http ${req.method} not allowed`);
    }
}

export async function assertAdmin(req) {
    const id = await getUserId(req);
    const profile = await getOrCreateProfile(id);
    if (!profile.is_admin) {
        throw new ApiError(401, "Not an admin");
    }
    return profile
}

export async function assertInvited(req) {
    const id = await getUserId(req);
    const profile = await getOrCreateProfile(id);
    console.log({profile})
    if (!profile.is_invited) {
        throw new ApiError(401, "Not invited");
    }
    return profile
}

export async function getUserId(req) {
    const userId = await getUserIdOrNull(req);
    if (!userId) {
        throw new ApiError(401, "Not logged in");
    }
    return userId;
}

export async function getEmail(req) {
    const jwt = await getJwtOrNull(req);
    if (!jwt?.email) {
        throw new ApiError(500, "No email associated with your account");
    }
    return jwt.email;
}

export async function getJwtOrNull(req) {
    let jwt = await getToken({ req });
    if (!jwt) {
        return null;
    }
    if (!jwt.sub) {
        throw new ApiError(500, "Parsing jwt failed");
    }
    return jwt;
}

export async function getUserIdOrNull(req) {
    return (await getJwtOrNull(req))?.sub || null;
}
export function handleApiError(err, res: NextApiResponse) {
    console.error(err);
    if (err instanceof ApiError) {
        res.status(err.statusCode).send(err.message);
    } else if (err instanceof ZodError) {
        res.status(400).send("Invalid arguments");
    } else {
        throw err;
    }
}

export function isUniqueConstraintError(err) {
    return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
}