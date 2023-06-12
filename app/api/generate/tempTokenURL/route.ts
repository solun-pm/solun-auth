import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";
import { generateToken } from "@/utils/generate";
import TempToken from "@/models/tempToken";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        const res = await request.json();

        await dbConnect();

        let user_id = res.user_id;
        let fqe = res.fqe;
        let service = res.service;
        let token = res.token;

        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

        if (token == null || token == undefined) {
            return NextResponse.json({ message: "No token provided" }, { status: 401 });
        }

        try {
            jwt.verify(token, JWT_SECRET_KEY as string);

            const tempToken = generateToken();
            const newTempToken = new TempToken({
                user_id: user_id,
                fqe: fqe,
                token: tempToken,
                service: service,
            });
            await newTempToken.save();

            const redirectUrl = 'https://'+ process.env.NEXT_PUBLIC_WEBMAIL_AUTH_DOMAIN + tempToken;

            return NextResponse.json({ redirectUrl: redirectUrl }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ message: "Invalid token, please Login again" }, { status: 401 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
