import { connect } from "@/dbconfig/dnconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

connect ()
export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (  !email || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User doesn't exists" }, { status: 400 });
        }


        const validatePassword = await bcrypt.compare
        (password, user.password)
        if(!validatePassword){
            return NextResponse.json({error : "Invalid Password"}, {status: 400});
        }

        const tokenData = {
            id : user._id,
            username : user.username,
            email : user.email,
            admin : user.isAdmin
        }

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn : "7d"})

        const response = NextResponse.json({
            message: "Login SuccessFull",
            success: true,
        })


        response.cookies.set("token", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });
        
        
        return response;
    } catch (error:any) {
        console.error("Signup error:", error);

        if (error.code === 11000) {
            // Extract the duplicate key field name
            const field = Object.keys(error.keyPattern)[0];
            let customMessage = "Duplicate field value error";

            if (field === "email") {
                customMessage = "Email already exists";
            } else if (field === "phone") {
                customMessage = "Phone number already exists";
            } else if (field === "username") {
                customMessage = "Username already exists";
            }

            return NextResponse.json({ error: customMessage }, { status: 400 });
        }

        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}