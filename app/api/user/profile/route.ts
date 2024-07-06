import { getUserData } from "@/helper/getUserData";

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbconfig/dnconfig";

connect();

export async function GET(request:NextRequest) {
    try{
        const userId = await getUserData(request);
        const user = await User.findOne({_id: userId}).select("-password ")
        return NextResponse.json({
            data: user
        })
    }catch (error:any){
        return NextResponse.json({error: error.message}, {status: 400})
    }
}