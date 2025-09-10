import { ReactNode } from "react";

import Link from "next/link";
import { Box, Typography, Button, Stack } from "@mui/material";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";

import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { LoginSchema } from "@/schemas/loginSchema";

interface loginType {
  title?: string;
  subtitle?: ReactNode;
  subtext?: ReactNode;
  register: UseFormRegister<LoginSchema>;
  errors?: FieldErrors<LoginSchema>;
  handleSubmit: UseFormHandleSubmit<LoginSchema>;
  onSubmit: (data: LoginSchema) => Promise<void>;
}

const AuthLogin = ({ title, subtitle, subtext, register, errors, handleSubmit, onSubmit }: loginType) => (
  <>
    {title ? (
      <Typography fontWeight="700" variant="h2" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}

    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Box>
          <Typography
            htmlFor="email"
            component="label"
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              marginBottom: "5px",
            }}
          >
            Email
          </Typography>
          
          <CustomTextField fullWidth variant="outlined" size="small" {...register("email")} />
          
          {errors?.email?.message && (
            <Typography variant="caption" color="error" sx={{ marginTop: "5px" }}>
              {errors.email.message}
            </Typography>
          )}
        </Box>
        <Box sx={{ marginTop: "15px" }}>
          <Stack
            sx={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >            
            <Typography
              htmlFor="password"
              component="label"
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                marginBottom: "5px",
              }}
            >
              Password
            </Typography>

            <Typography 
              href="/" 
              component={Link}
              sx={{
                color: "primary.main",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Forgot Password ?
            </Typography>
          </Stack>
          
          <CustomTextField fullWidth type="password" variant="outlined" size="small" {...register("password")} />

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
          color="primary"
          variant="contained"
          size="medium"
          type="submit"
        >
          Sign In
        </Button>
      </Box>
    </form>
    {subtitle}
  </>
);

export default AuthLogin;
