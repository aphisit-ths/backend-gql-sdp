
import  mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    desc:{
        type:String,
        require:true,
        trim:true
    },
    price:{
        type:Number,
        require:true
    },
    imgUrl:{
        type:String,
        require:true,
        trim:true
    },
    user: {
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User',
        require:true
    },
  createdAt: { 
      type: Date, 
      require: true, 
      default: () => Date.now() },
})

const Product =  mongoose.model('Product',productSchema)
export default Product