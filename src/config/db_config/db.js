import mongoose from 'mongoose'
import { DB_NAME } from '../../constant.js';
async function connectToDB(){
try {
    //connect to db 
    console.log(process.env.MONGODB_URL);
    const { connection }=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    if(connection){
        console.log(`db connect to ${connection.host}`);
    }
    
} catch (error) {
    console.log('mongo db connection error',error);
    process.exit(1)
    
}
}
export default connectToDB