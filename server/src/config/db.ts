import mongoose, { connect, connection } from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const MONGODB_URI = process.env.MONGODB_URI

const ConnectDB = async()=>{
    try {
        const conn = await connect(MONGODB_URI!)
        console.log(`Database connectd with -:- ${conn.connection.host}`);
        
    } catch (error) {
        console.log('MongoDB connection error ',error);
        
    }
}
export default ConnectDB