import axios from "axios";

export const apiIndexer = axios.create({
    baseURL: `${process.env.PYTHON_ENDPOINT}`,
    timeout: 10000, // Timeout de 10 segundos
})