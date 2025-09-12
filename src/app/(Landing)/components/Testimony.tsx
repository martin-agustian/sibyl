import React from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const Testimony = () => {
	return (
		<Box id="testimonial" sx={{ py: { xs: 5, md: 8 } }}>
			<Container>
				<Grid container spacing={5}>
					<Grid size={{ xs: 12, md: 4 }}>
						<Box sx={{ width: { xs: "100%", md: "90%" } }}>
							<Image src="/images/profile/user-1.jpg" width={320} height={340} quality={97} alt="ceo img" style={{ borderRadius: "10px" }} />
						</Box>
					</Grid>
					<Grid size={{ xs: 12, md: 8 }}>
						<Typography
							component="h2"
							sx={{
								position: "relative",
								fontSize: { xs: 36, md: 46 },
								mt: { xs: 0, md: 7 },
								mb: 4,
								lineHeight: 1.2,
								fontWeight: "bold",
							}}>
							What our{" "}
							<Typography
								component="mark"
								sx={{
									position: "relative",
									color: "primary.main",
									fontSize: "inherit",
									fontWeight: "inherit",
									backgroundColor: "unset",
								}}>
								Top Client{" "}
							</Typography>
							Say
						</Typography>

             <Typography variant="h5" sx={{ fontStyle: 'italic', borderLeft: '4px solid #ccc', paddingLeft: 2 }}>
              “Sibyl is a the best app, build with love and passion, treat us as family and open about critism, they also have best team”              
            </Typography>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default Testimony;
