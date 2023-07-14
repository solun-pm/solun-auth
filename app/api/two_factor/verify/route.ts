import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    const data = req.body;
    const response = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/two_factor/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": process.env.SOLUN_API_KEY || "",
        },
        body: JSON.stringify(data),
      });

    return NextResponse.json(response);
}