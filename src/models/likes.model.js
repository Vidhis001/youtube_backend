
import mongoose , {Schema} from "mongoose";

const likeSchema=new Schema({
     video:{
        type:Schema.Types.ObjectId,//cloudinary url
        ref:"Video"
     },
    comment:{
        type:Schema.Types.ObjectId,//cloudinary url
        ref:"Comment"
     },
     tweet:{
        type:Schema.Types.ObjectId,//cloudinary url
        ref:"Tweet"
     },
     likedBy:{
        type:Schema.Types.ObjectId,//cloudinary url
        ref:"User"
     },
},
{
    timestamps:true
}
)


export const Like=mongoose.model("Like",likeSchema)