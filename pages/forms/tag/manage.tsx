import ErrorList from "components/ErrorList";
import FancyForm from "components/Form/FancyForm";
import FormShortTextField from "components/Form/FormShortTextField";
import { API_FORM_TAG_CREATE } from "lib/api/paths";
import { assertInvited } from "lib/api/utils";
import { createHandleSubmit } from "lib/formUtils";
import { ExtractSSProps, serverSideErrorHandler } from "lib/pageUtils";
import prisma from "lib/prisma";
import { useState } from "react";

export const getServerSideProps = serverSideErrorHandler(async (context, req) => {
    const profile = await assertInvited(req);
    const tags = await prisma.define_tag.findMany({ where: { user_id: profile.id } })
    return {
        props: { initialTags: tags }
    }
});

export default function ManageTag({ initialTags }: ExtractSSProps<typeof getServerSideProps>) {
    const [errors, setErrors] = useState<string[]>([]);
    const [tags, setTags] = useState(initialTags);

    const handleSubmit = createHandleSubmit(["name"], API_FORM_TAG_CREATE,
        (res) => setErrors(res.errors), (res) => setTags(res.tags));
    return <div>
        <ErrorList errors={errors} />
        <div>Tags:</div>
        <ul>
            {tags.map(({tag_id}) => <li key={tag_id}>{tag_id}</li>)}
        </ul>
        <FancyForm onSubmit={handleSubmit} submitButtonText="Add tag">
            <FormShortTextField id="tag_id" label="Name" passThroughProps={{autoFocus:true, maxLength:64, required:true}}/>
        </FancyForm>
    </div>;
}
