"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { Button, Stack } from "@mui/material";

import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Logo from "@/components/Logo";

import { UserRole } from "@/commons/type";
import { UserRoleEnum } from "@/commons/enum";

const Navigation = () => {
	const { data: session } = useSession();
	const userRole = session?.user.role as UserRole;

	const [dashboardHref, setDashboardHref] = useState<string>("/");

	useEffect(() => {
		if (session?.user) {
			const clientDashboard = process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_PATH ?? "/";
			const lawyerDashboard = process.env.NEXT_PUBLIC_DASHBOARD_LAWYER_PATH ?? "/";
			setDashboardHref(userRole === UserRoleEnum.CLIENT ? clientDashboard : lawyerDashboard);
		}
	}, [session]);

	return (
		<Box sx={{ backgroundColor: "background.paper" }}>
			<Container sx={{ py: { xs: 2, md: 3 } }}>
				<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<Logo />
					{session?.user ? (
						<Button 
							component={Link} href={dashboardHref} variant="outlined" 
							sx={{ width: { xs: 100, md: 120 }, fontWeight: "bold" }}
						>
              Dashboard
            </Button>
					) : (
						<Stack direction="row" gap={1}>
							<Button component={Link} href="/login" variant="outlined" sx={{ width: { xs: 80, md: 100 }, fontWeight: "bold" }}>
								Login
							</Button>
							<Button component={Link} href="/register" variant="contained" sx={{ width: { xs: 80, md: 100 }, fontWeight: "bold" }}>
								Register
							</Button>
						</Stack>
					)}
				</Box>
			</Container>
		</Box>
	);
};

export default Navigation;
