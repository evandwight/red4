import { DisplayTags } from "lib/commonTypes";
import prisma from "lib/prisma";
import { listToMap } from "lib/tree";

export default async function getTags(thingIds: string[]): Promise<{[key: string]: DisplayTags}> {
    const tags = await prisma.tag.findMany({where:{thing_id:{in: thingIds}}});
    const define_tags = await prisma.define_tag.findMany({where: {tag_id: {in : tags.map(tag => tag.tag_id)}}});
    const tagInfoMap = listToMap(define_tags, 'tag_id');
    const tagMap: {[key: string]: DisplayTags} = tags.reduce((pv, cv) => {
        pv[cv.thing_id].push({tag_id: tagInfoMap[cv.tag_id].tag_id, value:cv.value});
        return pv;
    }, thingIds.reduce((pv, cv) => {
        pv[cv] = [];
        return pv;
    }, {}));
    return tagMap;
}