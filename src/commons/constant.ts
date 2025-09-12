import { CaseStatus, MuiColor } from "./type";

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
		value: "OPEN",
		color: "success",
	},
	{
		value: "ENGAGED",
		color: "info",
	},
	{
		value: "CLOSED",
		color: "default",
	},
	{
		value: "CANCELLED",
		color: "error",
	},
];
