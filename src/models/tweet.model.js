import mongoose , {Schema} from "mongoose";

const tweetSchema=new Schema({
     content:{
        type:String,//cloudinary url
        required:true
     },
     owner:{
        type:Schema.Types.ObjectId,//cloudinary url
        ref:"User"
     },
},
{
    timestamps:true
}
)


export const Tweet=mongoose.model("Tweet",tweetSchema)