import FancyForm from "components/Form/FancyForm";
import FormEmail from "components/Form/FormEmail";
import { API_FORM_INVITE_SEND } from "lib/api/paths";
import { createHandleSubmit2 } from "lib/formUtils";
import { useState } from "react";

export default function SendInvite() {
    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const handleSubmit = createHandleSubmit2(["email"], API_FORM_INVITE_SEND,
        () => { },
        (res) => setInviteCode(res.code));

    return <div>
        <FancyForm onSubmit={handleSubmit}>
            <FormEmail id="email" label="Email" passThroughProps={{maxLength:350, autoFocus:true, required:true}}/>
        </FancyForm>
        {inviteCode && <div>
            <h2>Invite code:</h2>
            <div>{inviteCode}</div>
        </div>}
    </div>;
}
