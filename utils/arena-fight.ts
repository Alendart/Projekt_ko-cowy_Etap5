import {WarriorRecord} from "../records/warrior.record";
import {Fighter} from "../types/fighter";
import {fighterInitialization} from "./warrior-stat-conversion";

function getRandomInt(min:number, max:number):number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}

export class ArenaFight {
    private war1: WarriorRecord;
    private war2: WarriorRecord;
    private allWar: WarriorRecord[];
    private fighter1: Fighter;
    private fighter2: Fighter;
    lastWar:WarriorRecord;

    constructor(obj: WarriorRecord) {
        this.war1 = obj;
    }

    private async initialization(){
        await this.chooseSecondWarrior();
        this.prepareStats();
    }

    private async chooseSecondWarrior():Promise<void>{
        this.allWar = (await WarriorRecord.findAllWarriors()).filter((war) => war.name !== this.war1.name);
        const count = this.allWar.length;
        const random = getRandomInt(0,count)
        this.war2 = this.allWar[random]
    }

    private prepareStats(){
        this.fighter1 = fighterInitialization(this.war1);
        this.fighter2 = fighterInitialization(this.war2);

    }

    private avoidCheck(defender:Fighter): string|boolean{
        const dodge = Math.random();
        const block = Math.random();
        if(defender.dodgeChance >= dodge){
            return 'dodged'
        } else if (defender.blockChance >= block){
            return 'blocked'
        } else {
            return false
        }


    }

    private critCheck(attacker:Fighter):boolean{
        const crit = Math.random();
        return attacker.criticalHitChance >= crit

    }

    private damageCalc(attacker:Fighter, defender:Fighter, crit:boolean):number {
        const attack = attacker.attackDamage;
        const protection = defender.protection;
        let damage = crit ? (attack * 2 - protection) : (attack - protection)

        return damage <= 0 ? 0 : damage
    }

    private logBattle(attacker:Fighter, defender:Fighter, specialEffect:string|boolean, damage?:number):string{
        if (!specialEffect){
            if (damage){
                return `${attacker.name} hit ${defender.name} and deal ${damage} with that blow`
            } else {
                return `${attacker.name} hit ${defender.name} but his attack was fully blocked by ${defender.name} armour`
            }
        } else {
            if (specialEffect === 'dodged'){
                return `${defender.name} dodged ${attacker.name} attack and avoided all damage`
            } else if (specialEffect === 'blocked'){
                return `${defender.name} blocked ${attacker.name} attack with his shield`
            } else if (specialEffect === true){
                return `${attacker.name} critically hit ${defender.name} and deal ${damage} with that powerful blow`
            }
        }
    }

    private makeAttack(attacker:Fighter, defender:Fighter):[number,string]{
        const avoid = this.avoidCheck(defender);
        const crit = this.critCheck(attacker);
        if (!avoid){
            const damage = this.damageCalc(attacker,defender,crit);
            const log = this.logBattle(attacker,defender,crit,damage)
            return [damage,log];
        } else {
            const log = this.logBattle(attacker,defender,avoid)
            return [0,log];
        }

    }

    async fight():Promise<string[]>{
        await this.initialization()

        const battleLog:string[] = [];
        const first = this.fighter1.initiative >= this.fighter2.initiative ? this.fighter1 : this.fighter2;
        const second = first === this.fighter1 ? this.fighter2 : this.fighter1;
        battleLog.push(`New fight begins!!! This time on the arena ${first.name} dueling ${second.name}`);
        battleLog.push(`${first.name} have bigger initiative and he will attack first!`)
        do {
            // first attack
            const [firstAttack,log] = this.makeAttack(first,second);
            battleLog.push(log);
            second.hitPoints -= firstAttack;
            battleLog.push(`${second.name} still have ${second.hitPoints} hp left`);
            if (second.hitPoints <= 0){
                break
            } else {
                // second attack
                const [secondAttack,log] = this.makeAttack(second, first);
                battleLog.push(log);
                first.hitPoints -= secondAttack;
                battleLog.push(`${first.name} still have ${first.hitPoints} hp left`);
            }
        } while (first.hitPoints > 0 && second.hitPoints > 0)


        if ( first.hitPoints <= 0 ){
            battleLog.push(`The winner is ${second.name}!!!`)
            await (await WarriorRecord.findWarrior(second.name)).updateWinCount()

        } else if (second.hitPoints <= 0) {
            battleLog.push(`The winner is ${first.name}!!!`)
            await (await WarriorRecord.findWarrior(first.name)).updateWinCount()
        }

        return battleLog
    }

}
