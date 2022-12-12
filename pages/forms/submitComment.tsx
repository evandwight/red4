import AccessDenied from "components/AccessDenied";
import ErrorList from "components/ErrorList";
import FancyForm from "components/Form/FancyForm";
import FormCheckbox from "components/Form/FormCheckbox";
import FormTextarea from "components/Form/FormTextarea";
import { API_FORM_SUBMIT_COMMENT } from "lib/api/paths";
import { createHandleSubmit } from "lib/formUtils";
import { POST_DETAIL } from "lib/paths";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SubmitComment() {
    const [result, setResult] = useState<any>({ enableOverrideMean: false, enableSubmitAnyways: false });
    const { errors, enableOverrideMean, enableSubmitAnyways } = result;
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "unauthenticated") {
        return <AccessDenied />
    }

    if (status === "loading") {
        return <div>Loading...</div>
    }

    const { parent_id, post_id } = API_FORM_SUBMIT_COMMENT.querySchema.parse(router.query);

    const handleSubmit = createHandleSubmit(
        ["text", "overrideMeanTag", "submitAnyways"],
        API_FORM_SUBMIT_COMMENT,
        setResult,
        (res) => router.push(POST_DETAIL(res.id)),
        { parent_id, post_id }
    );

    return <div>
        <ErrorList errors={errors} />
        <FancyForm onSubmit={handleSubmit} fullWidth>
            <FormTextarea id="text" label="Text" cols={40} rows={10} passThroughProps={{ maxLength: 5000, autoFocus: true, required: true }} />
            {enableOverrideMean &&
                <FormCheckbox id="overrideMeanTag" label="Override mean tag" defaultChecked={false}/>}
            {enableSubmitAnyways &&
                <FormCheckbox id="submitAnyways" label="Submit anyways" defaultChecked={false}/>}
        </FancyForm>
    </div>;
}
