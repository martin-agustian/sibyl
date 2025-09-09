import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
	const token = await getToken({ req });

	if (!token) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	const pathname = req.nextUrl.pathname;

	if (pathname.startsWith("/client") && token.role !== "CLIENT") {
		return NextResponse.redirect(new URL("/unauthorized", req.url));
	}

	if (pathname.startsWith("/lawyer") && token.role !== "LAWYER") {
		return NextResponse.redirect(new URL("/unauthorized", req.url));
	}

	return NextResponse.next();
}
