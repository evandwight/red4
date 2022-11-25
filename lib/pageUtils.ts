import { IncomingMessage } from "http";
import { ApiError } from "next/dist/server/api-utils";
import { NextPageContext } from "next/types";

export function serverSideErrorHandler<T extends {props: any}>(func: (context: NextPageContext, req: IncomingMessage) => Promise<T>)
    : (context: NextPageContext) => Promise<T | {notFound: true} | {redirect: any}> {
    return async (context: NextPageContext): Promise<T | {notFound: true} | {redirect: any}> => {
        try {
            const {req} = context;
            if (!req) {
                throw new ApiError(500, "Request undefined");
            }
            return await func(context, req);
        } catch (err) {
            let code = 500;
            let message = "Unknown error";
            if (err instanceof ApiError) {
                code = err.statusCode;
                message = err.message;
            }

            if (code == 404) {
                return { notFound: true };
            } else {
                return {
                    redirect: {
                        destination: `/error?code=${code}&message=${message}`,
                        permanent: false,
                    },
                };
            }
        }
    }
}

export type ExtractSSProps<T extends (context) => Promise<any>> = Exclude<Awaited<ReturnType<T>>, {notFound: true} | { redirect: any}>['props'];