import dbConnect from "@/utils/dbConn";
import { findOneDocument } from "@/utils/dbUtils";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { generateKey } from 'openpgp';
import { encrypt } from "@/utils/encryption";
import { hashPassword } from "@/utils/hash";

export async function POST(request: Request) {
    try {
        function generateUID() {
            var uid = Math.floor(Math.random() * 1000000000);
            return uid;
        }

        const res = await request.json();

        await dbConnect();

        let username = res.username;
        let domain = res.domain;
        let fqe = `${username}${domain}`;
        let password = res.password;
        let confirmPassword = res.confirmPassword;

        if (password !== confirmPassword) {
            return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
        }

        const user = await findOneDocument(User, { fqe: fqe });

        if (user) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        let passwordHashed = await hashPassword(password);

        // Generate OpenPGP key pair
        const { privateKey, publicKey } = await generateKey({
            type: 'rsa',
            rsaBits: 4096,
            userIDs: [{ name: username, email: fqe }],
            //passphrase: password, idk if we need this
        });

        // Encrypt private key with password
        const encryptedPrivateKey = encrypt(privateKey, password);

        const newUser = new User({
            user_id: generateUID(),
            username: username,
            domain: domain,
            fqe: fqe,
            password: passwordHashed,
            private_key: encryptedPrivateKey,
            public_key: publicKey,
        });

        await newUser.save();

        return NextResponse.json({ message: "User created successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}