import { log } from "console";
import foodModel from "../models/foodModel.js";
import fs from 'fs'
import mongoose from "mongoose";

//add items : 

const addFood = async (req, res) => {
    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category) {
        return res.status(404).json({ success: false, message: "Vui lòng nhập đủ dữ liệu !" });
    }

    if (Number.isFinite(price)) {
        return res.status(404).json({ success: false, message: "Giá trị giá không hợp lệ !" });
    }

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: name,
        description: description,
        price: price,
        category: category,
        image: image_filename
    })

    try {
        await food.save();
        res.status(201).json({
            success: true,
            message: "Thêm thành công",
            data: food
        });


    } catch (error) {

        console.log(error)
        res.json({ success: false, message: "Error" })

    }

}

//all list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({})
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })

    }
}

//Removing 
const removeFood = async (req, res) => {
    try {
        const { id } = req.body;
        console.log("BODY:", req.body);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại !"
            });
        }

        const food = await foodModel.findById(id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại !"
            });
        }

        if (food.image) {
            fs.unlink(`uploads/${food.image}`, (err) => {
                if (err) console.error("Error deleting image:", err);
            });
        }

        await foodModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Xóa sản phẩm thành công"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const updateFood = async (req, res) => {
    const { id, name, description, price, category } = req.body;
    const updatedData = {
        name,
        description,
        price,
        category,
    };

    if (!name || !description || !price || !category) {
        return res.status(404).json({ success: false, message: "Vui lòng nhập đủ dữ liệu !" });
    }

    if (Number.isFinite(price)) {
        return res.status(404).json({ success: false, message: "Giá trị giá không hợp lệ !" });
    }

    if (req.file) {
        const food = await foodModel.findById(id);


        if (food && food.image) {
            fs.unlink(`uploads/${food.image}`, (err) => {
                if (err) console.error("Error deleting old image", err);
            });
        }

        updatedData.image = req.file.filename;
    }

    try {
        const updatedFood = await foodModel.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedFood) {
            return res.status(404).json({ success: false, message: "Sản phẩm không tồn tại !" });
        }

        res.json({ success: true, message: "Cập nhập thành công", data: updatedFood });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating food item" });
    }
};
const searchFood = async (req, res) => {
    console.log("Search query received:", req.query.q); // Log the query parameter
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const products = await foodModel.find({
            name: { $regex: q, $options: "i" }

        });
        console.log("Search Results:", products);

        if (!products.length) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error("Error searching for products:", error);
        res.status(500).json({ message: "Server error" });
    }
};



export { addFood, listFood, removeFood, updateFood, searchFood }