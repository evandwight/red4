import ErrorList from "components/ErrorList";
import FancyForm from "components/Form/FancyForm";
import FormShortTextField from "components/Form/FormShortTextField";
import { API_FORM_INVITE_ACCEPT } from "lib/api/paths";
import { createHandleSubmit2 } from "lib/formUtils";
import { PROFILE } from "lib/paths";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SendInvite() {
    const [errors, setErrors] = useState<string[] | null>(null);
    const router = useRouter();
    const handleSubmit = createHandleSubmit2(["code"], API_FORM_INVITE_ACCEPT,
        (res) => setErrors(res.errors),
        (res) => router.push(PROFILE));

    return <div>
        <ErrorList errors={errors} />
        <FancyForm onSubmit={handleSubmit}>
            <FormShortTextField id="code" label="Invite code" passThroughProps={{maxLength:100, autoFocus:true, required:true}}/>
        </FancyForm>
    </div>;
}
