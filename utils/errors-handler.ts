import {NextFunction, Request, Response} from 'express';

export class ValidationError extends Error{}



export const errorHandler = (err: Error,req:Request,res:Response,next:NextFunction):void => {
    console.log(err);
    console.log("Tutaj działa")
    res
        .status(err instanceof ValidationError ? 400 : 500)
        .render('error/error',{
            err: err instanceof ValidationError ? err.message : 'We have problem, please try again later'
        })
    console.log("Tutaj też?")
}


