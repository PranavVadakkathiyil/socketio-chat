import express, { Application } from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
const app:Application = express()

app.use(cors())
app.use(cookieparser())
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({limit:"16kb",extended:true}))
app.use(express.static('public'))

export default app


