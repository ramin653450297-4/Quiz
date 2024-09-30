import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    //get data from client
    const { email, password } = await req.json();

    // create new record in database;
    // ...

    const bcrypt = require("bcrypt");
    const hashPassword = await bcrypt.hash(password, 10);
    //1234
    //lkjaslkdfiowwhjfksajflkjawpofjsadhfiuahsdjklfhuiahuifhsdfgsdfgegfdsgsdfgasdf

    return NextResponse.json({
      status: true,
      message: "success",
    });
  } catch (e) {
    console.error(e);

    return NextResponse.json({
      status: false,
      message: "login un-success",
    });
  }
}
