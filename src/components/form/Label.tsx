import { ComponentProps, ReactNode } from "react";
import { Typography, TypographyTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type TypographyComponent = OverridableComponent<TypographyTypeMap<{}, "label">>;
type TypographyProps = ComponentProps<TypographyComponent>;

type LabelProps = TypographyProps & {
  children: ReactNode;
};

const Label = ({ children, sx, ...rest }: LabelProps) => {
  return (
    <Typography 
      component="label"
      variant="subtitle1"
      sx={{ fontWeight: 600, marginBottom: 5, ...sx }}
      {...rest}
    >
      {children} 
    </Typography>
  )
}

export default Label;