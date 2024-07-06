import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbconfig/dnconfig";

connect();

export async function GET(request: NextRequest) {
    try{
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");

        if (username) {
            const user = await User.findOne({ username }).select("-password");
            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }
            return NextResponse.json({
                data: user
            });
        } else {
            const users = await User.find().select("-password");
            return NextResponse.json({
                data: users
            });
        }
    }catch (error:any){
        return NextResponse.json({error: error.message}, {status: 400})
    }
}

export async function DELETE(request: NextRequest) {
    try{
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const user = await User.findOne({ _id: id });

        if (!user) {
            return NextResponse.json({ error: "User doesn't exist" }, { status: 404 });
        }

        await user.deleteOne();
        const response = NextResponse.json({
            message: "UserDeleted SuccessFully",
            success: true,
        })
        return response;
    }catch (error:any){
        return NextResponse.json({error: error.message}, {status: 400})
    }
}