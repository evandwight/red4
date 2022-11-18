import { z } from "zod";
import { toQueryStr } from "lib/utils";

export type FormErrorType = { errors: string[] };
export type getZodType<T> = T extends Zod.Schema<infer U> ? U : any;

export function createApiUrl<A extends Zod.Schema, B extends Zod.Schema>(path: string, querySchema: A, bodySchema: B) {
    return <ReturnType>() => {
        return new ApiUrl<getZodType<A>, getZodType<B>, ReturnType>(path, querySchema, bodySchema);
    }
}

export function createApiUrlNoBody<A extends Zod.Schema>(path: string, querySchema: A) {
    return <ReturnType>() => {
        return new ApiUrlNoBody<getZodType<A>, ReturnType>(path, querySchema);
    }
}

export class ApiUrl<QueryType, BodyType, ReturnType> {
    path: string;
    querySchema: Zod.Schema<QueryType>;
    bodySchema: Zod.Schema<BodyType>;
    constructor(path: string, querySchema: Zod.Schema<QueryType>, bodySchema: Zod.Schema<BodyType>) {
        this.path = path;
        this.querySchema = querySchema;
        this.bodySchema = bodySchema;
    }
    post(query: QueryType, body: BodyType): Promise<{ data: ReturnType }> {
        return fetch(this.fullPath(query as QueryType), {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          }).then(response => response.json())
          .then(json => ({data: json}));
    }
    queryString(query: QueryType) {
        return !query ? "" : "?" + toQueryStr(query);
    }
    fullPath(query: QueryType) {
        return `${this.path}${this.queryString(query)}`;
    }
}


export class ApiUrlNoArg<ReturnType> extends ApiUrl<undefined, undefined, ReturnType> {
    constructor(path) {
        super(path, z.undefined(), z.undefined());
    }
    post(): Promise<{ data: ReturnType }> {
        return super.post(undefined, undefined);
    }
}

export class ApiUrlNoBody<QueryType, ReturnType> extends ApiUrl<QueryType, undefined, ReturnType> {
    constructor(path, querySchema) {
        super(path, querySchema, z.undefined());
    }
    post(query: QueryType): Promise<{ data: ReturnType }> {
        return super.post(query, undefined);
    }
}