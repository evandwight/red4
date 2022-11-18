import AccessDenied from "components/AccessDenied";
import ErrorList from "components/ErrorList";
import FancyForm from "components/Form/FancyForm";
import FormCheckbox from "components/Form/FormCheckbox";
import FormShortTextField from "components/Form/FormShortTextField";
import FormTextarea from "components/Form/FormTextarea";
import FormUrl from "components/Form/FormUrl";
import { API_FORM_SUBMIT_POST } from "lib/api/paths";
import { createHandleSubmit2 } from "lib/formUtils";
import { POST_DETAIL } from "lib/paths";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SubmitPost() {
    type x = Awaited<ReturnType<typeof API_FORM_SUBMIT_POST.post>>['data']
    const [result, setResult] = useState<any>({enableOverrideMean: false});
    const {errors, enableOverrideMean} = result;
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleSubmit = createHandleSubmit2(
        ["title", "link", "text", "overrideMeanTag", "submitAnyways"],
        API_FORM_SUBMIT_POST,
        (res) => setResult(res),
        (res) => router.push(POST_DETAIL(res.id)),
    );
    
    if (status === "unauthenticated") {
        return <AccessDenied/>
    }

    if (status === "loading") {
        return <div>Loading...</div>
    }
    return <div>
        <ErrorList errors={errors}/>
        <FancyForm onSubmit={handleSubmit} fullWidth>
            <FormShortTextField id="title" label="Title" passThroughProps={{maxLength:2000, autoFocus:true, required:true}}/>
            <FormUrl id="link" label="Link"/>
            <FormTextarea id="text" label="Text" cols={40} rows={10} passThroughProps={{maxLength:5000}}/>
            {enableOverrideMean && <>
                <FormCheckbox id="overrideMeanTag" label="Override mean tag" defaultChecked={false}/>
                <FormCheckbox id="submitAnyways" label="Submit anyways" defaultChecked={false}/>
            </>}
        </FancyForm>
    </div>;
}
