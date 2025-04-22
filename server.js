import { configDotenv } from 'dotenv';
import express from 'express'
import connectMongoose from './Configration/mongoose.js';
import alluserRoutes from './Routes/routesIndex.js';

configDotenv();
const app = express();
const port = process.env.PORT || 3000;

connectMongoose();
app.use(express.json());

app.get('/',(req,res)=>{
    res.json({success:true,message:'Server started..'})
})

//end points
app.use('/api',alluserRoutes)

app.listen(port,()=>console.log('Server is running on port..',port));
