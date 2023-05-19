import dbConnect from "@/utils/dbConn";
import { findOneDocument } from "@/utils/dbUtils";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const res = await request.json();

        await dbConnect();

        let username = res.username;
        let domain = res.domain;
        let fqe = `${username}${domain}`;

        const user = await findOneDocument(User, { fqe: fqe });

        if (user) {
            return NextResponse.json({ message: "User already exists", exists: true }, { status: 200 });
        }

        return NextResponse.json({ message: "User does not exist", exists: false }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}