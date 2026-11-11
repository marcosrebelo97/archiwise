import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json"
import {v4 as uuidV4} from 'uuid';

import validateEnv from "./utils/validateEnv";
import router from "./router/index";
import session from "express-session";
import {errorHandler} from "./middlewares/errorHandler";
import * as process from "node:process";
import redisClient from "./redisClient";
import {RedisStore} from "connect-redis";

declare module "express-session" {
    interface SessionData {
        uid: string
    }
}

dotenv.config();
validateEnv();


// Initialize RedisStore
let redisStore = new RedisStore({
    client: redisClient,
});

const app = express();
const port = process.env.PORT || 3000;
const urlOrigin = process.env.FRONTEND_ENDPOINT || "http://localhost:3000";
const isDevelopment = process.env.NODE_ENV === "development";


app.use(cors({
    origin: ['http://localhost:3000', urlOrigin],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD']
}));

if (!isDevelopment) {
    app.set('trust proxy', 1); // Aqui é bom configurar como 1 se o app estiver por trás de um proxy (ex: load balancer)
}

app.use(express.json());
app.use(session({
    store: redisStore,
    genid: () => uuidV4(),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly:!isDevelopment,
        secure: !isDevelopment,
        sameSite: !isDevelopment ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
        partitioned: !isDevelopment,
    },
    proxy: !isDevelopment,
}));

app.use('/public', express.static('public'));

app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(router);
app.use(errorHandler);

app.listen(port, () => {
    console.log("isDevelopment", isDevelopment);
    console.log(`Servidor rodando em: http://localhost:${port}`);
});

