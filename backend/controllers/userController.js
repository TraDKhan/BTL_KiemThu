import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"


//Log in 

const loginUser = async (req, res) => {

    const { email, password } = req.body;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    try {
        if (email === '') {
            return res.json({ success: false, message: "Email không được để trống!" })
        } else if (!regex.test(email)) {
            return res.json({ success: false, message: "Email không đúng định dạng!" })
        } else if (password.length < 6) {
            return res.json({ success: false, message: "Mật khẩu phải từ 6-16 kí tự" })
        } else if (password.length > 16) {
            return res.json({ success: false, message: "Mật khẩu phải từ 6-16 kí tự" })
        } else if (password === '') {
            return res.json({ success: false, message: "Mật khẩu không được để trống" })
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Sai email hoặc mật khẩu" })


        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Sai email hoặc mật khẩu" })
        }

        const token = createToken(user._id);
        res.json({ success: true, token, message: "Đăng nhập thành công" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })

    }

}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

//Sign up
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        //Check user Existions
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "Already Exists" })
        }

        //validating email format and STRONG PASSWORD

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a stronger password" })

        }

        // hash passw

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save();
        const token = createToken(user._id)
        res.json({ success: true, token });


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })


    }

}

export { loginUser, registerUser }