import {Request, Response} from "express";

import {getRecordFromDB} from "../lib/fetch-configuration";

export const counterRouteHandler = async (req: Request, res: Response) => {
    const record = await getRecordFromDB("counter");

    res.json(record);
};
