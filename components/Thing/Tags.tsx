import { DisplayTags } from "lib/commonTypes";

export function Tags<T extends {tags: DisplayTags}>({ thing }: {thing: T}) {
    const activeFields = (thing.tags || []).filter(tag => tag.value).map(tag => tag.tag_id);
    if (activeFields.length > 0) {
        return <div className="flex flex-row justify-around flex-wrap py-1">
            {activeFields.map((field, i) => <div key={i} className="text-red-600">{field}</div>)}
        </div>
    } else {
        return <></>;
    }
}
