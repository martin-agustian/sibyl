import React, { ReactNode } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { Card } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";

type Data = {
	title: string;
	description: string;
	icon?: ReactNode;
};

export const data: Data[] = [
	{
		title: "Feature 1",
		description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
		icon: <AutoAwesome />,
	},
	{
		title: "Feature 2",
		description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
		icon: <AutoAwesome />,
	},
	{
		title: "Feature 3",
		description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
		icon: <AutoAwesome />,
	},
	{
		title: "Feature 4",
		description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
		icon: <AutoAwesome />,
	},
];

const Feature = () => {
	return (
		<Box id="feature" sx={{ py: { xs: 10, md: 14 }, backgroundColor: "background.paper" }}>
			<Container>
				<Grid container spacing={3}>
					<Grid size={{ xs: 12 }}>
						<Typography
							component="h2"
							sx={{
								position: "relative",
								fontSize: { xs: 40, md: 50 },
								fontWeight: "bold",
								lineHeight: { xs: 1.2 },
								mb: 3,
							}}>
							With our new feature we{" "}
							<Typography
								component="mark"
								sx={{
									position: "relative",
									color: "primary.main",
									fontSize: "inherit",
									fontWeight: "inherit",
									backgroundColor: "unset",
								}}>
								guarantee <br />
							</Typography>
							you find {" "}
							<Typography
								component="mark"
								sx={{
									position: "relative",
									color: "primary.main",
									fontSize: "inherit",
									fontWeight: "inherit",
									backgroundColor: "unset",
								}}>
								the best lawyer
							</Typography>
						</Typography>

						<Typography sx={{ color: "text.secondary", mb: 4 }}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem, aliquam omnis! Neque esse, rem ad vero eligendi minima dolores expedita quod hic sunt. Quisquam tempora repudiandae cumque fugit. Eligendi, repellendus!</Typography>

						<Grid container spacing={{ xs: 2, md: 3 }}>
							{data.map(({ title, description, icon }, index) => (
								<Grid key={String(index)} size={{ xs: 12, md: 6 }}>
									<Card elevation={9} sx={{ display: "flex", alignItems: "center", borderRadius: 4, px: 2, py: 1.5 }}>
										<Box
											sx={{
												mr: 1,
												backgroundColor: "primary.main",
												borderRadius: "50%",
												height: 36,
												width: 36,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												color: "primary.contrastText",
												"& svg": {
													fontSize: 20,
												},
											}}>
											{icon}
										</Box>
										<Box sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
											<Typography variant="h6" sx={{ fontSize: "1rem", mb: 1, color: "secondary.main" }}>
												{title}
											</Typography>
											<Typography sx={{ lineHeight: 1.3, color: "text.secondary" }} variant="subtitle1">
												{description}
											</Typography>
										</Box>
									</Card>
								</Grid>
							))}
						</Grid>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default Feature;
