"use client";
import Swal from "sweetalert2";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, LoginSchema } from "@/schemas/loginSchema";

import Link from "next/link";
import { Grid, Box, Card, Stack, Typography } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import AuthLogin from "./components/AuthLogin";

const Login = () => {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

	const {
		register: registerLogin,
		handleSubmit: handleSubmitLogin,
		formState: { errors: loginErrors },
	} = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
	});

	const handleSubmit = async (data: LoginSchema) => {
    setLoadingSubmit(true);

		const response = await signIn("credentials", {
			email: data.email,
			password: data.password,
			redirect: false,
		});

		if (response?.ok) {
			await Swal.fire({
				timer: 3000,
				title: "Success!",
				text: "Success login",
				icon: "success",
				showConfirmButton: false,
			})

      window.location.href = callbackUrl;
		} 
    else {
			await Swal.fire({
				timer: 3000,
				title: "Error!",
				text: response?.error ?? "",
				icon: "error",
				showConfirmButton: false,
			});
		}

    setLoadingSubmit(false);
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
				<Grid container spacing={0} sx={{ height: "100vh", justifyContent: "center" }}>
					<Grid 
            size={{ xs: 12, sm: 12, lg: 4, xl: 3 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
						<Card elevation={9} sx={{ width: "100%", maxWidth: "500px", zIndex: 1, p: 4 }}>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}>
								<Logo />
							</Box>
							<AuthLogin
								subtext={
									<Typography
										variant="subtitle1"
										color="textSecondary"
										sx={{
											textAlign: "center",
											marginBottom: 1,
										}}>
										Your Social Campaigns
									</Typography>
								}
								subtitle={
									<Stack
										sx={{
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "center",
											gap: 0.5,
											marginTop: 3,
										}}>
										<Typography variant="subtitle1" color="textSecondary" sx={{ fontWeight: 500 }}>
											New to Sibyl ?
										</Typography>
										<Typography
											href="/register"
											component={Link}
											variant="subtitle1"
											sx={{
												fontWeight: 500,
												textDecoration: "none",
												color: "primary.main",
											}}>
											Create an account
										</Typography>
									</Stack>
								}
								register={registerLogin}
								errors={loginErrors}
                loadingSubmit={loadingSubmit}
								handleSubmit={handleSubmitLogin}
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
