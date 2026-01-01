import userModel from "../models/userModel.js"

//add items to UserCart
const addToCart = async(req,res)=>{

    try {
        let userData = await userModel.findById(req.body.userId);
        console.log(req.body.userId);

        let cartData = await userData.cartData;

        if(!cartData[req.body.itemId]){

            cartData[req.body.itemId] = 1
        }

        else {

            cartData[req.body.itemId] +=1;
        }

        await userModel.findByIdAndUpdate(req.body.userId,{cartData});

        res.json({success:true,message:"Added to cart sucessfully"})


    } catch (error) {

        console.log(error);
        res.json({success:false,message:"Error"});
        
    }

}

//remove Items from userCart

import mongoose from "mongoose";

const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // kiểm tra id rỗng
    if (!userId || !itemId) {
      return res.status(400).json({ success: false, message: "User ID or Item ID is missing" });
    }


    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (cartData[itemId] && cartData[itemId] > 0) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId]; // xoá hẳn khi số lượng = 0
      }
    } else {
      return res.status(400).json({ success: false, message: "Item not in cart" });
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    return res.status(200).json({ success: true, message: "Removed from cart" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//fetch User Cart Data
const getCart = async(req,res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({success:true,cartData})
    } catch (error) {
        console.log(error);

        res.json({success:false,message:"Error"});

    }

}

export{addToCart,removeFromCart,getCart}