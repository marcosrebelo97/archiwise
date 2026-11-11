import expressSession from "express-session";
import { v4 as uuidV4 } from 'uuid';

const session = () => {
    return expressSession({
        genid: () => uuidV4(),
        secret: process.env.SESSION_SECRET!,
        resave: true,
        saveUninitialized: true
    });
};

export default session;
