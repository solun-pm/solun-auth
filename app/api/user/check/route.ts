import dbConnect from "@/utils/dbConn";
import { findOneCASEDocument } from "@/utils/dbUtils";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const res = await request.json();

    await dbConnect();

    let username = res.username;
    let domain = res.domain;

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

    let fqe = `${trimmedUsername}${domain}`;

    const user = await findOneCASEDocument(User, { fqe: fqe });

    if (user) {
      return NextResponse.json({ message: "User already exists", exists: true }, { status: 200 });
    }

    return NextResponse.json({ message: "User does not exist", exists: false }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}