import { CaseModel } from "./Case";
import { QuoteStatus } from "@/commons/type";

export type QuoteModel = {
	id: string;
	lawyerId: string;
	caseId: string;
	amount: number;
	expectedDays: number;
	note: string;
	status: QuoteStatus;
	createdAt: Date;
	updatedAt: Date;
	lawyer: UserModel;
	case: CaseModel;
};
