import {pool} from "../utils/db";


export class WarriorRecord{
    readonly name:string;
    readonly strength:number;
    readonly defence:number;
    readonly endurance:number;
    readonly agility:number;
    public winCount:number = 0;

    constructor(obj:WarriorRecord) {
        this.name = obj.name;
        this.strength = Number(obj.strength);
        this.defence = Number(obj.defence);
        this.endurance = Number(obj.endurance);
        this.agility = Number(obj.agility);
        this.winCount = obj.winCount ?? 0;
        this.checkStatCount();

    }

    get warriorName():string{
        return this.name
    }

    private checkStatCount():void{
        const sum = this.strength + this.defence + this.endurance + this.agility
        if (sum !== 10){
            throw new Error('Warrior need to spend all 10 points!');
        }
    }


    async create():Promise<void>{
        await pool.execute('INSERT INTO `warrior` (`name`, `strength`,`defence`,`endurance`,`agility`,`winCount`)' +
            ' VALUES (:name,:strength,:defence,:endurance,:agility,:winCount)',{
            name:this.name,
            strength:this.strength,
            defence:this.defence,
            endurance:this.endurance,
            agility:this.agility,
            winCount: this.winCount
        })

    }

    async updateWinCount():Promise<number>{
        this.winCount += 1;
        await pool.execute('UPDATE `warrior` SET `winCount` = :winCount WHERE `name` = :name ',{
            name: this.name,
            winCount: this.winCount,
        })

        return this.winCount;
    }

    static async findWarrior(name:string):Promise<WarriorRecord|undefined>{
        const [warrior]:any = (await pool.execute('SELECT * FROM `warrior` WHERE `name` = :name',{
            name
        }))[0]

        return warrior ? new WarriorRecord(warrior) : undefined
    }

    static async findAllWarriors():Promise<WarriorRecord[]>{
        const [warriors]:any = (await pool.execute('SELECT * FROM `warrior` ORDER BY `winCount` DESC'));
        return warriors.map((war:WarriorRecord) => new WarriorRecord(war));
    }

}