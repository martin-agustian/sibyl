import { Control, Controller } from "react-hook-form";

import { TextFieldProps } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

type InputTextProps = TextFieldProps & {
	control?: Control<any>;
	name: string;
};

const InputDate = ({ control, name, ...rest }: InputTextProps) => {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<DatePicker
					{...field}
					onChange={(date) => field.onChange(date)}
					slotProps={{
						textField: {
							fullWidth: true,
							variant: "outlined",
							size: "small",
							...rest,
						},
					}}
				/>
			)}
		/>
	);
};

export default InputDate;
