import { fancyApi } from 'lib/api/fancyApi';
import { API_FORM_INVITE_SEND } from "lib/api/paths";
import prisma from 'lib/prisma';
import { v4 as uuidv4 } from 'uuid';

const handler = fancyApi(API_FORM_INVITE_SEND, { isInvited: true }, async (req, res, props) => {
    const { email } = props.body;
    const { invitedProfile } = props;
    const code = uuidv4();
    await prisma.invitation.create({ data: { from_id: invitedProfile.id, to_email: email, code } });

    res.status(200).send({ code });
})

export default handler;