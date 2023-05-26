import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const res = await request.json();

  const token = res.token;

  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

  if (token == null || token == undefined) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  return NextResponse.json(jwt.verify(token, JWT_SECRET_KEY as string), { status: 200 });
}
