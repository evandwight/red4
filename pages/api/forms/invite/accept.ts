import { fancyApi } from 'lib/api/fancyApi';
import { API_FORM_INVITE_ACCEPT } from "lib/api/paths";
import { getEmail } from 'lib/api/utils';
import prisma from 'lib/prisma';

const handler = fancyApi(API_FORM_INVITE_ACCEPT, { withUserId: true }, async (req, res, props) => {
    const { code } = req.body;
    const to_id = props.userId;
    const to_email = await getEmail(req);

    const invitation = await prisma.invitation.findFirst({ where: { to_email, code } });
    let errors;
    if (!invitation) {
        errors = [`No invitation found for ${JSON.stringify({ code, to_email })}`];
    } else {
        await prisma.$transaction([
            prisma.invite.create({ data: { from_id: invitation.from_id, to_id } }),
            prisma.invitation.delete({ where: { code } }),
        ]);
    }

    res.status(200).send({ errors });

});

export default handler;