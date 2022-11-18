import ErrorList from "components/ErrorList";
import FancyForm from "components/Form/FancyForm";
import FormShortTextField from "components/Form/FormShortTextField";
import TaskIcon from "components/TaskIcon";
import { API_FORM_SEARCH_POST, API_LOAD_REDDIT_POST } from "lib/api/paths";
import { createHandleSubmit } from "lib/formUtils";
import { POSTS, POST_DETAIL } from "lib/paths";
import { useRouter } from "next/router";
import { useState } from "react";
import AddIcon from "svg/add-line.svg";

export default function SearchPost() {
    const [result, setResult] = useState<any>({});
    const { errors, notFound } = result;
    const router = useRouter()
    const handleSubmit = createHandleSubmit(["search_term"], API_FORM_SEARCH_POST,
        setResult,
        (res) => router.push(POST_DETAIL(res.id)),
    );
    const handleLoadRedditPost = () => {
        return API_LOAD_REDDIT_POST.post({ id: notFound })
            .then(response => { router.push(POST_DETAIL(response.data.id)) })
    };
    const handleSubredditSearch = (event) => {
        event.preventDefault();
        router.push(POSTS({page: "1", sort:"hot", sub: event.target?.subreddit?.value}))
    }
    return <div>
        <h2>Search for a post</h2>
        <ErrorList errors={errors} />
        <FancyForm onSubmit={handleSubmit}>
            <FormShortTextField id="search_term" label="Search for reddit id or url" passThroughProps={{ maxLength: 2000, autoFocus: true, required: true }} />
        </FancyForm>
        {!!notFound && <div className="flex">
            Load missing reddit post
            <TaskIcon title="load reddit post" func={handleLoadRedditPost} imageObj={AddIcon} />
        </div>}
        <div>
            <h2>Open subreddit</h2>
            <FancyForm onSubmit={handleSubredditSearch}>
                <FormShortTextField id="subreddit" label="Subreddit" passThroughProps={{ maxLength: 2000, required: true }} />
            </FancyForm>
        </div>

    </div>;
}
