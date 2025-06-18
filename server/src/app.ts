import express, { Application } from 'express'
import cors from 'cors'
import cookieParser  from 'cookie-parser'
const app:Application = express()

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,               
}));
app.use(cookieParser())
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({limit:"16kb",extended:true}))
app.use(express.static('public'))




import UserRoute from './routes/User.route'
import MessageRoute from './routes/Message.route'
import ChatRoute from './routes/Chat.route'


app.use('/api/v1/user',UserRoute)
app.use('/api/v1/message',MessageRoute)
app.use('/api/v1/chat',ChatRoute)














export default app


