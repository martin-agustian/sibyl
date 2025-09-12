import { Chip, SxProps } from "@mui/material";
import { getCaseStatusColor, getQuoteStatusColor } from "@/commons/helper";
import { CaseStatus, QuoteStatus } from "@/commons/type";

type StatusChipProps = {
  caseStatus?: CaseStatus;
  quoteStatus?: QuoteStatus;
  sx?: SxProps;
};

const StatusChip = ({ caseStatus, quoteStatus, sx }: StatusChipProps) => {
	return (
    <Chip 
      label={caseStatus ? caseStatus : quoteStatus} 
      color={
        caseStatus ? getCaseStatusColor(caseStatus) :
        quoteStatus ? getQuoteStatusColor(quoteStatus) : "default"
      } 
      component="span" 
      size="small" 
      sx={{ 
        fontSize: "12px", 
        fontWeight: "bold",
        ...sx
      }} 
    />
  );
};

export default StatusChip;
