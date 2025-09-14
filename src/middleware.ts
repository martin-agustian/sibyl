import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { UserRoleEnum } from "./commons/enum";

export async function middleware(req: NextRequest) {
	const pathname = req.nextUrl.pathname;

	const token = await getToken({ req });

	if (!pathname.startsWith("/api")) {
		if (token) { // has token

			// -- admin dashboard
			if (pathname === "/dashboard" &&  token.role === UserRoleEnum.ADMIN) {
				return NextResponse.redirect(
					new URL(process.env.NEXT_PUBLIC_DASHBOARD_ADMIN_PATH ?? "/", req.url)
				);
			}
			// -- client dashboard
			if (pathname === "/dashboard" &&  token.role === UserRoleEnum.CLIENT) {
				return NextResponse.redirect(
					new URL(process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_PATH ?? "/", req.url)
				);
			}
			// -- lawyer dashboard
			if (pathname === "/dashboard" && token.role === UserRoleEnum.LAWYER) {
				return NextResponse.redirect(
					new URL(process.env.NEXT_PUBLIC_DASHBOARD_LAWYER_PATH ?? "/", req.url)
				);
			}

			// -- auth
			if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
				return NextResponse.redirect(new URL("/", req.url));
			}
			
			// -- admin sub path
			if (pathname.startsWith("/admin") && token.role !== UserRoleEnum.ADMIN) {
				return NextResponse.redirect(new URL("/unauthorized", req.url));
			}
			// -- client sub path
			if (pathname.startsWith("/client") && token.role !== UserRoleEnum.CLIENT) {
				return NextResponse.redirect(new URL("/unauthorized", req.url));
			}
			// -- lawyer sub path
			if (pathname.startsWith("/lawyer") && token.role !== UserRoleEnum.LAWYER) {
				return NextResponse.redirect(new URL("/unauthorized", req.url));
			}
		}
		else { // has no token
			if (
				!pathname.startsWith("/login") && 
				!pathname.startsWith("/register") && 
				!pathname.startsWith("/forgot") && 
				pathname !== "/"
			) {
				return NextResponse.redirect(new URL("/login", req.url));
			}
		}
	}

	return NextResponse.next();
}

 export const config = {
	matcher: [
		/*
			* Match all request paths except for the ones starting with:
			* - _next/static (static assets)
			* - _next/image (image optimization files)
			* - favicon.ico
			* - any files in the public folder (e.g., images, robots.txt)
			* - service worker
			* - well-known config
		*/
		'/((?!_next/static|_next/image|favicon.ico|public|images|firebase-messaging-sw.js|.well-known).*)',
	],
};
