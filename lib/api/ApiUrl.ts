import { z } from "zod";
import axios from "axios";
import { toQueryStr } from "lib/utils";

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
        // TODO upgrade to node18 for fetch api
        return axios.post(this.fullPath(query), body);
        // return fetch(this.fullPath(query as QueryType), {
        //     method: 'POST',
        //     headers: {
        //       'Accept': 'application/json',
        //       'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(body)
        //   }).then(response => response.json())
        //   .then(json => ({data: json}));
    }
    postPlus(query: QueryType, body: BodyType): Promise<{ data: ReturnType }> {
        return axios.post(process.env.NEXT_PUBLIC_BASE_URL + this.fullPath(query), body);
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

export type FormErrorType = { errors: string[] };
export type FormUrl<Q, B, ErrorType, SuccessType> = ApiUrl<Q, B, (ErrorType & FormErrorType) | SuccessType>;

export function createFormUrl<ZQ extends Zod.Schema, ZB extends Zod.Schema>(path, querySchema: ZQ, bodySchema: ZB)
    : <E, S>() => FormUrl<getZodType<ZQ>, getZodType<ZB>, E, S> {
    type Q = getZodType<ZQ>;
    type B = getZodType<ZB>;
    return <E, S>(): FormUrl<Q, B, E, S> => {
        return new ApiUrl<Q, B, (E & FormErrorType) | S>(path, querySchema, bodySchema);
    }
}