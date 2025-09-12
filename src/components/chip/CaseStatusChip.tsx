import { Chip, SxProps } from "@mui/material";
import { getCaseStatusColor } from "@/commons/helper";
import { CaseStatus } from "@/commons/type";

type CaseStatusChipProps = {
  status: CaseStatus;
  sx?: SxProps;
};

const CaseStatusChip = ({ status, sx }: CaseStatusChipProps) => {
	return (
    <Chip 
      label={status} 
      color={getCaseStatusColor(status)} 
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

export default CaseStatusChip;
