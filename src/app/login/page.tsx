"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";

import { loginSchema, LoginSchema, LoginSchemaErrors } from "@/schemas/loginSchema";

import Link from "next/link";
import { Grid, Box, Card, Stack, Typography } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import AuthLogin from "./components/AuthLogin";

const Login = () => {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [loginData, setLoginData] = useState<LoginSchema>({
    email: "",
    password: ""
  });
  const [loginErrors, setLoginErrors] = useState<LoginSchemaErrors>();

	const handleSubmit = async () => {
    const validate = loginSchema.safeParse(loginData);

    if (validate.success) {      
      await signIn("credentials", {
      	email: loginData.email,
      	password: loginData.password,
      	redirect: false,
      	callbackUrl,
      });
    }
    else {
      const { fieldErrors } = z.flattenError(validate.error);
      setLoginErrors(fieldErrors);
    }
	};

	return (
		<PageContainer title="Login" description="this is Login page">
			<Box
				sx={{
					position: "relative",
					"&:before": {
						content: '""',
						background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
						backgroundSize: "400% 400%",
						animation: "gradient 15s ease infinite",
						position: "absolute",
						height: "100%",
						width: "100%",
						opacity: "0.3",
					},
				}}>
				<Grid container spacing={0} justifyContent="center" sx={{ height: "100vh" }}>
					<Grid
						display="flex"
						justifyContent="center"
						alignItems="center"
						size={{
							xs: 12,
							sm: 12,
							lg: 4,
							xl: 3,
						}}>
						<Card elevation={9} sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}>
							<Box display="flex" alignItems="center" justifyContent="center">
								<Logo />
							</Box>
							<AuthLogin
								subtext={
									<Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={1}>
										Your Social Campaigns
									</Typography>
								}
								subtitle={
									<Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" mt={3}>
										<Typography color="textSecondary" variant="subtitle1" fontWeight="500">
											New to Sibyl ?
										</Typography>
										<Typography
											component={Link}
											href="/register"
											fontWeight="500"
                      variant="subtitle1"
											sx={{
												textDecoration: "none",
												color: "primary.main",
											}}>
											Create an account
										</Typography>
									</Stack>
								}
                errors={loginErrors}
                setData={setLoginData}
								onSubmit={handleSubmit}
							/>
						</Card>
					</Grid>
				</Grid>
			</Box>
		</PageContainer>
	);
};
export default Login;
