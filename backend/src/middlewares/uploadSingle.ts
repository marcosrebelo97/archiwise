import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { extension } from "mime-types";
import { filesAllowed } from "../resources/document/document.types";
import { FileNotAccepted } from "../resources/document/errors/FileNotAccepted";

// Diretório principal de uploads
const mainUploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');

// Se quiser garantir que a pasta principal exista:
if (!fs.existsSync(mainUploadDir)) {
    fs.mkdirSync(mainUploadDir, { recursive: true });
}

const storage = multer.memoryStorage();


export const uploadSingle = multer({ storage });