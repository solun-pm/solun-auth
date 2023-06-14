import dbConnect from "@/utils/dbConn";
import { findOneCASEDocument } from "@/utils/dbUtils";
import User from "@/models/user";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { decrypt } from "@/utils/encryption";
import { comparePassword } from "@/utils/hash";
import { generateTempToken } from "@/utils/generate";

export async function POST(request: Request) {
    try {
        const res = await request.json();

        await dbConnect();

        let fqe = res.fqe;
        let password = res.password;
        let service = res.service;

        const user = await findOneCASEDocument(User, { fqe: fqe });

        if (!user) {
            return NextResponse.json({ message: "User does not exist or password is incorrect" }, { status: 400 });
        }

        if(!await comparePassword(password, user.password)) {
            return NextResponse.json({ message: "User does not exist or password is incorrect" }, { status: 400 });
        }

        const decryptedPrivateKey = decrypt(user.private_key, password);
        
        if (decryptedPrivateKey == '') {
            return NextResponse.json({ message: "User does not exist or password is incorrect" }, { status: 400 });
        }

        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
        // @ts-ignore: Works fine with it
        const token = jwt.sign({ fqe: user.fqe, username: user.username, user_id: user.user_id, private_key: decryptedPrivateKey, password: password }, JWT_SECRET_KEY, { expiresIn: '1h' });

        const two_fa = user.two_fa;

        if (service === "Mail" && user.active) {
            if(!two_fa) {
                const url = await generateTempToken(user.user_id, user.fqe, 'Mail', token, password, user.fast_login);

                if (typeof url ==='string') {
                    return NextResponse.json({ redirect: true, redirectUrl: url, service: service, two_fa: two_fa }, { status: 200 });
                } else {
                    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
                }
            }
            return NextResponse.json({redirect: false, message: "2FA is needed to login", two_fa: two_fa}, {status: 200})
        } else if (user.active) {
            return NextResponse.json({ redirect: false, token: token, message: "Logged in successfully", two_fa: two_fa }, { status: 200 });
        } else {
            return NextResponse.json({ redirect: false, message: "User is not active" }, { status: 400 });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}