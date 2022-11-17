import {WarriorRecord} from "../records/warrior.record";
import {Fighter} from "../types/fighter";

export function fighterInitialization(obj:WarriorRecord){
    const fighter: Fighter = {
        name: obj.name,
        attackDamage: attackDamage(obj),
        protection: protection(obj),
        initiative: initiative(obj),
        criticalHitChance: criticalHitChance(obj),
        hitPoints: hitPoints(obj),
        dodgeChance:dodgeChance(obj),
        blockChance: blockChance(obj)
    }
    return fighter
}

function attackDamage(obj:WarriorRecord):number{
    return Math.floor(Number(obj.strength * 2 + obj.endurance/3 + obj.agility/3)*10)
}

function protection(obj:WarriorRecord):number{
    return Math.floor(obj.defence * 0.8 * 10)
}
function initiative(obj:WarriorRecord):number{
    return obj.agility
}

function criticalHitChance(obj:WarriorRecord):number{
    return obj.agility*0.05
}

function hitPoints(obj:WarriorRecord):number{
    return obj.endurance*110
}

function blockChance(obj:WarriorRecord):number{
    return (obj.defence*2 + obj.endurance)/100
}

function dodgeChance(obj:WarriorRecord):number{
    return (obj.defence/2 + obj.agility*2)/100
}