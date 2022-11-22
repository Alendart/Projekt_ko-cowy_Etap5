import * as express from 'express';
import 'express-async-errors'
import * as methodOverride from "method-override";
import * as cookieParser from 'cookie-parser';
import {engine} from 'express-handlebars'
import {arenaRouter} from "./routes/arena";
import {userRouter} from "./routes/user";
import {warriorRouter} from "./routes/warrior";
import {handlebarsHelpers} from "./utils/handlebars-helpers";
import {hallRouter} from "./routes/hall";
import {errorHandler} from "./utils/errors-handler";



const app = express();

app
    .use(express.static('public'))
    .use(methodOverride('_method'))
    .use(express.urlencoded({
        extended: true
    }))
    .use(cookieParser());

app
    .engine('hbs', engine({
        extname: 'hbs',
        helpers:handlebarsHelpers
    }))
    .set('view engine','hbs')

app
    .use('/',arenaRouter)
    .use('/user',userRouter)
    .use('/warrior', warriorRouter)
    .use('/hall',hallRouter)

app.use(errorHandler)

app.listen(3000,() => console.log("Listening on http://localhost:3000/"))