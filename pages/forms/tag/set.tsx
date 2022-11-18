import { define_tag, tag } from "@prisma/client";
import ErrorList from "components/ErrorList";
import FancyForm from "components/Form/FancyForm";
import FormCheckbox from "components/Form/FormCheckbox";
import { API_FORM_TAG_SET } from "lib/api/paths";
import { assertInvited } from "lib/api/utils";
import { createHandleSubmit, createCustomHandleSubmit } from "lib/formUtils";
import prisma from "lib/prisma";
import { listToMap } from "lib/tree";
import { NextPageContext } from "next/types";
import { useState } from "react";
import { z } from 'zod';

const schema = z.object({ id: z.string() });

export async function getServerSideProps(context: NextPageContext) {
    if (!context.req) {
        throw new Error("Request undefined");
    }
    const profile = await assertInvited(context.req);
    const { id } = schema.parse(context.query);
    const user_id = profile.id;
    const tags = await prisma.define_tag.findMany({ where: { user_id } })
    const tagIds = tags.map(tag => tag.tag_id);
    const tagStateList = await prisma.tag.findMany({ where: { tag_id: { in: tagIds }, thing_id: id } });
    const tagStateInitial = listToMap(tagStateList, 'tag_id');
    return {
        props: { tags, tagStateInitial, thing_id: id }
    }
}

type propType = {tags: define_tag[], tagStateInitial: {[key:string]:tag}, thing_id: string}
export default function SetTag({ tags, tagStateInitial, thing_id } : propType ) {
    const [errors, setErrors] = useState<string[]>([]);
    const [tagState, setTagState] = useState(tagStateInitial);


    const handleSubmit = createCustomHandleSubmit(API_FORM_TAG_SET,
        (element) => tags.map(({tag_id}) => ({tag_id, value: !!(element[tag_id].checked)})),
        (res) => setErrors(res.errors), (res) => { setTagState(res.tags)},
        {thing_id});
    return <div>
        <ErrorList errors={errors} />
        <div>Tags:</div>
        <FancyForm onSubmit={handleSubmit}>
            {tags.map(({tag_id}) => <FormCheckbox key={tag_id} id={tag_id} label={tag_id} defaultChecked={tagStateInitial[tag_id]?.value}/>)}
        </FancyForm>
    </div>;
}
