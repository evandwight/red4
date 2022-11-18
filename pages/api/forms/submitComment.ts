import { fancyApi } from 'lib/api/fancyApi';
import { API_FORM_SUBMIT_COMMENT } from "lib/api/paths";
import { moderateHateSpeech } from 'lib/moderateHateSpeech';
import prisma from 'lib/prisma';
import { v4 as uuidv4 } from 'uuid';


const handler = fancyApi(
    API_FORM_SUBMIT_COMMENT,
    { withUserId: true, withProfile: true },
    async (req, res, props) => {
        const { post_id, parent_id } = props.query;
        const { text, overrideMeanTag, submitAnyways } = props.body;
        const { profile } = props;
        const isMean = await moderateHateSpeech(text);
        if (isMean) {
            if (profile.is_invited) {
                if (!overrideMeanTag && !submitAnyways) {
                    res.status(200).send({
                        errors: ["Warning: your comment seems to be mean. You can change it, override the tag or submit it anyways"],
                        enableOverrideMean: true,
                        enableSubmitAnyways: true
                    });
                    return;
                }
            } else {
                if (!submitAnyways) {
                    res.status(200).send({
                        errors: ["Warning: your comment seems to be mean. You can change it or submit it anyways"],
                        enableSubmitAnyways: true
                    });
                    return;
                }
            }
        }
        const id = uuidv4();

        let queries: any[] = [];

        queries.push(prisma.comment.create({
            data: {
                id, parent_id, post_id, text,
                is_local: true,
                user_name: profile.user_name,
            }
        }));

        if (!overrideMeanTag && isMean) {
            queries.push(prisma.tag.create({ data: { tag_id: 'mean', thing_id: id, value: isMean } }));
        }

        await prisma.$transaction(queries);

        res.status(200).send({ id: post_id });
    });
export default handler;
