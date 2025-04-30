import mongoose from "mongoose";
const connectDB =async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI).then(()=>{
            console.log("MongoDB is connected")})
    
    } catch (error) {
        console.error(error);
        
    }
}

export default connectDB;
