import prisma from 'lib/prisma';
import { NextPageContext } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { getStaticProps } from 'pages/inviteTree';

const id1 = uuidv4();
const id2 = uuidv4();
const id3 = uuidv4();
const id4 = uuidv4();

beforeAll(async () => {
    await prisma.invite.createMany({
        data: [
            { from_id: null, to_id: id1 },
            { from_id: id1, to_id: id2 },
            { from_id: id2, to_id: id3 },
            { from_id: id1, to_id: id4 },
        ]
    });
    await prisma.profile.createMany({
        data: [
            { id: id1, user_name: "1", tag_filter: {} },
            { id: id2, user_name: "Z2", tag_filter: {} },
            { id: id3, user_name: "3", tag_filter: {} },
            { id: id4, user_name: "4", tag_filter: {} },
        ]
    })
})

afterAll(async () => {
    const ids = [id1, id2, id3, id4]
    await prisma.invite.deleteMany({ where: { to_id: { in: ids } } });
    await prisma.profile.deleteMany({ where: { id: { in: ids } } });
})

describe('getInviteTree', () => {
    it('works', async () => {
        const { props: { nodes } } = await getStaticProps({} as NextPageContext);
        expect(nodes[0].id).toBe(id1);
        expect(nodes[0].children[0].id).toBe(id4);
        expect(nodes[0].children[1].id).toBe(id2);
        expect(nodes[0].children[1].children[0].id).toBe(id3);
    })
})