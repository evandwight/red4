import { define_tag } from "@prisma/client";
import FancyForm from "components/Form/FancyForm";
import FormCheckbox from "components/Form/FormCheckbox";
import { TextLink } from "components/TextLink";
import { API_FORM_PROFILE } from "lib/api/paths";
import { getUserId } from "lib/api/utils";
import { ProfileType } from "lib/commonTypes";
import { createCustomHandleSubmit } from "lib/formUtils";
import { getOrCreateProfile } from "lib/getOrCreateProfile";
import { ACCEPT_INVITE, ADMIN_LOCAL, INVITE, MANAGE_TAG } from "lib/paths";
import prisma from "lib/prisma";
import { NextPageContext } from "next/types";

export async function getServerSideProps(context: NextPageContext) {
    if (!context.req) {
        throw new Error("Request undefined");
    }
    const userId = await getUserId(context.req);
    const profile = await getOrCreateProfile(userId);
    const define_tags = await prisma.define_tag.findMany();
    return {
        props: { profile, define_tags }
    }
}

export default function Profile({ profile, define_tags }: { profile: ProfileType, define_tags: define_tag[] }) {

    const handleSubmit = createCustomHandleSubmit(API_FORM_PROFILE,
        (form) => {
            return {
                filter_tags: define_tags.map(({ tag_id }) => ({ tag_id, value: form[tag_id].checked }))
            };
        },
        () => { },
        () => location.reload());

    return <div>
        {profile.is_admin && <div>
            <h2>Admin</h2>
            <TextLink href={ADMIN_LOCAL}>admin local</TextLink>
        </div>}
        <div>
            <h2>Invites</h2>
            {profile.is_invited
            ? <TextLink href={INVITE}>
                Invite a friend
            </TextLink>
            : <TextLink href={ACCEPT_INVITE} >
                Accept an invite
            </TextLink>}
        </div>
        {profile.is_invited && <div>  <TextLink href={MANAGE_TAG}>Manage your tags</TextLink></div>}

        <div>
            <h2>Filter tags</h2>
            <FancyForm onSubmit={handleSubmit} submitButtonText="Submit tag settings">
                {define_tags.map(({ tag_id }) =>
                    <FormCheckbox key={tag_id} {... { id: tag_id, label: `Show ${tag_id}`, defaultChecked: profile.tag_filter[tag_id] }} />
                )}
            </FancyForm>
        </div>
    </div >;
}
