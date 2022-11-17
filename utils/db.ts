import {createPool} from 'mysql2/promise'


export const pool = createPool({
    database: "megak_arena",
    user: "root",
    decimalNumbers:true,
    namedPlaceholders: true,
    host: "localhost",
})