import { isUniqueConstraintError } from 'lib/api/utils';
import { ProfileType } from 'lib/commonTypes';
import prisma from 'lib/prisma';
import { generateSlug } from 'random-word-slugs';

export async function getOrCreateProfile(id: string){
    for (let i = 0; i < 10; i++) {
        const user_name = generateSlug();
        try {
            const profile = await prisma.profile.upsert({ where: {id}, create: { id, user_name, tag_filter:{} }, update: {} });
            return profile as ProfileType;
        } catch (err) {
            if (!isUniqueConstraintError(err)) {
                throw err;
            }
        }
    }
    throw new Error("Unable to find unique user name")
}