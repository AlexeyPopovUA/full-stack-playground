import express from "express";

import {trpcRouter} from "./routes/trpc-demo";

const app = express();

app.use("/trpc(/*)?", trpcRouter);

export {app};
