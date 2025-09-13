import { UserRole } from "@/commons/type";

export type RegisterBody = {
	name: string;
	email: string;
	password: string;
	role: UserRole;
	jurisdiction?: string;
	barNumber?: string;
};
