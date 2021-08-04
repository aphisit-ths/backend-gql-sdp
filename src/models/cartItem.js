//mongoose model

import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    require: true,
    default: () => Date.now(),
  },
});

const CartItem = mongoose.model("CartItem", cartItemSchema);
export default CartItem;