import dbConnect from "@/utils/dbConn";
import { findOneCASEDocument } from "@/utils/dbUtils";
import User from "@/models/user";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { decrypt } from "@/utils/encryption";
import { generateToken } from "@/utils/generate";
import TempToken from "@/models/tempToken";
import { comparePassword } from "@/utils/hash";
import { totp } from 'otplib';
import { KeyEncodings } from 'otplib/core';
const base32Decode = require('base32-decode')


export async function POST(request: Request) {
    try {
        const res = await request.json();

        await dbConnect();

        let fqe = res.fqe;
        let twoFACode = res.twoFACode;
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

        const decryptedSecret = decrypt(user.two_fa_secret, password);

        if (decryptedSecret == '') {
            return NextResponse.json({ message: "User does not exist or password is incorrect" }, { status: 400 });
        }

        const hexSecret = Buffer.from(base32Decode(decryptedSecret, 'RFC4648')).toString('hex');
        totp.options = { encoding: KeyEncodings.HEX };
        const isValid = totp.verify({ token: twoFACode, secret: hexSecret });
      
        if (isValid) {

            const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
            // @ts-ignore: Works fine with it
            const token = jwt.sign({ fqe: user.fqe, username: user.username, user_id: user.user_id, private_key: decryptedPrivateKey }, JWT_SECRET_KEY, { expiresIn: '1h' });

            const two_fa = user.two_fa;

            if (service === "Mail" && user.active) {
                const tempToken = generateToken();
                const newTempToken = new TempToken({
                    user_id: user.user_id,
                    fqe: user.fqe,
                    token: tempToken,
                    service: service,
                });
                await newTempToken.save();

                return NextResponse.json({ redirect: true, redirectUrl: 'https://'+ process.env.NEXT_PUBLIC_WEBMAIL_DOMAIN +'/api/user/login?token='+ tempToken, service: service, two_fa: two_fa }, { status: 200 });
            } else if (user.active) {
                return NextResponse.json({ redirect: false, token: token, message: "Logged in successfully", two_fa: two_fa }, { status: 200 });
            } else {
                return NextResponse.json({ redirect: false, message: "User is not active" }, { status: 400 });
            }
        } else {
            return NextResponse.json({ message: "2FA code is incorrect" }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}