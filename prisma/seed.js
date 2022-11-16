const { PrismaClient } = require('@prisma/client');
const { assert } = require('console');
const prisma = new PrismaClient()

async function main() {
    const adminId = process.env.ADMIN_USER_ID;
    assert(adminId);
    await prisma.profile.create({ data: { user_name: "evan", id: adminId, is_admin: true, is_invited: true, tag_filter: {} } })
    await prisma.invite.create({data: {to_id: adminId}});
    await prisma.define_tag.create({ data: { tag_id: "nsfw", user_id: adminId } });
    await prisma.define_tag.create({ data: { tag_id: "removed_from_reddit", user_id: adminId } });
    await prisma.define_tag.create({ data: { tag_id: "reddit_locked", user_id: adminId } });
    await prisma.define_tag.create({ data: { tag_id: "mean", user_id: adminId } });
    await prisma.define_tag.create({ data: { tag_id: "rage_bait", user_id: adminId } });
}

main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})