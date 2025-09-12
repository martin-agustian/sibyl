import { useState } from "react";
import { Box, BoxProps, Button, SxProps } from "@mui/material";

type ReadMoreTextProps = BoxProps & {
	text: string;
	maxChars?: number;
  sxButton?: SxProps;
  onClickReadmore?: () => void;
}

const ReadMoreText = ({ text, maxChars = 100, sxButton, onClickReadmore, ...rest }: ReadMoreTextProps) => {
	const [expanded, setExpanded] = useState(false);
	const isLongText = text.length > maxChars;

	const toggleExpanded = () => {
    onClickReadmore ? 
      onClickReadmore() : 
      setExpanded((prev) => !prev);
  };

	if (!isLongText) {
		return <Box {...rest} component="span">{text}</Box>;
	}

	return (
		<Box {...rest} component="span">
			{expanded ? text : `${text.slice(0, maxChars)}... `}
			<Button 
        variant="text" size="small" 
        onClick={(e) => { e.stopPropagation(); toggleExpanded() }} 
        sx={{ minWidth: "unset", p: 0, ...sxButton }}
      >
				{expanded ? "Read less" : "Read more"}
			</Button>
		</Box>
	);
};

export default ReadMoreText;
