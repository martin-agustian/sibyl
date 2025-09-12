
import { CASE_COLOR_STATUS, LAW_CATEGORIES } from "./constant";
import { CaseStatus } from "./type";

export const getCaseCategoryLabel = (value: string) => {
	return LAW_CATEGORIES.find((v) => v.value == value)?.label ?? "";
};

export const getCaseStatusColor = (value: CaseStatus) => {
	return CASE_COLOR_STATUS.find((v) => v.value === value)?.color ?? "default";
};
