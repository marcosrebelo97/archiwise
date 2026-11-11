import { Request, Response } from "express";
import { 
    createSearch, 
    getAllUserSearches, 
} from "./search.service";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const index = async (req: Request, res: Response) => {
    const {uid} = req.session;
    const userId = uid ?? '';

    const searches = await getAllUserSearches(userId);
    res.status(StatusCodes.OK).json(searches);
}

const create = async (req: Request, res: Response) => {
    const {uid} = req.session;
    const userId = uid ?? '';
    const { termSearched } = req.body;

    await createSearch(userId, termSearched);

    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
}

export default {
    create,
    index,
}