import { ReactNode } from "react";

import { Box, Typography, Button, Stack } from "@mui/material";

import Link from "next/link";
import InputText from "@/components/form/InputText";

import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { LoginSchema } from "@/schemas/auth/loginSchema";
import InputSelect from "@/components/form/InputSelect";

interface loginType {
  title?: string;
  subtitle?: ReactNode;
  subtext?: ReactNode;
  register: UseFormRegister<LoginSchema>;
  errors?: FieldErrors<LoginSchema>;
  loadingSubmit: boolean;
  onSubmit: UseFormHandleSubmit<LoginSchema>;
  handleSubmit: (data: LoginSchema) => Promise<void>;  
}

const AuthRegister = ({ title, subtitle, subtext, register, errors, loadingSubmit, handleSubmit, onSubmit }: loginType) => (
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
            htmlFor="name"
            component="label"
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              marginBottom: "5px",
            }}
          >
            Name
          </Typography>
          
          <InputText id="name" fullWidth variant="outlined" size="small" placeholder="Enter Name" {...register("email")} />
          
          {errors?.email?.message && (
            <Typography variant="caption" color="error" sx={{ marginTop: "5px" }}>
              {errors.email.message}
            </Typography>
          )}
        </Box>
        <Box sx={{ marginTop: "15px" }}>
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
          
          <InputText id="email" fullWidth variant="outlined" size="small" placeholder="Enter Email" {...register("email")} />
          
          {errors?.email?.message && (
            <Typography variant="caption" color="error" sx={{ marginTop: "5px" }}>
              {errors.email.message}
            </Typography>
          )}
        </Box>
        <Box sx={{ marginTop: "15px" }}>
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
          
          <InputText
            id="password" 
            fullWidth 
            type="password" 
            variant="outlined" 
            size="small"
            placeholder="Enter Password"
            {...register("password")} 
          />

          {errors?.password?.message && (
            <Typography variant="caption" color="error" sx={{ marginTop: "5px" }}>
              {errors.password.message}
            </Typography>
          )}
        </Box>
        <Box sx={{ marginTop: "15px" }}>
          <Typography
            htmlFor="password"
            component="label"
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              marginBottom: "5px",
            }}
          >
            Account Type
          </Typography>
          
          {/* <InputSelect id="category" placeholder="Select Category" items={lawCategoryOptions} defaultValue={""} {...registerFilter("category")} /> */}

          {errors?.password?.message && (
            <Typography variant="caption" color="error" sx={{ marginTop: "5px" }}>
              {errors.password.message}
            </Typography>
          )}
        </Box>
        <Box sx={{ marginTop: "15px" }}>
          <Typography
            htmlFor="jurisdiction"
            component="label"
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              marginBottom: "5px",
            }}
          >
            Jurisdiction
          </Typography>
          
          <InputText id="jurisdiction" fullWidth variant="outlined" size="small" placeholder="Enter Jurisdiction" {...register("email")} />
          
          {errors?.email?.message && (
            <Typography variant="caption" color="error" sx={{ marginTop: "5px" }}>
              {errors.email.message}
            </Typography>
          )}
        </Box>
        <Box sx={{ marginTop: "15px" }}>
          <Typography
            htmlFor="bar-number"
            component="label"
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              marginBottom: "5px",
            }}
          >
            Bar Number
          </Typography>
          
          <InputText id="bar-number" fullWidth variant="outlined" size="small" placeholder="Enter Bar Number" {...register("email")} />
          
          {errors?.email?.message && (
            <Typography variant="caption" color="error" sx={{ marginTop: "5px" }}>
              {errors.email.message}
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
          Sign Up
        </Button>
      </Box>
    </form>
    {subtitle}
  </>
);

export default AuthRegister;
