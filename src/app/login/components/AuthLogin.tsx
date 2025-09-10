import { Dispatch, ReactNode, SetStateAction } from "react";

import Link from "next/link";
import { Box, Typography, Button, Stack } from "@mui/material";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";

import { LoginSchema, LoginSchemaErrors } from "@/schemas/loginSchema";

interface loginType {
  title?: string;
  subtitle?: ReactNode;
  subtext?: ReactNode;
  setData: Dispatch<SetStateAction<LoginSchema>>;
  onSubmit: () => Promise<void>;
  errors?: LoginSchemaErrors;
}

const AuthLogin = ({ title, subtitle, subtext, setData, onSubmit, errors }: loginType) => (
  <>
    {title ? (
      <Typography fontWeight="700" variant="h2" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}

    <Stack>
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="email"
          mb="5px"
        >
          Email
        </Typography>
        
        <CustomTextField 
          fullWidth variant="outlined" size="small" 
          onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))} 
        />
        
        {errors?.email && errors.email.length > 0 && (
          <Typography variant="caption" color="error" mt="5px">
            {errors.email[0]}
          </Typography>
        )}
      </Box>
      <Box mt="15px">
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="password"
          mb="5px"
        >
          Password
        </Typography>
        
        <CustomTextField 
          fullWidth type="password" variant="outlined" size="small" 
          onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))}  
        />

        {errors?.password && errors.password.length > 0 && (
          <Typography variant="caption" color="error" mt="5px">
            {errors.password[0]}
          </Typography>
        )}
      </Box>
      <Stack
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        my={2}
      >
        <Typography
          component={Link}
          href="/"
          fontWeight="500"
          sx={{
            textDecoration: "none",
            color: "primary.main",
          }}
        >
          Forgot Password ?
        </Typography>
      </Stack>
    </Stack>
    <Box>
      <Button
        fullWidth
        color="primary"
        variant="contained"
        size="medium"
        type="submit"      
        onClick={() => onSubmit()}
      >
        Sign In
      </Button>
    </Box>
    {subtitle}
  </>
);

export default AuthLogin;
