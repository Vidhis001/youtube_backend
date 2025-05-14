import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema=new Schema({
      content:{
        type:String,//cloudinary url
        required:true,
     },
     video:{
        type:Schema.Types.ObjectId,//cloudinary url
        ref:"Video"
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


commentSchema.plugin(mongooseAggregatePaginate)
export const Comment=mongoose.model("Comment",commentSchema)