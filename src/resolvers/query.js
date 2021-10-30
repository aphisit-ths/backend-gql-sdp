import Product from "../models/product";
import User from "../models/user";
import SubjectComment from "../models/subject_comment";
import Subject from "../models/subject";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Query = {
  //ฟั่งชั่นที่จะไปดึงข้อมูลใน DB

  user: (parent, args, { userId }, info) => {
    // Check if user logged in
    if (!userId) throw new Error("please ,log in.");
    return User.findById(userId)
      .populate({
        path: "products",
        populate: { path: "user" },
      })
      .populate({ path: "carts", populate: { path: "product" } });
  },
  users: (parent, args, context, info) =>
    User.find({})
      .populate({
        path: "products",
        populate: { path: "user" },
      })
      .populate({ path: "carts", populate: { path: "product" } }),
  product: (parent, args, context, info) =>
    Product.findById(args.id).populate({
      path: "user",
      populate: { path: "products" },
    }),
  products: (parent, args, context, info) =>
    Product.find({}).populate({
      path: "user",
      populate: { path: "products" },
    }),

  //New Project
  subjects: (parent, args, context, info) =>
    Subject.find({})
      .populate({
        path: "comments",
      }),

  subject: (parent, args, context, info) =>
    Subject.findById(args.id)
      .populate({
        path: "comments",
      }),
      
  subjectComments: (parent, args, context, info) =>
    SubjectComment.find({})
    .populate({path: "owner",})
    .populate({ path: "subjectId"}),
};



export default Query;
