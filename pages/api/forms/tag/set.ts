import { fancyApi } from 'lib/api/fancyApi';
import { API_FORM_TAG_SET } from "lib/api/paths";
import prisma from 'lib/prisma';
import { listToMap } from 'lib/tree';
import { ApiError } from 'next/dist/server/api-utils';
import { z } from 'zod';

const keySchema = z.string().uuid();
const valueSchema = z.boolean();

const handler = fancyApi(API_FORM_TAG_SET, { isInvited: true }, async (req, res, props) => {
    const { invitedProfile } = props;
    const { thing_id } = props.query;
    const user_id = invitedProfile.id;
    const tags = props.body;
    const tagIds = tags.map(tag => tag.tag_id);
    const userTagIds = await prisma.define_tag.findMany({ where: { user_id, tag_id: { in: tagIds } } });
    if (tagIds.length !== userTagIds.length) {
        throw new ApiError(400, "Invalid tag ids");
    }

    const newTagsList = await prisma.$transaction(tags.map(({tag_id, value}) => {
        return prisma.tag.upsert({
            where: { tag_id_thing_id: { tag_id, thing_id } },
            update: { value },
            create: { thing_id, tag_id, value }
        });
    }));
    const newTags = listToMap(newTagsList, 'tag_id');
    res.status(200).send({ tags: newTags });
})

export default handler;