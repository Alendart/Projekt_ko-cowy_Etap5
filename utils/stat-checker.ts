import {WarriorStat} from "../types/warrior-stat";


export function statChecker(obj:WarriorStat):boolean{
    const values = Object.values(obj);
    for (const val of values){
        if (val < 1 || val > 7){
            return false
        }
    }
    const sum = values.reduce((prev:number,curr:number) => prev+curr,0)
    return sum <= 10

}