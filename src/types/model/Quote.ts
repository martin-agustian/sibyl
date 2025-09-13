import { QuoteStatus } from "@/commons/type";
import { CaseModel } from "./Case";
import { UserModel } from "./User";

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
