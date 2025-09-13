import { UserRole } from "@/commons/type";

export type UserModel = {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	jurisdiction?: string;
	barNumber?: string;
	createdAt: Date;
};
