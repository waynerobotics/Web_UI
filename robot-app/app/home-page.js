"use client";

import { Box, Grid, Container, Typography } from "@mui/material";
import MainLayout from ".././components/layout/MainLayout";
import RosConnection from ".././components/ros/ConnectionStatus";
import Card from ".././components/ui/Card";

export default function Home() {
  return (
    <MainLayout>
      {/* RosConnection - floating in top right corner */}
      <Box
        sx={{
          position: "fixed",
          top: "70px",
          right: "8px",
          zIndex: 100,
          backgroundColor: "background.paper",
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <RosConnection />
      </Box>

      <Container maxWidth={false} sx={{ mt: 0, mb: 4 }}>
        {" "}
        {/* Row 1: Dashboard Card - Full Width */}
        <Grid
          container
          spacing={2}
          sx={{
            mb: 2,
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Grid item xs={12}>
            <Box sx={{ height: "20em", width: "100em" }}>
              <Card title="Robot Data Dashboard" titleVariant="h5">
                <Typography variant="body1">
                  Dashboard Content Placeholder
                </Typography>
              </Card>
            </Box>
          </Grid>
        </Grid>{" "}
        {/* Row 2: Four equal-sized cards */}
        <Grid
          container
          spacing={2}
          sx={{
            mb: 2,
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ height: "20em", width: "20em" }}>
              <Card title="Battery">
                <Typography variant="body1">
                  Battery Content Placeholder
                </Typography>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ height: "20em", width: "20em" }}>
              <Card title="Heading">
                <Typography variant="body1">
                  Heading Content Placeholder
                </Typography>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ height: "20em", width: "20em" }}>
              <Card title="Velocity">
                <Typography variant="body1">
                  Velocity Content Placeholder
                </Typography>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ height: "20em", width: "20em" }}>
              <Card title="Next Waypoint">
                <Typography variant="body1">
                  Next Waypoint Content Placeholder
                </Typography>
              </Card>
            </Box>
          </Grid>
        </Grid>{" "}
        {/* Row 3: Three visualization cards */}
        <Grid
          container
          spacing={2}
          sx={{
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Grid item xs={12} md={4}>
            <Box sx={{ height: "35em", width: "30em" }}>
              <Card title="Robot Visualization">
                <Typography variant="body1">
                  Robot Visualization Placeholder
                </Typography>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ height: "35em", width: "30em" }}>
              <Card title="LIDAR Point Cloud">
                <Typography variant="body1">
                  LIDAR Point Cloud Placeholder
                </Typography>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ height: "35em", width: "30em" }}>
              <Card title="Cost Map">
                <Typography variant="body1">Cost Map Placeholder</Typography>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}
