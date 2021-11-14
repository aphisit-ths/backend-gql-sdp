import Product from "../models/product";
import bcrypt from "bcryptjs";
import User from "../models/user";
import SubjectComment from "../models/subject_comment";
import Subject from "../models/subject";
import CartItem from "../models/cartItem";
import jwt from "jsonwebtoken";

const Mutation = {
  login: async (parent, args, context, info) => {
    const { email, password } = args;
    //find user in database
    const user = await User.findOne({ email })
      .populate({
        path: "products",
        populate: { path: "user" },
      })
      .populate({ path: "carts", populate: { path: "product" } });
    if (!user) throw new Error("Invalid email or password.");
    //Compare Password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error("Invalid email or password.");
    //Create token
    const token = jwt.sign({ userId: user.id }, process.env.SECRET, {
      expiresIn: "7days",
    });
    return { user, jwt: token };
  },
  signup: async (parent, args, context, info) => {
    //Trim and Lower Case email
    const email = args.email.trim().toLowerCase();
    //Check if email already exist in data base
    const currentUsers = await User.find({});
    const isEmailExist =
      currentUsers.findIndex((user) => user.email === email) > -1;
    if (isEmailExist) {
      throw new Error("email already exist.");
    }

    //Validate
    if (args.password.trim().length < 6) {
      throw new Error("password must be at least 6 charactors...");
    }
    //Hash
    const password = await bcrypt.hash(args.password, 10);
    return User.create({ ...args, email, password ,isAdmin:false });
  },

  //<=========== ADMIN =========>
  updateRole:async (parent, args, context, info) => {
    const {id} = args
    if (!id) throw new Error("please , provide id field ")
    //find user in database and check isadmin
    const user = await User.findById(id);
    if (!user) throw new Error("user not found.")
    const roleInfo = {
      isAdmin: args.isAdmin
    }
    
    //updating user
    await User.findByIdAndUpdate(id,roleInfo)
    
    const updatedUser = User.findById(id)
    return updatedUser
  },
  //<=========== ADMIN =========>

  /** createProduct: async (parent, args, { userId }, info) => {
    //Check if user logged in
    if (!userId) throw new Error("please, log in .");
    if (!args.desc || !args.price || !args.imgUrl) {
      throw new Error("please provide all required fields");
    }
    const product = await Product.create({ ...args, user: userId });
    const user = await User.findById(userId);
    if (!user.products) {
      user.products = [product];
    } else {
      user.products.push(product);
    }
    await user.save();

    return Product.findById(product.id).populate({
      path: "user",
      populate: { path: "products" },
    });
  }, */
  /** addToCart: async (parent, args, { userId }, info) => {
    //Id --> product ID Cart ID
    const { id } = args;
    if (!userId) throw new Error("please, log in .");
    try {
      //1.find User who perform item to cart ? ---> from loggedin ?

      const user = await User.findById(userId).populate({
        path: "carts",
        populate: {
          path: "product",
        },
      });

      //2. Check if the new added item new addToCart is already user.carts ?
      const findCartItemIndex = user.carts.findIndex(
        (cartItem) => cartItem.product.id === id
      ); //Return if already cart == Index <1 || True
      if (findCartItemIndex > -1) {
        /// |----> A: The new addToCart item is already in cart
        //|Find the cartitem from database ----> Update it
        user.carts[findCartItemIndex].quantity += 1;
        await CartItem.findByIdAndUpdate(user.carts[findCartItemIndex].id, {
          //|Update quantity of that cartItem --> increase ++
          quantity: user.carts[findCartItemIndex].quantity,
        });

        const updatedCartItem = await CartItem.findById(
          user.carts[findCartItemIndex].id
        )
          .populate({ path: "product" })
          .populate({ path: "user" });

        return updatedCartItem;
      } else {
        /// |----> B: The new addToCart item is not in cart yet
        //|Create new cartItem
        const cartItem = await CartItem.create({
          product: id,
          quantity: 1,
          user: userId,
        });

        // find new cartItem
        const newCartItem = await CartItem.findById(cartItem.id)
          .populate({ path: "product" })
          .populate({ path: "user" });

        await User.findByIdAndUpdate(userId, {
          carts: [...user.carts, newCartItem],
        });
        return newCartItem;
      }
    } catch (error) {
      console.log(error);
    }
  }, */
  /** updateProduct: async (parent, args, { userId }, info) => {
    if (!userId) throw new Error("please, log in .");

    const { id, desc, price, imgUrl } = args;

    //find product in database
    const product = await Product.findById(id);

    const ownerProduct = product.user;

    //Check if user is the owner of the product ?

    if (userId !== ownerProduct.toString()) {
      throw new Error("You are not authorized.");
    }

    //From updated information
    const updatedInfo = {
      desc: !!desc ? desc : product.desc,
      price: !!price ? price : product.price,
      imgUrl: !!imgUrl ? imgUrl : product.imgUrl,
    };
    //Update Product in database
    await Product.findByIdAndUpdate(id, updatedInfo);

    //find the updated product
    const updatedProduct = await Product.findById(id).populate({
      path: "user",
    });

    return updatedProduct;
  },
  deleteProduct: async (parent, args, { userId }, info) => {
    if (!userId) throw new Error("please, log in .");
    const { id } = args;
    const product = await Product.findById(id);
    const ownerProduct = product.user.toString();

    //Check user is  owner's Product yet ?
    if (userId !== ownerProduct) {
      throw new Error("you are not authorized.");
    }
    const deletedProduct = await Product.findById(id).populate({
      path: "user",
    });
    await Product.findByIdAndDelete(id);
    const user = await User.findById(userId);

    user.products.pull(id);
    await user.save();
    return deletedProduct;
  },
  deleteCart: async (parent, args, { userId }, info) => {
    if (!userId) throw new Error("please, log in .");
    const { id } = args;

    //Find Cart form id in database
    const cart = await CartItem.findById(id);
    //find user

    const user = await User.findById(userId);

    //Check owner ship of the cart ?

    if (userId !== cart.user.toString()) {
      throw new Error("You are not authorized.");
    }

    //Delete
    const deletedCart = await CartItem.findOneAndRemove(id);
    const updatedUserCarts = user.carts.filter(
      (cartId) => cartId.toString() !== deletedCart.id.toString()
    );
    await User.findByIdAndUpdate(userId, { carts: updatedUserCarts });
    return deletedCart;
  }, */
  

  addSubject: async (parent, args, context, info) => {
    const userId = "6148b1fc5d04582b38612c7e";
    const { course_id, eng_name, thai_name } = args;
    if (!userId) throw new Error("please, log in .");

    //check course id is already exit?
    const currentSubject = await Subject.find({});
    const isCourseIdExisted =
      currentSubject.findIndex((subject) => subject.course_id === course_id) >  -1;

    if (isCourseIdExisted) throw new Error("this course id is already exist");

    if (!course_id || !eng_name || !thai_name) {
      throw new Error("please ! provide all fields");
    }
    const subject = await Subject.create({ ...args ,isAllowed:true});
    return Subject.findById(subject.id)
  },

  addSubjectComment: async (parent, args, { userId }, info) => {
    //Id คือ Course id
    const { subjectId, comment, grade,  year, section } = args;
    if (!userId) throw new Error("please, log in .");

    if (!subjectId || !comment || !grade  || !year || !section) {
      throw new Error("please provide all required fields");
    }

    const currentSubjects = await Subject.find({})
    const isExitSubject = await currentSubjects.findIndex((subject) => subject.id === subjectId) > -1;
    if(!isExitSubject) throw new Error ("This course does not exist ?! ")
    
    const commented = await SubjectComment.create({ ...args, owner: userId });

    const user = await User.findById(userId);

    if (!user.subject_comments) {
      user.subject_comments = [commented];
    } else {
      user.subject_comments.push(commented);
    }
    user.save();

    const subject = await Subject.findById(subjectId);
  
    if  (!subject.comments) {
      subject.comments = [commented];
    } else {
      subject.comments.push(commented);
    }
    
    
    //add homework_rate to Subject
    if (!subject.homework_rate) {
      subject.homework_rate = [args.homework_rate];
    } else {
      subject.homework_rate.push(args.homework_rate);
    }

    //add homework_rate to Subject
    if (!subject.content_rate) {
      subject.content_rate = [args.content_rate];
    } else {
      subject.content_rate.push(args.content_rate);
    }
    
    //add homework_rate to Subject
    if (!subject.lecturer_rate) {
      subject.lecturer_rate = [args.lecturer_rate];
    } else {
      subject.lecturer_rate.push(args.lecturer_rate);
    }
     subject.save();

    const success = await SubjectComment.findById(commented.id)
      .populate({ path: "subjectId", populate: { path: "comments" } })
      .populate({ path: "owner", populate: { path: "comments" } });
    return success;
  },
};

export default Mutation;
