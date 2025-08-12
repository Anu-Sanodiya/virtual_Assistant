const express =require( 'express')

const dotenv = require('dotenv')
dotenv.config()
const connectDB = require('./config/db');
 const authRouter = require('./routes/auth.routes')
const cors= require('cors')
const cookieParser = require('cookie-parser');
// const userRouter = require('./routes/user.routes');


const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

const port = process.env.PORT||5000 

app.use(express.json())
app.use(cookieParser());
app.use("/api/auth",authRouter)
// app.use("/api/users",userRouter)



app.listen(port,()=>{
    connectDB()
    console.log(`server started at ${port}` ) 
})
