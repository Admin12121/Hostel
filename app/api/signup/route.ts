import { connect } from "@/dbconfig/dnconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const { email, password, fname, lname, phone } = await request.json();

    console.log(email, password, fname, lname, phone);

    if (!fname || !email || !password || !lname || !phone) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fname,
      lname,
      phone,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        user: savedUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
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

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
