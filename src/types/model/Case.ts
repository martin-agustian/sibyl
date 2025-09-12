import { FileModel } from "./File";
import { CaseStatus } from "@/commons/type";

export type CaseModel = {
	id: string;
	title: string;
	category: string;
	description: string;
	status: CaseStatus;
	clientId: string;
	lawyerId: string;
	_count: { quotes: number };
	createdAt: Date;
	updatedAt: Date;
	files: FileModel[];
};