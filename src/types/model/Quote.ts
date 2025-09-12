import { CaseModel } from "./Case";

export type QuoteModel = {
	id: string;
	lawyerId: string;
	caseId: string;
	amount: number;
	expectedDays: number;
	note: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
	lawyer: UserModel;
	case: CaseModel;
};
