import {Router} from "express";
import {ArenaFight} from "../utils/arena-fight";
import {WarriorRecord} from "../records/warrior.record";
import {UserRecord} from "../records/user.record";


export const arenaRouter = Router()

arenaRouter
    .get('/', async (req, res) => {
        // Widok główny areny
        res.render('arena/arena')
    })
    .get('/fight', async (req, res) => {
        // Walka - raczej powinna się odbywać w innym pliku - tutaj tylko samo przekazanie danych
        const warriorName = req.cookies.warriorName;
        const warrior = await WarriorRecord.findWarrior(warriorName);
        const arena = new ArenaFight(warrior);
        const log = await arena.fight();
        res.render('arena/fight',{
            log
        })
    })
