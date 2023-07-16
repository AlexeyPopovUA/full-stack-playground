import {initTRPC} from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import {z} from "zod";

const trpc = initTRPC.create();

const ping = trpc.procedure.input(z.string()).query(({input}) => {
    return `pong: ${input}`;
});

const router = trpc.router({ping});

// export types and express router
export type AppRouter = typeof router;
export const trpcRouter = trpcExpress.createExpressMiddleware({
    router
});
