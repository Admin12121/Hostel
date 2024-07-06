import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbconfig/dnconfig";

connect();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (username) {
      const user = await User.findOne({ username }).select("-password");
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ data: user });
    } else {
      const users = await User.find().select("-password");
      return NextResponse.json({ data: users });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const user = await User.findOne({ _id: id });

    if (!user) {
      return NextResponse.json(
        { error: "User doesn't exist" },
        { status: 404 }
      );
    }

    await user.deleteOne();
    return NextResponse.json({
      message: "User Deleted Successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const { fname, lname, phone, email, password } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const user = await User.findOne({ _id: id });

    if (!user) {
      return NextResponse.json(
        { error: "User doesn't exist" },
        { status: 404 }
      );
    }

    if (fname) user.fname = fname;
    if (lname) user.lname = lname;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    const updatedUser = await user.save();
    return NextResponse.json({
      message: "User updated successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
