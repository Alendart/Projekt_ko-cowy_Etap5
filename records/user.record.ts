import {v4 as uuid} from 'uuid'
import {pool} from "../utils/db";

export class UserRecord{
    public id?:string;
    public readonly login:string;
    public readonly pwd:string;
    public warriorName:string

    constructor(obj: {id?:string; login:string; pwd:string;warriorName?:string}) {
            this.id = obj.id ?? uuid();
            this.login = obj.login;
            this.pwd = obj.pwd;
            this.warriorName = obj.warriorName ?? null;
    }


    static async checkLoginAvailability(login:string):Promise<boolean>{
        const [loginCheck]:any = (await pool.execute('SELECT (`login`) FROM `account` WHERE `login` = :login', {
            login
        }))[0]

        return loginCheck !== undefined
    }

    async add():Promise<void>{
        const adding:any = await pool.execute('INSERT INTO `account` (`id`,`login`,`pwd`) VALUES (:id,:login,:pwd)',{
            id: this.id,
            login: this.login,
            pwd: this.pwd
        })

    }

    async setWarriorName(warriorName:string):Promise<void>{
        this.warriorName = warriorName;
        const accountData:any = await pool.execute('UPDATE `account` SET `warriorName` = :warriorName WHERE `id` = :id ',{
            id: this.id,
            warriorName
        });

    }



    async getWarriorName():Promise<string>{
        const [accountData]:any = (await pool.execute('SELECT (`warriorName`) FROM `account` WHERE `id` = :id ',{
            id: this.id
        }))[0];

        return accountData['warriorName']
    }

    static async checkUser(login:string,pwd:string):Promise<false | UserRecord>{
        const [user]:any = (await pool.execute('SELECT * FROM `account` WHERE `login` = :login AND `pwd` = :pwd',{
            login,
            pwd
        }))[0]


        return user === undefined ? false : new UserRecord(user)

    }

    static async findOne(id:string):Promise<UserRecord|undefined>{
        const [user]: any = (await pool.execute('SELECT * FROM `account` WHERE `id` = :id',{
            id
        }))[0]

        return user ? new UserRecord(user) : undefined

    }





}