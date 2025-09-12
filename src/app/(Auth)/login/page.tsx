"use client";
import Swal from "sweetalert2";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/schemas/auth/loginSchema";
import { signIn, useSession } from "next-auth/react";

import { Grid, Box, Card, Stack, Typography } from "@mui/material";

import Link from "next/link";
import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import Logo from "@/components/Logo";
import AuthLogin from "./components/AuthLogin";

import { UserRole } from "@/commons/type";

const Login = () => {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";

	const { data: session } = useSession();
	const userRole = session?.user.role as UserRole;

	const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

	const {
		register: registerLogin,
		handleSubmit: onSubmitLogin,
		formState: { errors: loginErrors },
	} = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
	});

	const handleSubmit = async (data: LoginSchema) => {
		try {
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
				});
	
				window.location.href = 
					callbackUrl ?? userRole == "CLIENT" ? 
						"/client/dashboard" : "/lawyer/marketplace";
			} else {
				throw new Error(response?.error ?? "");
			}
	
			setLoadingSubmit(false);
		} 
		catch (error) {
			setLoadingSubmit(false);

			await Swal.fire({
				timer: 3000,
				title: "Error!",
				text: error instanceof Error ? error.message : (error as string),
				icon: "error",
				showConfirmButton: false,
			});
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
				<Grid container spacing={0} sx={{ height: "100vh", justifyContent: "center" }}>
					<Grid
						size={{ xs: 12, sm: 12, lg: 4, xl: 3 }}
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<Card elevation={9} sx={{ width: "100%", maxWidth: "500px", zIndex: 1, p: 4 }}>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									marginBottom: 2,
								}}>
								<Link href="/" style={{ textDecoration: "none" }}>
									<Logo />
								</Link>
							</Box>
							<AuthLogin								
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
								handleSubmit={handleSubmit}
								onSubmit={onSubmitLogin}
							/>
						</Card>
					</Grid>
				</Grid>
			</Box>
		</PageContainer>
	);
};
export default Login;
