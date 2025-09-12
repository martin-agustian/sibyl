import { QuoteStatus } from "@prisma/client";
import { CaseStatus, MuiColor } from "./type";
import { CaseStatusEnum, QuoteStatusEnum } from "./enum";

export const LAW_CATEGORIES: { label: string; value: string }[] = [
	{ label: "Criminal Law", value: "criminal-law" },
	{ label: "Civil Law", value: "civil-law" },
	{ label: "Administrative Law", value: "administrative-law" },
	{ label: "Constitutional Law", value: "constitutional-law" },
	{ label: "Family Law", value: "family-law" },
	{ label: "Corporate / Commercial Law", value: "corporate-commercial-law" },
	{ label: "International Law", value: "international-law" },
	{ label: "Environmental Law", value: "environmental-law" },
	{ label: "Immigration Law", value: "immigration-law" },
	{ label: "Labor and Employment Law", value: "labor-employment-law" },
];

export const CASE_COLOR_STATUS: { value: CaseStatus; color: MuiColor }[] = [
	{
		value: CaseStatusEnum.OPEN,
		color: "success",
	},
	{
		value: CaseStatusEnum.ENGAGED,
		color: "info",
	},
	{
		value: CaseStatusEnum.CLOSED,
		color: "default",
	},
	{
		value: CaseStatusEnum.CANCELLED,
		color: "error",
	},
];

export const QUOTE_COLOR_STATUS: { value: QuoteStatus; color: MuiColor }[] = [
	{
		value: QuoteStatusEnum.PROPOSED,
		color: "info",
	},
	{
		value: QuoteStatusEnum.ACCEPTED,
		color: "success",
	},
	{
		value: QuoteStatusEnum.REJECTED,
		color: "error",
	},
];
