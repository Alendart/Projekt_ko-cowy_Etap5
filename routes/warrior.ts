import {Router} from "express";
import {statChecker} from "../utils/stat-checker";
import {UserRecord} from "../records/user.record";
import {WarriorRecord} from "../records/warrior.record";


export const warriorRouter = Router()

warriorRouter
    .get('/', async (req, res) => {
        const {user,warriorName, warrior} = req.cookies
        if(warriorName){
            res.render('warrior/warrior',{
                user,
                warrior,
            })
        } else {
            res.render('warrior/warrior',{
                user,
                newWarrior:warrior,
            })
        }


    })
    .post('/',async (req, res) => {

        const userId = req.cookies.user;

        const warrior = new WarriorRecord(req.body);
        await warrior.create();

        const user = await UserRecord.findOne(userId);
        await user.setWarriorName(warrior.warriorName)

        res.cookie('warrior',warrior)
        res.cookie('warriorName', warrior.warriorName)
        res.render('warrior/warrior',{
            warrior
        })
    })
    .get('/:type/:mark',(req, res) => {

        const newWarrior = req.cookies.warrior
        const oldWarrior = {...newWarrior}
        const {type,mark} = req.params;

        if (type === 'inc'){
            newWarrior[mark] += 1;
        } else if (type === 'dec') {
            newWarrior[mark] -= 1;
        }

        if (statChecker(newWarrior)){
            res.cookie('warrior',newWarrior)
            res.render('warrior/warrior',{
                newWarrior
            })
        } else{
            res.render('warrior/warrior',{
                newWarrior:oldWarrior
            })
        }

    })
