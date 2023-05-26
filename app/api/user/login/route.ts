import dbConnect from "@/utils/dbConn";
import { findOneCASEDocument } from "@/utils/dbUtils";
import User from "@/models/user";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { decrypt } from "@/utils/encryption";
import { generateToken } from "@/utils/generate";
import TempToken from "@/models/tempToken";

export async function POST(request: Request) {
    try {

        var passwordHash = require('password-hash');
        const res = await request.json();

        await dbConnect();

        let fqe = res.fqe;
        let password = res.password;
        let service = res.service;

        const user = await findOneCASEDocument(User, { fqe: fqe });

        if (!user) {
            return NextResponse.json({ message: "User does not exist or password is incorrect" }, { status: 400 });
        }

        if (!passwordHash.verify(password, user.password)) {
            return NextResponse.json({ message: "User does not exist or password is incorrect" }, { status: 400 });
        }

        const decryptedPrivateKey = decrypt(user.private_key, password);

        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
        // @ts-ignore: Works fine with it
        const token = jwt.sign({ fqe: user.fqe, username: user.username, user_id: user.user_id, private_key: decryptedPrivateKey }, JWT_SECRET_KEY, { expiresIn: '1h' });

        if (service === "Mail" && user.active) {
            const tempToken = generateToken();
            const newTempToken = new TempToken({
                user_id: user.user_id,
                fqe: user.fqe,
                token: tempToken,
                service: service,
            });
            await newTempToken.save();

            return NextResponse.json({ redirect: true, redirectUrl: 'https://mail.solun.pm/api/user/login?token='+ tempToken, service: service }, { status: 200 });
        } else if (user.active) {
            return NextResponse.json({ redirect: false, token: token, message: "Logged in successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ redirect: false, message: "User is not active" }, { status: 400 });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}