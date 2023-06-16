import dbConnect from "@/utils/dbConn";
import { findOneDocument } from "@/utils/dbUtils";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { generateKey } from 'openpgp';
import { encrypt } from "@/utils/encryption";
import { hashPassword } from "@/utils/hash";
const { MailcowApiClient } = require("@/utils/mail");

export async function POST(request: Request) {
    try {
        function generateUID() {
            var uid = Math.floor(Math.random() * 1000000000);
            return uid;
        }

        const res = await request.json();

        await dbConnect();
        const mcc = new MailcowApiClient(process.env.MAILSERVER_BASEURL, process.env.MAILSERVER_API_KEY);

        let username = res.username;
        let domain = res.domain;
        let fqe = `${username}${domain}`;
        let password = res.password;
        let confirmPassword = res.confirmPassword;

        if (!username || !domain || !password || !confirmPassword) {
            return NextResponse.json({ message: "Please fill in all fields" }, { status: 400 });
        }

        if (username.length < 3 || username.length > 30) {
            return NextResponse.json({ message: "Username must be between 3 and 30 characters" }, { status: 400 });
        }

        const trimmedUsername = username.trim();

        const hasValidCharacters = /^[A-Za-z][A-Za-z0-9._-]*[A-Za-z0-9]$/.test(trimmedUsername);

        if (!hasValidCharacters) {
        return NextResponse.json({ message: "Username must contain at least 3 alphabetical characters and can only include A-Z, numbers, dot, underscore, and hyphen. It cannot start or end with dot, underscore, or hyphen.", exists: true }, { status: 400 });
        }

        const forbiddenUsernames = ["admin", "administrator", "root", "sysadmin", "system", "superuser", "support", "webmaster", "postmaster", "hostmaster", "ssladmin", "ssladministrator", "sslwebmaster", "sslpostmaster", "sslhostmaster", "ssl", "ftp", "mail", "www", "http", "https", "web", "cloud", "cloudflare", "cpanel", "directadmin", "plesk", "whm", "webmin", "user", "username", "test", "testing", "example", "demo", "domain", "website", "host", "hosting", "server", "vps", "dedicated", "dedi", "dedibox", "dedis",
                                    "abuse", "security", "support", "contact", "info", "inquiries", "sales", "marketing", "legal", "webmaster", "noc", "no-reply", "noreply", "privacy", "terms", "tos", "webteam", "webmaster", "payment", "info", "moderation", "newsletter", "message", "contact", "contactus", "contact-us", "contact_me", "contact-me", "contactus", "contact-us"];

        if (forbiddenUsernames.includes(trimmedUsername)) {
        return NextResponse.json({ message: "Username is not allowed", exists: true }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
        }

        if (password.length < 6 || !password.match(/[^a-zA-Z0-9]/)) {
            return NextResponse.json({ message: "Password must be at least 6 characters long and contain at least 1 special character" }, { status: 400 });
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

        // Create user in mailserver
        const createMail = await mcc.addMailbox({
            active: 1,
            password: password,
            password2: password,
            quota: 1024,
            domain: domain.replace("@", ""),
            name: username,
            local_part: username,
        })

        if (!createMail) {
            return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
        }

        // Set rate limit for user
        const updateRateLimit = await mcc.rateLimitMailbox({
            attr: {
                rl_value: "100",
                rl_frame: "d",
              },
              items: [
                fqe,
              ],
            });

        if (!updateRateLimit) {
            return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
        }

        // Create user in database
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