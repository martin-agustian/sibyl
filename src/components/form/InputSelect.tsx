import { MenuItem, Select, SelectProps, TextField, Typography, useTheme } from "@mui/material";

type InputSelectProps = SelectProps & {
	items: { label: string; value: string }[];
	placeholder: string;
};

const InputSelect = ({ defaultValue = "", placeholder, items = [], ...rest }: InputSelectProps) => {
	const theme = useTheme();

	return (
		<Select
			fullWidth
			size="small"
			defaultValue={defaultValue}
			displayEmpty
			renderValue={(selected: any) => {
				if (!selected) {
					return <Typography color={theme.palette.text.disabled}>{placeholder}</Typography>;
				}
				return items.find((item) => item.value == selected)?.label;
			}}
			{...rest}>
			{items &&
				items.map((item, i) => {
					return (
						<MenuItem key={i} value={item.value}>
							{item.label}
						</MenuItem>
					);
				})}
		</Select>
	);
};

export default InputSelect;
