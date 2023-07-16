import express from "express";
import cors from "cors";
import {inferAsyncReturnType, initTRPC} from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import {z} from 'zod';

import {getCorsCfg} from "./lib/configureCors";

// created for each request
const createContext = ({req, res}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
    greet: t.procedure.input(z.string()).query((opts) => {
        console.log("greet!");
        return `Greetings, ${opts.input}`;
    })
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const app = express();

// shared CORS configuration for all routes
app.use(cors(getCorsCfg()));

// add trpc
app.use(
    '/trpc-demo',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext
    })
);
