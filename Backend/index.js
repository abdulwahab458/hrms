import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './config/Database.js';

import SequelizeStore from 'connect-session-sequelize';
import FileUpload from 'express-fileupload';

import UserRoute from './routes/UserRoute.js';
import DataJabatanRoute from './routes/DataJabatanRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import DataKehadiranRoute from './routes/DataKehadiranRoute.js';
import OvertimeRoute from './routes/OvertimeRoute.js';
import PotonganGajiRoute from './routes/PotonganGajiRoute.js';
import SalaryRoute from './routes/SalaryRoute.js';


const app = express();

app.use(express.static("public"));

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: db
});

dotenv.config();

// Middleware
app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors ({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use(express.json());

app.use(FileUpload());

app.use(UserRoute);
app.use(DataJabatanRoute);
app.use(AuthRoute);
app.use(DataKehadiranRoute);
app.use(OvertimeRoute);
app.use(PotonganGajiRoute);
app.use(SalaryRoute);

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running...');
});