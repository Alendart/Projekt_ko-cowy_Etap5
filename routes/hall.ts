import {Router} from "express";


export const hallRouter = Router();

hallRouter
    .get('/',(req, res) => {
      res.render('hall/hall-of-fame')
    })