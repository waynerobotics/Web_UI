"use client";

import { Box, Grid, Container, Typography } from "@mui/material";
import MainLayout from "./components/layout/MainLayout";
import RobotViewer from "./components/robot/RobotViewer";
import LidarPointCloud from "./components/lidar/LidarPointCloud";
import RosConnection from "./components/ros/ConnectionStatus";
import DataDashboard from "./components/dashboard/DataDashboard";
import BatteryIndicator from "./components/ui/BatteryGauge";
import Compass from "./components/ui/Compass";
import Speedometer from "./components/ui/Speedometer";
import WaypointPanel from "./components/ui/WaypointPanel";
import CostmapViewer from "./components/costmap/CostmapViewer";
import Card from "./components/ui/Card";

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
            {" "}
            <Box sx={{ height: "18em", width: "100em" }}>
              <Card title="Robot Data Dashboard" titleVariant="h5">
                <DataDashboard />
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
          {" "}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ height: "18em", width: "20em" }}>
              <Card title="Battery">
                <BatteryIndicator />
              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ height: "18em", width: "20em" }}>
              <Card title="Heading">
                <Compass heading={123} />
              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ height: "18em", width: "20em" }}>
              <Card title="Velocity">
                <Speedometer />
              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ height: "18em", width: "20em" }}>
              <Card title="Next Waypoint">
                <WaypointPanel />
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
          {" "}
          <Grid item xs={12} md={4}>
            <Box sx={{ height: "30em", width: "30em" }}>
              <Card title="Robot Visualization">
                <Box sx={{ width: "100%", height: "100%" }}>
                  <RobotViewer />
                </Box>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ height: "30em", width: "30em" }}>
              <Card title="LIDAR Point Cloud">
                <Box
                  sx={{ width: "100%", height: "100%", position: "relative" }}
                >
                  <LidarPointCloud />
                </Box>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ height: "30em", width: "30em" }}>
              <Card title="Cost Map">
                <Box
                  sx={{ width: "100%", height: "100%", position: "relative" }}
                >
                  <CostmapViewer
                    useMock={true}
                    showGlobal={true}
                    showLocal={false}
                  />
                </Box>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}
