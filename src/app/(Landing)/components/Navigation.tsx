"use client";
import React from "react";

import { Button, Stack } from "@mui/material";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Logo from "@/components/Logo";
import Link from "next/link";

const Navigation = () => {

	return (
		<Box sx={{ backgroundColor: "background.paper" }}>
			<Container sx={{ py: { xs: 2, md: 3 } }}>
				<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<Logo />

          <Stack direction="row" gap={1}>
            <Button component={Link} href="/login" variant="outlined" sx={{ width: { xs: 80, md: 100 }, fontWeight: "bold" }}>
              Login
            </Button>
            <Button component={Link} href="/register" variant="contained" sx={{ width: { xs: 80, md: 100 }, fontWeight: "bold" }}>
              Register
            </Button>
          </Stack>
				</Box>
			</Container>
		</Box>
	);
};

export default Navigation;
