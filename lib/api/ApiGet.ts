import { z } from "zod";
import { toQueryStr } from "lib/utils";
import { getZodType } from "./ApiUrl";

export class ApiGet<QueryType, ReturnType> {
    path: string;
    querySchema: Zod.Schema<QueryType>;
    constructor(path: string, querySchema: Zod.Schema<QueryType>) {
        this.path = path;
        this.querySchema = querySchema;
    }
    get(query: QueryType): Promise<{ data: ReturnType; }> {
        return fetch(this.fullPath(query as QueryType))
            .then(response => response.json())
            .then(json => ({ data: json }));
    }
    queryString(query: QueryType) {
        return !query ? "" : "?" + toQueryStr(query);
    }
    fullPath(query: QueryType) {
        return `${this.path}${this.queryString(query)}`;
    }
}

export class ApiGetNoArg<ReturnType> extends ApiGet<undefined, ReturnType> {
    constructor(path) {
        super(path, z.undefined());
    }
    get(): Promise<{ data: ReturnType; }> {
        return super.get(undefined);
    }
    fullPath() {
        return super.fullPath(undefined);
    }
}

export function createApiGet<A extends Zod.Schema>(path: string, querySchema: A) {
    return <ReturnType>() => {
        return new ApiGet<getZodType<A>, ReturnType>(path, querySchema);
    };
}
