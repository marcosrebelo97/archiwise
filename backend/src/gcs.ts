import { Storage } from '@google-cloud/storage'

const bucketName = process.env.GCS_BUCKET || 'archiwise'

// As credenciais vêm de GOOGLE_APPLICATION_CREDENTIALS (caminho do JSON da conta de serviço)
const storage = new Storage()

const bucket = storage.bucket(bucketName)

export default bucket