import {WarriorStat} from "../types/warrior-stat";


export const handlebarsHelpers = {
    sum: (obj:WarriorStat):number => 10 - (Object.values(obj)).reduce((prev:number,curr:number) => prev+curr,0),
    disable: (obj:WarriorStat):string => {
        return Object.values(obj).reduce((prev:number,curr:number) => prev+curr,0) === 10 ? "" : "disabled"
    }
}