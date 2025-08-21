const express =require( 'express')

const dotenv = require('dotenv')
dotenv.config()
const connectDB = require('./config/db');

//   const authRouter = require('./routes/auth.routes')
const geminiResponse = require('./gemini')
// const userRouter = require('./routes/user.routes');
const cors= require('cors')
const cookieParser = require('cookie-parser');



const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true
}));

const port = process.env.PORT||5000 

app.use(express.json())
app.use(cookieParser());
// app.use("/api/auth",authRouter)
// app.use("/api/users",userRouter)

app.get("/", async (req, res) => {
  try {
    let prompt = req.query.prompt || "Explain how AI works in a few words";
    const data = await geminiResponse(prompt);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port,()=>{
    connectDB()
    console.log(`server started at ${port}` ) 
})
