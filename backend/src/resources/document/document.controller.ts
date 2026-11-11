import {Request, Response} from "express"
import {StatusCodes} from "http-status-codes";
import {
    createDocument,
    deleteFileService,
    getAllDocuments,
    getDocById,
    restore,
    searchAdvancedDocuments,
    updateDocument
} from "./document.service";
import {CreateDocumentData, RestoreDocumentData, UpdateDocumentData} from "./document.types";
import {FileNotFoundError} from "./errors/FileNotFoundError";

const index = async (req: Request, res: Response) => {
    const { uid } = req.session;
    const userId = uid ?? '';

    // Extraindo os filtros da query
    const { categoryId, startDate, endDate, title, isDeleted, types, isFavorite } = req.query;

    // Converte para string, se os parâmetros existirem
    const documents = await getAllDocuments(
        {
            userId,
            categoryId: categoryId as string | undefined,
            startDate: startDate as string | undefined,
            endDate: endDate as string | undefined,
            title: title as string | undefined,
            isDeleted: isDeleted === "true",
            isFavorite: isFavorite === "true",
            types: types as string | undefined
        }
    );

    res.status(StatusCodes.OK).json(documents);
};

const search = async (req: Request, res: Response) => {
    const { uid } = req.session;
    const userId = uid ?? '';

    // Extraindo os filtros da query
    const { categoryId, startDate, endDate, title, term, types } = req.query;

    // Converte para string, se os parâmetros existirem
    const documents = await searchAdvancedDocuments(
        {
            userId,
            categoryId: categoryId as string | undefined,
            startDate: startDate as string | undefined,
            endDate: endDate as string | undefined,
            title: title as string | undefined,
            term: term as string | undefined,
            types: types as string | undefined
        }
    );

    res.status(StatusCodes.OK).json(documents);
};

const searchId = async (req: Request, res: Response) => {
    const {fileId} = req.params;
    const {uid: userId} = req.session;

    try{
        const document = await getDocById(fileId, userId ?? '');
        res.status(StatusCodes.OK).json(document);
    }catch(error){
        const err = error as { statusCode?: number; message: string };
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}

const create = async (req: Request, res: Response)=> {
    const { uid: userId } = req.session;
    const { name, categoryId } = req.body;

    if (!req.file) {
        throw new FileNotFoundError();
    }

    console.log(req.file)
    const data = {
        userId,
        name,
        file: req.file,
    ...(categoryId ? { categoryId } : {}),
    } as CreateDocumentData;

    const document = await createDocument(data);
    res.json(document).status(StatusCodes.CREATED);
}

const update =  async(req: Request, res: Response) => {
    const {id} = req.params;
    const doc  = req.body as UpdateDocumentData;
    const document = await updateDocument(id, doc);

    res.json(document).status(StatusCodes.OK);
}


const restoreFile = async (req: Request, res: Response) => {
    try{
        const {fileId} = req.params;
        const doc = req.body as RestoreDocumentData;
        const document = await restore(fileId, doc);
        res.json(document).status(StatusCodes.OK);
    }catch(error){
        const err = error as { statusCode?: number; message: string };
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message});
    }
}

const deleteFile = async (req: Request, res: Response) => {
    const {fileId} = req.params;

    try{
        await deleteFileService(fileId);
        res.status(StatusCodes.NO_CONTENT).send();
    }catch(error){
        const err = error as { statusCode?: number; message: string };
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }

}
export default { index, create, update, deleteFile, searchId, restoreFile, search };
