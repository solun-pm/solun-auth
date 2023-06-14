import dbConnect from "@/utils/dbConn";
import { findOneDocument, updateOneDocument } from "@/utils/dbUtils";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { decrypt, encrypt } from "@/utils/encryption";
import { comparePassword, hashPassword } from "@/utils/hash";

export async function POST(request: Request) {
    try {
        const res = await request.json();

        await dbConnect();

        let user_id = res.user_id;
        let currentPassword = res.currentPassword;
        let newPassword = res.newPassword;

        if (currentPassword === '' || newPassword === '') {
            return NextResponse.json({ message: "Please fill out all fields" }, { status: 400 });
        }

        const user = await findOneDocument(User, { user_id: user_id });

        if (!user) {
            return NextResponse.json({ message: "User does not exist or password is incorrect" }, { status: 400 });
        }

        if(!await comparePassword(currentPassword, user.password)) {
            return NextResponse.json({ message: "Password is incorrect" }, { status: 400 });
        }

        const decryptedPrivateKey = decrypt(user.private_key, currentPassword);
        const decryptedTwoFASecret = decrypt(user.two_fa_secret, currentPassword);
        const encryptedPrivateKey = encrypt(decryptedPrivateKey, newPassword);
        if (user.two_fa) {
            const encryptedTwoFASecret = encrypt(decryptedTwoFASecret, newPassword);

            await updateOneDocument(User, { user_id: user_id }, { two_fa_secret: encryptedTwoFASecret });
        }
        const hashedPassword = await hashPassword(newPassword);

        await updateOneDocument(User, { user_id: user_id }, { password: hashedPassword, private_key: encryptedPrivateKey });

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}