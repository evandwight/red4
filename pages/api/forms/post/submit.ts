import { fancyApi } from 'lib/api/fancyApi';
import { API_FORM_SUBMIT_POST } from "lib/api/paths";
import { moderateHateSpeech } from 'lib/moderateHateSpeech';
import prisma from 'lib/prisma';
import { v4 as uuidv4 } from 'uuid';

const handler = fancyApi(API_FORM_SUBMIT_POST, { withUserId: true, withProfile: true },
    async (req, res, props) => {
        const { title, text, link, overrideMeanTag, submitAnyways } = props.body;
        const { profile } = props;
        console.log({title, text, link, overrideMeanTag, submitAnyways});
        const isMean = await moderateHateSpeech(`${title}\n${text}`);
        if (isMean) {
            if (profile.is_invited) {
                if (!overrideMeanTag && !submitAnyways) {
                    res.status(200).send({
                        errors: ["Warning: your post seems to be mean. You can change it, override the tag or submit it anyways"],
                        enableOverrideMean: true,
                        enableSubmitAnyways: true
                    });
                    return;
                }
            } else {
                if (!submitAnyways) {
                    res.status(200).send({
                        errors: ["Warning: your post seems to be mean. You can change it or submit it anyways"],
                        enableSubmitAnyways: true
                    });
                    return;
                }
            }
        }

        const id = uuidv4();

        let queries: any[] = [];

        queries.push(prisma.post.create({
            data: {
                id, title, text, external_link: link, subreddit: "mm",
                is_local: true,
                user_name: profile.user_name
            }
        }));

        if (!overrideMeanTag && isMean) {
            queries.push(prisma.tag.create({ data: { tag_id: 'mean', thing_id: id, value: isMean } }));
        }

        await prisma.$transaction(queries);

        res.status(200).send({ id });
    });
export default handler;

