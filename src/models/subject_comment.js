import  mongoose from "mongoose";

const SubjectCommentSchema = new mongoose.Schema({
    comment:{
        type:String,
        require:true,
        trim:true
    },
    grade:{
        type:String,
        require:true,
        trim:true
    },
    year:{
        type:String,
        require:true,
        trim:true
    },
    
    section:{
        type:String,
        require:true,
        trim:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User',
        require:true,
    },
    subjectId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'Subject',
        require:true,
    },
    createdAt: { 
        type: Date, 
        require: true, 
        default: () => Date.now() 
    },
    homework_rate:{
        type:Number,
        require:true,
    },
    content_rate:{
        type:Number,
        require:true,
    },
    lecturer_rate:{
        type:Number,
        require:true,
    },
    

})

const SubjectComment = mongoose.model("SubjectComment", SubjectCommentSchema);
export default SubjectComment