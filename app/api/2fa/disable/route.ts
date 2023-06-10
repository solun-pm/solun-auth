import dbConnect from "@/utils/dbConn";
import { findOneDocument, updateOneDocument } from "@/utils/dbUtils";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const res = await request.json();

        await dbConnect();

        let user_id = res.user_id;

        const user = await findOneDocument(User, { user_id: user_id });

        if (!user) {
            return NextResponse.json({ message: "User does not exist or password is incorrect" }, { status: 400 });
        }

        await updateOneDocument(User, { user_id: user_id }, { two_fa: false, two_fa_secret: '' });

        return NextResponse.json({ message: "2FA disabled successfully" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}