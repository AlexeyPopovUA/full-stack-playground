import {Request, Response} from "express";

import {getRecordFromDB} from "../lib/fetch-configuration";

export const byKeyRouteHandler = async (req: Request<unknown, unknown, unknown, {
    environment: string;
}>, res: Response) => {
    const environment = req.query?.environment ?? "test";

    const configuration = await getRecordFromDB(environment);

    res.json({configuration});
};
