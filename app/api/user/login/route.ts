import dbConnect from "@/utils/dbConn";
import { findOneDocument } from "@/utils/dbUtils";
import User from "@/models/user";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    try {

        var passwordHash = require('password-hash');
        const res = await request.json();

        await dbConnect();

        let fqe = res.fqe;
        let password = res.password;
        let service = res.service;

        const user = await findOneDocument(User, { fqe: fqe });

        if (!user) {
            return NextResponse.json({ message: "User does not exist or password is incorrect" }, { status: 400 });
        }

        if (!passwordHash.verify(password, user.password)) {
            return NextResponse.json({ message: "User does not exist or password is incorrect" }, { status: 400 });
        }

        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
        // @ts-ignore: Works fine with it
        const token = jwt.sign({ fqe: user.fqe }, JWT_SECRET_KEY, { expiresIn: '1h' });

        if (service === "mail" && user.active) {
            // TODO: Add mail service auth handler, create temp token
        } else if (user.active) {
            return NextResponse.json({ token: token, message: "Logged in successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "User is not active" }, { status: 400 });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}