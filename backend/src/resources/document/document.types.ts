import { Document } from '@prisma/client';
import mime from "mime-types";

export const filesAllowed = ['pdf', 'doc', 'docx', 'pptx', 'ppt', 'xls', 'xlsx', 'odt', 'ods', 'odp']
export const mimesAllowed = filesAllowed.map((ext) => mime.lookup(ext)).filter((mime) => mime) as string[];

export type CreateDocumentData = Pick<Document, 'name' |'userId' | 'categoryId'> & { file: Express.Multer.File };
export type RestoreDocumentData = Pick<Document, 'isDeleted'>;
export type UpdateDocumentData = Partial<Pick<Document, 'name' | 'categoryId' | 'viewCount' | 'isDeleted' | 'isFavorite'>>;