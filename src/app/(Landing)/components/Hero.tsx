import Logo from "@/components/Logo";
import { Box, Card, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";

const exps: Array<{ label: string; value: string }> = [
	{
		label: "Case Completed",
		value: "10K+",
	},
	{
		label: "Experience Lawyer",
		value: "20+",
	},
	{
		label: "New Client",
		value: "100+",
	},
];

const ExpItem = ({ item }: { item: { label: string; value: string } }) => {
	const { value, label } = item;

	return (
		<Box sx={{ textAlign: "center", mb: { xs: 1, md: 0 } }}>
			<Typography sx={{ color: "secondary.main", mb: { xs: 1, md: 2 }, fontSize: { xs: 34, md: 44 }, fontWeight: "bold" }}>{value}</Typography>
			<Typography color="text.secondary" variant="h5">
				{label}
			</Typography>
		</Box>
	);
};

const Hero = () => {
	return (
		<Box sx={{ backgroundColor: "background.paper", position: "relative", py: { xs: 5, md: 8 } }}>
			<Container maxWidth="lg">
				<Grid container spacing={0} sx={{ flexDirection: { xs: "column", md: "unset" } }}>
					<Grid size={{ xs: 12, md: 7 }}>
						<Box
							sx={{
								textAlign: { xs: "center", md: "left" },
								height: "100%",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
							}}>
							<Box sx={{ mb: 3 }}>
								<Typography
									component="h1"
									sx={{
										position: "relative",
										fontSize: { xs: 40, md: 62 },
										letterSpacing: 1.5,
										fontWeight: "bold",
										lineHeight: 1.3,
									}}>
                  <Logo
                    component="span"
                    sxText={{
                      fontSize: "inherit",
											fontWeight: "inherit",
                      "& svg": {
												position: "absolute",
												top: -16,
												right: -21,
												width: { xs: 22, md: 30 },
												height: "auto",
											},
                    }} 
                  />{" "}
									is the biggest legal marketplace
								</Typography>
							</Box>
							<Box sx={{ mb: 4, width: { xs: "100%", md: "70%" } }}>
								<Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>{"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id quidem sapiente impedit, inventore nemo, dolorum cumque nostrum perferendis quisquam minus autem laborum blanditiis! Distinctio doloribus rerum quas, saepe eos delectus."}</Typography>
							</Box>
						</Box>
					</Grid>
					<Grid size={{ xs: 12, md: 5 }} sx={{ position: "relative" }}>
						<Box sx={{ lineHeight: 0 }}>
							<Image src="/images/backgrounds/landing-bg.svg" width={575} height={587} alt="Hero img" style={{ maxWidth: "100%", height: "auto" }} priority />
						</Box>
					</Grid>
				</Grid>

				{/* Experience */}
				<Card elevation={9} sx={{ borderRadius: 4, py: 4, px: 7, marginTop: { xs: 5, md: 0 } }}>
					<Grid container spacing={{ xs: 5, md: 2 }}>
						{exps.map((item) => (
							<Grid key={item.value} size={{ xs: 12, md: 4 }}>
								<ExpItem item={item} />
							</Grid>
						))}
					</Grid>
				</Card>
			</Container>
		</Box>
	);
};

export default Hero;
