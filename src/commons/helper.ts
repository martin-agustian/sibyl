
import { CASE_COLOR_STATUS, LAW_CATEGORIES, QUOTE_COLOR_STATUS } from "./constant";
import { CaseStatus, QuoteStatus } from "./type";

export const formatNumber = (value: number | string): string => {
  const num = typeof value === "string" ? parseInt(value) : value;

  if (isNaN(num)) return "0";

  return num.toLocaleString("en-SG");
};

export const getCaseCategoryLabel = (value: string) => {
	return LAW_CATEGORIES.find((v) => v.value == value)?.label ?? "";
};

export const getCaseStatusColor = (value: CaseStatus) => {
	return CASE_COLOR_STATUS.find((v) => v.value === value)?.color ?? "default";
};

export const getQuoteStatusColor = (value: QuoteStatus) => {
	return QUOTE_COLOR_STATUS.find((v) => v.value === value)?.color ?? "default";
};
