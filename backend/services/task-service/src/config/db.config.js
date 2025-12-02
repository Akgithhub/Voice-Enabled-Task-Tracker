import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const dburl = process.env.DB_URL

const connectDB = async () => {
    if(!dburl) console.log('Not able to get the db url');
    
    try {
        const connect = await mongoose.connect(dburl)
        if(connect) {
            console.log('MongoDB connected successfully');
        }
    } catch (error) {
        console.log("Error while connecting with db", error);
        
    }
}
export default connectDB;