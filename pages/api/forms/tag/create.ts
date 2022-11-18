import { fancyApi } from 'lib/api/fancyApi';
import { API_FORM_TAG_CREATE } from "lib/api/paths";
import { isUniqueConstraintError } from 'lib/api/utils';
import prisma from 'lib/prisma';

const handler = fancyApi(API_FORM_TAG_CREATE, { isInvited: true }, async (req, res, props) => {
    const { invitedProfile } = props;
    const { tag_id } = props.body;
    const user_id = invitedProfile.id;
    try {
        await prisma.$transaction([
            prisma.define_tag.create({ data: { user_id, tag_id } }),
            prisma.profile.update({where: {id: user_id}, data: { has_tags: true}})
        ]);
    } catch (err) {
        if (isUniqueConstraintError(err)) {
            res.status(200).send({errors: ['Tag name already exists']})
            return;
        } else {
            throw err;
        }
    }
    const tags = await prisma.define_tag.findMany({ where: { user_id } });
    res.status(200).send({ tags });
})

export default handler;