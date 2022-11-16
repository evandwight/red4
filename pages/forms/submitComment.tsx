import AccessDenied from "components/AccessDenied";
import ErrorList from "components/ErrorList";
import { API_FORM_SUBMIT_COMMENT } from "lib/api/paths";
import { createHandleSubmit2 } from "lib/formUtils";
import { POST_DETAIL } from "lib/paths";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SubmitComment() {
    const [result, setResult] = useState<any>({ enableOverrideMean: false });
    const { errors, enableOverrideMean } = result;
    const { data: session, status } = useSession();
    const router = useRouter();

    let handleSubmit = (event) => { };
    if (router.isReady) {
        const { parent_id, post_id } = API_FORM_SUBMIT_COMMENT.querySchema.parse(router.query);

        handleSubmit = createHandleSubmit2(
            ["text", "overrideMeanTag", "submitAnyways"],
            API_FORM_SUBMIT_COMMENT,
            setResult,
            (res) => router.push(POST_DETAIL(res.id)),
            {parent_id, post_id}
        );
    }

    if (status === "unauthenticated") {
        return <AccessDenied />
    }

    if (status === "loading") {
        return <div>Loading...</div>
    }
    return <div>
        <ErrorList errors={errors} />
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="text">Text:</label>
                <textarea className="w-full h-64 text-black" name="text" cols={40} rows={10} maxLength={5000} id="text"></textarea>
            </div>
            {enableOverrideMean && <>
                <div>
                    <label htmlFor="overrideMeanTag">Override mean tag:</label>
                    <input type="checkbox" name="overrideMeanTag" id="overrideMeanTag" />
                </div>
                <div>
                    <label htmlFor="submitAnyways">Submit anyways:</label>
                    <input type="checkbox" name="submitAnyways" id="submitAnyways" />
                </div>
            </>}
            <div>
                <input className="block w-fit bg-fuchsia-600 hover:bg-fuchsia-800 text-white font-bold my-1 py-1 px-4 rounded"
                    type="submit" value="Submit" />
            </div>
        </form>
    </div>;
}
