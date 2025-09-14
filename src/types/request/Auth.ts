import { UserRole } from "@/commons/type";

export type RegisterBody = {
	name: string;
	email: string;
	password: string;
	role: UserRole;
	jurisdiction?: string;
	barNumber?: string;
};

export type ForgotBody = {
	email: string;
};

export type ForgotVerifyBody = {
	email: string;
	code: string;
	password: string;
};
