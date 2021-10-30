import  mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
    course_id:{
        type:String,
        require:true,
        trim:true
    },
    eng_name:{
        type:String,
        require:true,
        trim:true
    },
    thai_name:{
        type:String,
        require:true,
        trim:true
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId, 
            ref:"SubjectComment",
            require:true
        }
    ],
    like:{
        type:Number,
    },
    homework_rate:[
        {
            type:Number,
            require:true,
        }
    ],
    content_rate:[
        {
            type:Number,
            require:true,
        }
    ],
    lecturer_rate:[
        {
            type:Number,
            require:true,
        }
    ],
    isAllowed:{
        type:Boolean,
        default: true,
        require:true,
    },
    createdAt: { 
        type: Date, 
        require: true, 
        default: () => Date.now() 
    },
})
const Subject = mongoose.model("Subject", SubjectSchema);
export default Subject;