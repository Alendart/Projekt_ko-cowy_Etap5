import {Router} from "express";
import {WarriorRecord} from "../records/warrior.record";


export const hallRouter = Router();

hallRouter
    .get('/',async (req, res) => {
        const allWarriors = await WarriorRecord.findAllWarriors();
        res.render('hall/hall-of-fame',{
            allWarriors
        })
    })