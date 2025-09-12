import { MenuItem, Select, SelectProps, Typography, useTheme } from "@mui/material";
import { Control, Controller } from "react-hook-form";

type InputSelectProps = SelectProps & {
	name: string;
	placeholder: string;
	control?: Control;
	items: { label: string; value: string }[];
};

const InputSelect = ({ name, control, placeholder, items = [], ...rest }: InputSelectProps) => {
	const theme = useTheme();

	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<Select
					{...field}
					fullWidth
					size="small"
					displayEmpty
					renderValue={(selected: any) => {
						if (!selected) {
							return (
								<Typography sx={{ fontSize: "0.875rem", color: theme.palette.text.disabled }}>
									{placeholder}
								</Typography>
							);
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
			)}
		/>
	);
};

export default InputSelect;
