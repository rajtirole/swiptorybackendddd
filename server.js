import { configDotenv } from "dotenv";
import connectToDB from './src/config/db_config/db.js'
import app from "./src/app.js";

configDotenv()
const PORT=process.env.PORT||5300;
connectToDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("app listening on port ",PORT);
    })
}).catch((error)=>{
    console.log('mongodb connection error',error);
    throw error;
})