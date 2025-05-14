import mongoose , {Schema} from "mongoose";

const playlistSchema=new Schema({
     name:{
        type:String,//cloudinary url
        required:true
     },
    description:{
        type:String,//cloudinary url
        required:true
     },
     videos:[
        {
           type:Schema.Types.ObjectId,//cloudinary url
           ref:"Video"
        }
     ],
     owner:{
        type:Schema.Types.ObjectId,//cloudinary url
        ref:"User"
     },
},
{
    timestamps:true
}
)


export const Playlist=mongoose.model("Playlist",playlistSchema)