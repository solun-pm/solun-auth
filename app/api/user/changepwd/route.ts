import dbConnect from "@/utils/dbConn";
import { findOneDocument, updateOneDocument } from "@/utils/dbUtils";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { decrypt, encrypt } from "@/utils/encryption";
import { comparePassword, hashPassword } from "@/utils/hash";
const { MailcowApiClient } = require("@/utils/mail");

export async function POST(request: Request) {
  try {
    const res = await request.json();

    await dbConnect();
    const mcc = new MailcowApiClient(
      process.env.MAILSERVER_BASEURL,
      process.env.MAILSERVER_API_KEY
    );

    let user_id = res.user_id;
    let currentPassword = res.currentPassword;
    let newPassword = res.newPassword;

    if (currentPassword === "" || newPassword === "") {
      return NextResponse.json(
        { message: "Please fill out all fields" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6 || !newPassword.match(/[^a-zA-Z0-9]/)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 6 characters long and contain at least 1 special character",
        },
        { status: 400 }
      );
    }

    const user = await findOneDocument(User, { user_id: user_id });

    if (!user) {
      return NextResponse.json(
        { message: "User does not exist or password is incorrect" },
        { status: 400 }
      );
    }

    if (!(await comparePassword(currentPassword, user.password))) {
      return NextResponse.json(
        { message: "Password is incorrect" },
        { status: 400 }
      );
    }

    const decryptedPrivateKey = decrypt(user.private_key, currentPassword);
    const encryptedPrivateKey = encrypt(decryptedPrivateKey, newPassword);

    // Set rate limit for user
    const updateMailbox = await mcc.updateMailbox({
      attr: {
        force_pw_update: 0,
        password: newPassword,
        password2: newPassword,
      },
      items: [user.fqe],
    });

    if (!updateMailbox) {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }

    if (user.two_fa) {
      const decryptedTwoFASecret = decrypt(user.two_fa_secret, currentPassword);
      const encryptedTwoFASecret = encrypt(decryptedTwoFASecret, newPassword);

      await updateOneDocument(
        User,
        { user_id: user_id },
        { two_fa_secret: encryptedTwoFASecret }
      );
    }
    const hashedPassword = await hashPassword(newPassword);

    await updateOneDocument(
      User,
      { user_id: user_id },
      { password: hashedPassword, private_key: encryptedPrivateKey }
    );

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
