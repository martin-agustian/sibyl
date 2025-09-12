import { FileModel } from "./File";

export type CaseModel = {
	id: string;
	title: string;
	category: string;
	description: string;
	status: string;
	clientId: string;
	lawyerId: string;
	createdAt: Date;
	updatedAt: Date;
	files: FileModel[];
};