import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";
import TempToken from "@/models/tempToken";

export async function POST(request: Request) {
  try {
    const res = await request.json();

    await dbConnect();

    let user_id = res.user_id;
    let fqe = res.fqe;
    let service = res.service;
    let tempToken = res.token;
    let password = res.password;
    let fast_login = res.fast_login;

    const newTempToken = new TempToken({
      user_id: user_id,
      fqe: fqe,
      token: tempToken,
      service: service,
      password: password,
      fast_login: fast_login,
    });
    await newTempToken.save();

    return NextResponse.json({ message: "TempToken saved" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
