import { TextField, TextFieldProps } from "@mui/material";

type InputTextProps = TextFieldProps & {};

const InputTextArea = ({ ...rest }: InputTextProps) => {
  return <TextField multiline minRows={8} maxRows={12} fullWidth variant="outlined" size="small" {...rest} />;
};

export default InputTextArea;