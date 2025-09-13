import { ChangeEvent } from "react";
import { Checkbox } from "@mui/material";
import { Control, Controller } from "react-hook-form";

interface InputCheckboxProps {
  control: Control<any>;
  name: string;
  value: string;
}

export default function InputCheckbox({ control, name, value, ...rest }: InputCheckboxProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const isChecked = Array.isArray(field.value)
          ? field.value.includes(value)
          : field.value === value;

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.checked) {
            // add value
            field.onChange([...(field.value || []), value]);
          } else {
            // remove value
            field.onChange(field.value.filter((v: string) => v !== value));
          }
        };

        return (
          <Checkbox
            value={value}
            checked={isChecked}
            onChange={handleChange}
            {...rest}
          />
        );
      }}
    />
  );
}
