import { SxProps, Typography, TypographyProps } from "@mui/material";

type LogoProps = TypographyProps & {
  sxText?: SxProps;
};

const Logo = ({ sxText, ...rest }: LogoProps) => {
	return (
		<Typography
			variant="h1"
			sx={{
				position: "relative",
				color: "primary.main",
				fontSize: { xs: 30, md: 35 },
				fontWeight: "bold",
				"& svg": {
					position: "absolute",
					top: -8,
					right: { xs: -15, md: -11 },
					width: { xs: 15, md: 15 },
					height: "auto",
				},
        ...sxText
			}}
      {...rest}
    >
			Sibyl
			<svg version="1.1" viewBox="0 0 3183 3072">
				<g id="Layer_x0020_1">
					<path fill="#49BEFF" d="M2600 224c0,0 0,0 0,0 236,198 259,562 52,809 -254,303 -1849,2089 -2221,1776 -301,-190 917,-1964 1363,-2496 207,-247 570,-287 806,-89z" />
					<path fill="#49BEFF" d="M3166 2190c0,0 0,0 0,0 64,210 -58,443 -270,516 -260,90 -1848,585 -1948,252 -104,-230 1262,-860 1718,-1018 212,-73 437,39 500,250z" />
					<path fill="#49BEFF" d="M566 3c0,0 0,0 0,0 -219,-26 -427,134 -462,356 -44,271 -255,1921 90,1962 245,62 628,-1392 704,-1869 36,-221 -114,-424 -332,-449z" />
				</g>
			</svg>
		</Typography>
	);
};

export default Logo;
