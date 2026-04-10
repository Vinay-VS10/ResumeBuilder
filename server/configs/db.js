import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        mongoose.connection.on("connected",()=>{
            console.log("Database connected successfully")})

            let mongodb_URI = process.env.MONGODB_URI;
            const projectName = 'resume-builder';

            if(!mongodb_URI){
                throw new Error("MONGODB_URI env not set")
            }

            if(mongodb_URI.endsWith('/')){
                mongodb_URI = mongodb_URI.slice(0,-1)
            }
            await mongoose.connect(mongodb_URI)
    } catch (error) {
        console.error("Failed connecting to MongoDB:",error)
    }
}

export default connectDB;