import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import z from "zod";
import { NextResponse } from "next/server";
import { registerSchema } from "@/schemas/auth/registerSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
  
    const { email, password, name, role, jurisdiction, barNumber } = body;
  
    const validate = registerSchema.safeParse(body);
    if (!validate.success) {
      return NextResponse.json({
        message: "validation failed", 
        response: z.flattenError(validate.error) 
      }, { status: 400 });
    }
  
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ 
        message: "Email already in use",
        response: null 
      }, { status: 400 });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = await prisma.user.create({
    	data: {
    		email,
    		passwordHash: hashedPassword,
    		name,
    		role,
    		jurisdiction: jurisdiction || null,
    		barNumber: barNumber || null,
    	},
    });
  
    return NextResponse.json({ 
      message: "User created", 
      response: user, 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      message: "Error",
      response: error,
    })
  }
}
