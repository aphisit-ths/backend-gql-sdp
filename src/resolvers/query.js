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
    return User.findById(userId).populate({
      path: "subject_comments",
    });
  },
  admin: async (parent, args, { userId }, info) => {
    // Check if user logged in
    if (!userId) throw new Error("please ,log in.");
    const user = await User.findById(userId);
    console.log(user);
    if (!user.isAdmin) {
      throw new Error("your not authorized .");
    } else {
      return User.findById(userId).populate({
        path: "subject_comments",
      });
    }
  },
  users: (parent, args, context, info) =>
    User.find({}).populate({
      path: "subject_comments",
      populate: { path: "subjectId" },
    }),

  // product: (parent, args, context, info) =>
  //   Product.findById(args.id).populate({
  //     path: "user",
  //     populate: { path: "products" },
  //   }),
  // products: (parent, args, context, info) =>
  //   Product.find({}).populate({
  //     path: "user",
  //     populate: { path: "products" },
  //   }),

  //New Project
  subjects: (parent, args, context, info) =>
    Subject.find({isAllowed:true}).populate({
      path: "comments",
    }),
  subjectsAdmin: (parent, args, context, info) =>
    Subject.find({}).populate({
      path: "comments",
    }),

  subject: (parent, args, context, info) =>
    Subject.findById(args.id).populate({
      path: "comments",
      options: { sort: { createdAt: "-1" } },
      populate: { path: "owner" },
    }),

  subjectComments: (parent, args, context, info) =>
    SubjectComment.find({})
      .populate({ path: "owner" })
      .populate({ path: "subjectId" })
      .sort({ createdAt: -1 }),
};

export default Query;
