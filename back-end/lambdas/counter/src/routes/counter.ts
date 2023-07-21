import {Request, Response} from "express";

import {getItemByKey} from "../adapters/counter-db";

export const counterRouteHandler = async (req: Request, res: Response) => {
    const record = await getItemByKey("counter");

    res.json(record);
};
