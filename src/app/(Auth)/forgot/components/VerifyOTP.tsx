import { ReactNode } from "react";

import { Box, Typography, Button, Stack } from "@mui/material";

import InputText from "@/components/form/InputText";

import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { ForgotVerifySchema } from "@/schemas/auth/forgotVerifySchema";

type VerifyOTPProps = {
  title?: string;
  subtitle?: ReactNode;
  subtext?: ReactNode;
  register: UseFormRegister<ForgotVerifySchema>;
  errors?: FieldErrors<ForgotVerifySchema>;
  loadingSubmit: boolean;
  onSubmit: UseFormHandleSubmit<ForgotVerifySchema>;
  handleSubmit: (data: ForgotVerifySchema) => Promise<void>;  
}

const VerifyOTP = ({ title, subtitle, subtext, register, errors, loadingSubmit, handleSubmit, onSubmit }: VerifyOTPProps) => (
  <>
    {title ? (
      <Typography fontWeight="700" variant="h2" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}

    <form onSubmit={onSubmit(handleSubmit)}>
      <Stack>
        <Box>
          <Typography
            htmlFor="code"
            component="label"
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              marginBottom: "5px",
            }}
          >
            OTP Code
          </Typography>
          
          <InputText id="code" fullWidth variant="outlined" size="small" placeholder="Enter OTP Code" {...register("code")} />
          
          {errors?.code?.message && (
            <Typography variant="caption" color="error" sx={{ marginTop: "5px" }}>
              {errors.code.message}
            </Typography>
          )}
        </Box>
        <Box sx={{ marginTop: "25px" }}>
          <Typography
            htmlFor="password"
            component="label"
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              marginBottom: "5px",
            }}
          >
            New Password
          </Typography>
          
          <InputText id="password" fullWidth type="password" variant="outlined" 
            size="small" placeholder="Enter Password" {...register("password")} />
          
          {errors?.password?.message && (
            <Typography variant="caption" color="error" sx={{ marginTop: "5px" }}>
              {errors.password.message}
            </Typography>
          )}
        </Box>
      </Stack>
      <Box sx={{ marginTop: "25px" }}>
        <Button
          fullWidth
          type="submit"
          color="primary"
          variant="contained"
          size="medium"
          loading={loadingSubmit}
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase"
          }}
        >
          Submit New Password
        </Button>
      </Box>
    </form>
    {subtitle}
  </>
);

export default VerifyOTP;