import express from "express"
import * as cors from "cors"
import dotenv  from "dotenv"
import {db} from "./confi/db.js"
import {schema} from "./schema/Schema.js"
import router from "./routes/routes.js"
dotenv.config()

const app=express()
app.use(express.json());
app.use(cors.default()); 
app.use(express.urlencoded({ extended: true }));


(async()=>{
    try{
        await db.query(schema)
        console.log("database connected")
    }
    catch(err){
        console.log("db not connected",err.message)

    }
})();
app.use(router)


app.listen(process.env.PORT,()=>{
    console.log("server running",process.env.PORT)
})