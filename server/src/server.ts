import {createServer}  from 'http'
import dotenv from 'dotenv'
import app from "./app";
dotenv.config()
const PORT = process.env.PORT
const server = createServer(app)

server.listen(PORT,()=>{
    console.log(`Server connected on -:- http://localhost:${PORT}`);
    
})