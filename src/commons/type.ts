import { CaseStatusEnum, QuoteStatusEnum, UserRoleEnum } from "./enum";

export type UserRole = UserRoleEnum.CLIENT | UserRoleEnum.LAWYER;

export type CaseStatus =
  | CaseStatusEnum.OPEN
  | CaseStatusEnum.ENGAGED
  | CaseStatusEnum.CLOSED
  | CaseStatusEnum.CANCELLED;

export type QuoteStatus = QuoteStatusEnum.ACCEPTED | QuoteStatusEnum.REJECTED | QuoteStatusEnum.PROPOSED;

export type MuiColor = "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
