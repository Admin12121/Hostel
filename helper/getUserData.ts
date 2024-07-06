import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const getUserData = (request: NextRequest) => {
    try{
        const token = request.cookies.get("token")?.
        value || '';
        const  deacodedToken:any = jwt.verify(token, process.env.TOKEN_SECRET!);
        return deacodedToken.id
    }
    catch(error:any){
        throw new Error (error.message);
    }
} 