import {Router} from "express";
import {UserRecord} from "../records/user.record";
import {WarriorRecord} from "../records/warrior.record";


export const userRouter = Router();

userRouter
    .get('/',(req, res) => {
        const userId = req.cookies.user;
        if (userId){
            res.redirect('/user/logged')
        } else {
            res.render('user/login-user')
        }
    })
    .patch('/',(req, res) => {
        res.clearCookie('user');
        res.clearCookie('warrior')
        res.clearCookie('warriorName')
        res.redirect('/user')
    })
    .get('/logged',(req, res) => {
        res.render('user/logged')
    })
    .post('/', async (req, res) => {
        const {login,pwd}= req.body
        const user = await UserRecord.checkUser(login,pwd)

        if (user){
            const warriorName = await user.getWarriorName()
            res.cookie(`user`, user.id)
            res.clearCookie('warriorName')

            if (warriorName){
                const warrior = await WarriorRecord.findWarrior(warriorName)
                res.cookie('warriorName', warriorName)
                res.cookie('warrior',warrior)
            } else{
                const newWarrior = {str:1,def:1,end:1,agl:1}
                res.cookie('warrior',newWarrior)
            }
            res.redirect('/warrior')

        } else {
            res.render('error/error',{
                err:'Login or Password are incorrect!'
            })
        }

    })
    .get('/create', (req, res) => {
        const userId = req.cookies.user;
        if (userId){
            res.redirect('/user/logged')
        } else {
            res.render('user/create-user')
        }

    })
    .post('/create', async (req, res) => {

        const {login,pwd} = req.body

        if (await UserRecord.checkLoginAvailability(login)){
            res.render('error/error',{
                err:"Login is already used! Please use another one"
            })
        } else {
            const newUser = new UserRecord({login,pwd})
            await newUser.add()
            res.cookie(`user`, newUser.id)
            res.cookie('warrior',{str:1,def:1,end:1,agl:1})
            res.clearCookie('warriorName')
            res.redirect('/warrior')

        }


    })