import dbConnect from "@/utils/dbConn";
import { findOneDocument, updateOneDocument } from "@/utils/dbUtils";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { encrypt } from "@/utils/encryption";

export async function POST(request: Request) {
    try {
        const res = await request.json();

        await dbConnect();

        let user_id = res.user_id;
        let secret = res.secret;
        let password = res.password;

        const user = await findOneDocument(User, { user_id: user_id });

        if (!user) {
            return NextResponse.json({ message: "User does not exist or password is incorrect" }, { status: 400 });
        }

        const decryptedSecret = await encrypt(secret, password);

        await updateOneDocument(User, { user_id: user_id }, { two_fa: true, two_fa_secret: decryptedSecret });

        return NextResponse.json({ message: "2FA enabled successfully" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}