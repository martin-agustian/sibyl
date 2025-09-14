import bcrypt from "bcrypt";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { forgotSchema } from "@/schemas/auth/forgotSchema";

import { z } from "zod";
import { forgotVerifySchema } from "@/schemas/auth/forgotVerifySchema";

// Send OTP
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, type } = body;

    const validate = forgotSchema.safeParse(body);
    if (!validate.success) {
      return NextResponse.json({ message: "validation failed", response: z.flattenError(validate.error) }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // generate 6 digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.otp.create({
      data: { userId: user.id, code, type: type || "FORGOT_PASSWORD" },
    });

    await sendMail(user.email, "Your OTP Code", `<p>${code}</p>`);

    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Verify OTP
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { email, code, password } = body;

    const validate = forgotVerifySchema.safeParse(body);
    if (!validate.success) {
      return NextResponse.json({ message: "validation failed", response: z.flattenError(validate.error) }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const otp = await prisma.otp.findFirst({
      where: { userId: user.id, code, isUsed: false },
    });

    if (!otp) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // mark OTP as used
    await prisma.otp.update({
      where: { id: otp.id },
      data: { isUsed: true },
    });

    // hash password baru
    const hashedPassword = await bcrypt.hash(password, 10);

    // update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
