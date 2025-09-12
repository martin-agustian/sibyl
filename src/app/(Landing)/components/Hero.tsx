import { Box, Card, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";

const exps: Array<{ label: string, value: string}> = [
  {
    label: 'Case Completed',
    value: '10K+',
  },
  {
    label: 'Experience Lawyer',
    value: '20+',
  },
  {
    label: 'New Client',
    value: '100+',
  },
];

const ExpItem = ({ item } : { item: { label: string, value: string } }) => {
  const { value, label } = item;

  return (
    <Box sx={{ textAlign: 'center', mb: { xs: 1, md: 0 } }}>
      <Typography sx={{ color: 'secondary.main', mb: { xs: 1, md: 2 }, fontSize: { xs: 34, md: 44 }, fontWeight: 'bold' }}>
        {value}
      </Typography>
      <Typography color="text.secondary" variant="h5">
        {label}
      </Typography>
    </Box>
  )
};

const Hero = () => {
  return(
    <Box id="hero" sx={{ backgroundColor: 'background.paper', position: 'relative', py: { xs: 5, md: 8 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={0} sx={{ flexDirection: { xs: 'column', md: 'unset' } }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography
                  component="h1"
                  sx={{
                    position: 'relative',
                    fontSize: { xs: 40, md: 62 },
                    letterSpacing: 1.5,
                    fontWeight: 'bold',
                    lineHeight: 1.3,
                  }}
                >
                  <Typography
                    component="mark"
                    sx={{
                      position: 'relative',
                      color: 'primary.main',
                      fontSize: 'inherit',
                      fontWeight: 'inherit',
                      backgroundColor: 'unset',
                    }}
                  >
                    Sibyl{' '}
                  </Typography>
                  is the{' '}
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 'inherit',
                      fontWeight: 'inherit',
                      position: 'relative',
                      '& svg': {
                        position: 'absolute',
                        top: -16,
                        right: -21,
                        width: { xs: 22, md: 30 },
                        height: 'auto',
                      },
                    }}
                  >
                    biggest 
                    <svg version="1.1" viewBox="0 0 3183 3072">
                      <g id="Layer_x0020_1">
                        <path
                          fill="#127C71"
                          d="M2600 224c0,0 0,0 0,0 236,198 259,562 52,809 -254,303 -1849,2089 -2221,1776 -301,-190 917,-1964 1363,-2496 207,-247 570,-287 806,-89z"
                        />
                        <path
                          fill="#127C71"
                          d="M3166 2190c0,0 0,0 0,0 64,210 -58,443 -270,516 -260,90 -1848,585 -1948,252 -104,-230 1262,-860 1718,-1018 212,-73 437,39 500,250z"
                        />
                        <path
                          fill="#127C71"
                          d="M566 3c0,0 0,0 0,0 -219,-26 -427,134 -462,356 -44,271 -255,1921 90,1962 245,62 628,-1392 704,-1869 36,-221 -114,-424 -332,-449z"
                        />
                      </g>
                    </svg>
                  </Typography>{' '}
                  legal marketplace
                </Typography>
              </Box>
              <Box sx={{ mb: 4, width: { xs: '100%', md: '70%' } }}>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  { "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id quidem sapiente impedit, inventore nemo, dolorum cumque nostrum perferendis quisquam minus autem laborum blanditiis! Distinctio doloribus rerum quas, saepe eos delectus." }                  
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }} sx={{ position: 'relative' }}>
            <Box sx={{ lineHeight: 0 }}>
              <Image src="/images/backgrounds/landing-bg.svg" width={575} height={587} alt="Hero img" style={{ maxWidth: "100%", height: "auto" }} />
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
}

export default Hero;

