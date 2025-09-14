"use client";
import Swal from "sweetalert2";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Grid, Box, Card } from "@mui/material";

import Link from "next/link";
import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import Logo from "@/components/Logo";
import EmailOTP from "./components/EmailOTP";
import Subtitle from "../components/Subtitle";

import { forgotSchema, ForgotSchema } from "@/schemas/auth/forgotSchema";
import { forgotVerifySchema, ForgotVerifySchema } from "@/schemas/auth/forgotVerifySchema";
import { ForgotBody } from "@/types/request/Auth";

const Forgot = () => {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("error") || "";

  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const {
    register: registerForgot,
    handleSubmit: onSubmitForgot,
    formState: { errors: forgotErrors },
  } = useForm<ForgotSchema>({
    resolver: zodResolver(forgotSchema),
    mode: "onChange",
  });

  const {
    register: registerForgotVerify,
    handleSubmit: onSubmitForgotVerify,
    formState: { errors: forgotVerifyErrors },
  } = useForm<ForgotVerifySchema>({
    resolver: zodResolver(forgotVerifySchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (errorMessage) {
      Swal.fire({
        title: "Error!",
        html: errorMessage,
        icon: "error",
      });
    }
  }, [errorMessage])

  const handleSubmitForgot = async (data: ForgotSchema) => {
    try {
      setLoadingSubmit(true);

      const body: ForgotBody = {
        email: data.email,
      };
  
      const response = await fetch(`/api/auth/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const responseData = await response.json();

      if (response?.ok) {
        await Swal.fire({
          timer: 3000,
          title: "Success!",
          text: "Success send otp, check your email",
          icon: "success",
          showConfirmButton: false,
        });
  
      } else {
        throw new Error(responseData?.error ?? "");
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
  }

  // const handleSubmit = async (data: ForgotVerifySchema) => {
  //   try {
  //     setLoadingSubmit(true);
  
  //     const response = await signIn("credentials", {
  //       email: data.email,
  //       password: data.password,
  //       redirect: false,
  //     });
  
  //     if (response?.ok) {
  //       await Swal.fire({
  //         timer: 3000,
  //         title: "Success!",
  //         text: "Success login",
  //         icon: "success",
  //         showConfirmButton: false,
  //       });
                
  //       window.location.href = callbackUrl;
  //     } else {
  //       throw new Error(response?.error ?? "");
  //     }
  
  //     setLoadingSubmit(false);
  //   } 
  //   catch (error) {
  //     setLoadingSubmit(false);

  //     await Swal.fire({
  //       timer: 3000,
  //       title: "Error!",
  //       text: error instanceof Error ? error.message : (error as string),
  //       icon: "error",
  //       showConfirmButton: false,
  //     });
  //   }
  // };

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

              <EmailOTP
                subtitle={<Subtitle text="Remember the password ?" linkText="Sign In" link="/login" />}
                register={registerForgot}
								errors={forgotErrors}
								loadingSubmit={loadingSubmit}
								handleSubmit={handleSubmitForgot}
								onSubmit={onSubmitForgot}
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};
export default Forgot;