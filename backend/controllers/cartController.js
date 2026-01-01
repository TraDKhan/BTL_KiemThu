import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js"

//add items to UserCart
const addToCart = async (req, res) => {
    try {
        // 👇 userId CHỈ LẤY TỪ TOKEN
        const userId = req.body.userId;
        const { itemId, quantity } = req.body;

        // Thiếu item
        if (!itemId) {
            return res.json({ success: false, message: "Thiếu item" });
        }

        // Số lượng < 1
        if (!quantity || quantity < 1) {
            return res.json({ success: false, message: "Số lượng phải >= 1" });
        }

        //User tồn tại (phòng trường hợp user bị xóa)
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({
                success: false,
                message: "User không tồn tại"
            });
        }

        let cartData = userData.cartData || {};

        // Đã có sản phẩm
        if (cartData[itemId]) {
            return res.json({
                success: false,
                message: "Sản phẩm đã có"
            });
        }

        // Thêm mới
        cartData[itemId] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({
            success: true,
            message: "Thêm thành công"
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi server" });
    }
};

//remove Items from userCart

// import mongoose from "mongoose";

const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // kiểm tra id rỗng
    if (!userId || !itemId)
      return res.status(400).json({ success: false, message: "User ID or Item ID is missing" });

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
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({ success: true, cartData })
    } catch (error) {
        console.log(error);

        res.json({ success: false, message: "Error" });

    }

}

export { addToCart, removeFromCart, getCart }