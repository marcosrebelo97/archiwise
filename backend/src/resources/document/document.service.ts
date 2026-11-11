import prisma from "../../client";
import path from "path";
import FormData from 'form-data';
import mime from "mime-types";
import {fromBuffer} from "pdf2pic";
import {CreateDocumentData, mimesAllowed, RestoreDocumentData, UpdateDocumentData} from "./document.types";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {FileNotFoundError} from "./errors/FileNotFoundError";
import {Chromiumly, LibreOffice} from "chromiumly";
import {UploadError} from "./errors/UploadError";
import bucket from "../../gcs";
import {apiIndexer} from "../../apiIndexer";

const goterbergUrl = process.env.GOTENBERG_ENDPOINT ?? "http://gotenberg:3000";

Chromiumly.configure({ endpoint: goterbergUrl });

const getTypeFileInMime = (mimeType: string) => {
    const type = mime.extension(mimeType);

    return type ? type : 'unknown';
}

interface GetDocumentData {
    userId: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    title?: string;
    docsIds?: string[];
    term?: string;
    isDeleted?: boolean;
    types?: string;
    isFavorite?: boolean
}

export const getAllDocuments = async (
    {
        userId, categoryId, startDate, endDate, title, docsIds,isDeleted, types, isFavorite }: GetDocumentData) => {
    const whereClause: any = { userId };

    if (docsIds && docsIds.length > 0) {
        whereClause.id = {
            in: docsIds,
        };
    }

    if (types) {
        const typesArray = types.split(',');
        const typesMapped = typesArray.map((type: string) => type);

        whereClause.type = {
            in: typesMapped,
        };
    }

    if (categoryId) {
        whereClause.categoryId = categoryId;
    }

    if(isDeleted){
        whereClause.isDeleted = isDeleted;
    }else{
        whereClause.isDeleted = false;
    }

    if(isFavorite){
        whereClause.isFavorite = isFavorite
    }
    if (startDate && endDate) {
        // Quando ambas as datas são passadas: filtra por um período, ajustando para UTC
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0); // início do dia em UTC

        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999); // fim do dia em UTC

        whereClause.createdAt = {
            gte: start,
            lte: end,
        };
    } else if (startDate) {
        // Quando apenas a data de início é passada: filtra pelo dia exato, em UTC
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);

        const end = new Date();
        end.setUTCHours(23, 59, 59, 999);

        whereClause.createdAt = {
            gte: start,
            lte: end,
        };
    }

    // Se o título for fornecido, adiciona o filtro para títulos que contenham o valor (busca case insensitive)
    if (title) {
        whereClause.name = {
            contains: title
        };
    }

    return prisma.document.findMany({
        where: whereClause,
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    color: true,
                },
            },
        },
        orderBy: {
            uploadedAt: 'desc',
        }
    });
};


export const createDocument = async ({ userId, file, name, categoryId }: CreateDocumentData) => {

    try {
            const isDocumentPdf = file.mimetype === mime.lookup('pdf');
            const extensionFile = mime.extension(file.mimetype) || '';
            const baseName = `${file.originalname}-${Date.now()}`;
            const type = getTypeFileInMime(file.mimetype);

            const fileName = `${userId}/${Date.now()}-${baseName}.${extensionFile}`;
            const previewNameFile = `${userId}/${Date.now()}-${baseName}-preview.png`;
            const viewNameFile = `${userId}/${Date.now()}-${baseName}-view.pdf`;

            let bufferPdf = isDocumentPdf ? file.buffer : null;

            // Lista de Promises para aguardar todos os uploads terminarem
            const uploadPromises = [];

            // Upload do arquivo principal
            uploadPromises.push(new Promise((resolve:(value: {file: string}) => void, reject) => {
                const blob = bucket.file(fileName);
                const blobStream = blob.createWriteStream({
                    resumable: false,
                    contentType: file.mimetype,
                });

                blobStream.on('finish', () => {
                    resolve({file: `https://storage.googleapis.com/archiwise/${fileName}`});
                    // resolve(`https://storage.googleapis.com/archiwise/${fileName}`);
                });

                blobStream.on('error', reject);
                blobStream.end(file.buffer);
            }));

            // Se não for PDF, converte e faz upload do arquivo visualizável (PDF)
            if (mimesAllowed.includes(file.mimetype) && !isDocumentPdf) {
                const buffer = await LibreOffice.convert({
                    files: [{ data: file.buffer, ext: extensionFile as any }],
                });
                bufferPdf = buffer;

                uploadPromises.push(new Promise((resolve: (value: {view: string}) => void, reject) => {
                    const blobView = bucket.file(viewNameFile);
                    const blobStreamView = blobView.createWriteStream({
                        resumable: false,
                        contentType: 'application/pdf',
                    });

                    blobStreamView.on('finish', () => {
                        resolve({view: `https://storage.googleapis.com/archiwise/${viewNameFile}`});
                        // resolve(`https://storage.googleapis.com/archiwise/${viewNameFile}`);
                    });

                    blobStreamView.on('error', reject);
                    blobStreamView.end(buffer);
                }));
            }

            // Se tiver um PDF, gera uma imagem de preview e faz upload
            if (bufferPdf) {
                console.log('Gerando preview do PDF');
                const options = {
                    density: 100,
                    quality: 100,
                    format: 'png',
                    width: 600,
                    preserveAspectRatio: true,
                };

                const convert = fromBuffer(bufferPdf, options);
                const imagePreview = await convert(1, { responseType: "buffer" }).then(res => res.buffer);
                console.log('Preview gerado');
                uploadPromises.push(new Promise((resolve: (value: {preview: string}) => void, reject) => {
                    const blobPreview = bucket.file(previewNameFile);
                    const blobStreamPreview = blobPreview.createWriteStream({
                        resumable: false,
                        contentType: 'image/png',
                    });

                    blobStreamPreview.on('finish', () => {
                        resolve({preview: `https://storage.googleapis.com/archiwise/${previewNameFile}`});
                        // resolve(`https://storage.googleapis.com/archiwise/${previewNameFile}`);
                    });

                    blobStreamPreview.on('error', (err) => {
                        console.error('Erro ao enviar preview:', err);
                        reject(err);
                    });
                    blobStreamPreview.end(imagePreview);
                }));
            }

            // Aguarda todos os uploads finalizarem e captura as URLs
            const allUploads = await Promise.all(uploadPromises);
            const urlFile = allUploads.find((upload) => 'file' in upload)?.file;
            const urlViewFile = allUploads.find((upload) => 'view' in upload)?.view;
            const urlPreviewFile = allUploads.find((upload) => 'preview' in upload)?.preview;

            // Salva o documento no banco de dados
            const docData = {
                name: name,
                size: file.size,
                type,
                filePath: urlFile as string,
                fileViewPath: isDocumentPdf ? urlFile as string : urlViewFile as string,
                userId,
                ...(urlPreviewFile ? {filePreviewPath: urlPreviewFile as string} : {}),
                ...(categoryId ? {categoryId} : {}),
            };
            const docBack = await prisma.document.create({data: docData});

// //////////////////////////////////////////////////////////
//
            // Criar um objeto FormData
            const formData = new FormData();
            formData.append('user_id', userId.toString());
            formData.append('document_id', docBack.id);
            formData.append('title', name);

            // Adiciona o arquivo
            formData.append(
                'file',
                Buffer.from(bufferPdf ?? file.buffer),
                {filename: `${name}.pdf`, contentType: 'application/pdf'});
            apiIndexer.post('index', formData, {
                    headers: {
                        ...formData.getHeaders(), // Inclui os headers corretos do multipart/form-data
                    },
                }).then((response) => {
                    console.log('Resposta:', response.data);
                }).catch((error) => {
                    console.error('Erro no upload:', error);
                })


            ///////////////////////////////////////////////////////////
            return docBack;
    } catch (error) {
        console.error('Erro ao criar documento:', error);
        throw new UploadError();
    }
}

export const getDocById = async (id: string, userId: string) => {
        const document = await prisma.document.findUnique({
            where: {id, userId},
            include:  {
                category: true
            }
        });

        if(!document){
            throw {
                statusCode: StatusCodes.NOT_FOUND,
                message: ReasonPhrases.NOT_FOUND
            }
        }

        if(document.isDeleted){
            throw {
                statusCode: StatusCodes.NOT_FOUND,
                message: ReasonPhrases.NOT_FOUND
            }
        }

        return document;
    }

export const updateDocument = async (id: string, {name, viewCount, categoryId, isDeleted, isFavorite}: UpdateDocumentData) => {
    try{
        const doc = await prisma.document.findUnique({where: {id}});
    if(!doc){
        throw {
            statusCode: StatusCodes.NOT_FOUND,    
            message: ReasonPhrases.NOT_FOUND
        }
    }
    if(categoryId){
        const category = await prisma.category.findUnique({
            where: {id: categoryId}
        })

        if(!category){
            throw {
                statusCode: StatusCodes.NOT_FOUND,
                message: ReasonPhrases.NOT_FOUND
            }
        }
    }

    const filteredData = Object.fromEntries(
        Object.entries({name, viewCount, categoryId, isDeleted, isFavorite}).filter(([_, value]) => value !== undefined)
    );

    return prisma.document.update({
        where: {
            id,
        },
        data: filteredData,
        include: {
            category: true
        }
    })

    }catch(error){
        throw {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        };

    }
}

export const restore = async (id: string, {isDeleted}: RestoreDocumentData) => {
    try{
        const doc = await prisma.document.findUnique({
            where: {id},
        })


        if(!doc){
            throw {
                statusCode: StatusCodes.NOT_FOUND,
                message: ReasonPhrases.NOT_FOUND
            }
        }

        if(!doc.isDeleted){
            throw {
                statusCode: StatusCodes.CONFLICT,
                message: ReasonPhrases.CONFLICT
            }
        }

        return prisma.document.update({
            where: {id},
            data: {
                isDeleted: isDeleted,
            },
            include: {
                category: true
            }
        })
    }catch(error){
        throw {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        }
    }


}



export const deleteFileService = async(id: string) => {
    try{
        const doc = await prisma.document.findUnique({
            where: {id}
        })

        if(!doc){
            throw new FileNotFoundError();
        }

        if(!doc.isDeleted){
            throw {
                statusCode: StatusCodes.CONFLICT,
                message: ReasonPhrases.CONFLICT
            }
        }

        return prisma.document.delete({
            where: {id}
        })
    }catch(error){
        throw {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        }
    }
}

export const searchAdvancedDocuments = async (search: GetDocumentData) => {
    if (Boolean(search.term)) {

        const { userId, term , ...rest} = search;
        const docs = await apiIndexer.get('search', {
            params: {
                user_id: userId,
                query: term ?? ''
            }
        });

        if (docs.data.error || docs.data.total_documents == 0) {
            return [];
        }

        const ids = docs.data.tfidf_results.map((doc: any) => doc.id);
        if (ids.length === 0) {
            return [];
        }
        // console.log(docs.data.tfidf_results)
        // docs.data.tfidf_results.forEach((doc: any) => {
        //     console.log(doc.snippets.toString().replaceAll('\n', ''))
        // })
        const documents =  await getAllDocuments({ userId, docsIds: ids, ...rest });
        return documents.map((doc) => {
            const index = docs.data.tfidf_results.findIndex((d: any) => d.id === doc.id);
            return {
                ...doc,
                snippets: docs.data.tfidf_results[index].snippets
            }
        });
    }
    return getAllDocuments(search);
}