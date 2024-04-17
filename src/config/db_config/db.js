import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js';
async function connectToDB(){
try {
    const moongoseConnection=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    console.log(`mongoose connected to ${DB_NAME}`);
    // console.log(moongoseConnection);
    
} catch (error) {
    
    console.log('mongo db connection error',error);
    process.exit(1)
    
}
}
export default connectToDB