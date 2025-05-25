"use client";
import { Grid, Box, Typography } from "@mui/material";
import BatteryGauge from "../../components/ui/BatteryGauge";
import Speedometer from "../../components/ui/Speedometer";
import WaypointPanel from "../../components/ui/WaypointPanel";
import DataDashboard from "../../components/dashboard/DataDashboard";
import MainLayout from "../../components/layout/MainLayout";

export default function DashboardPage() {
  return (
    <MainLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Robot Data Dashboard
        </Typography>{" "}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <BatteryGauge />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Speedometer />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <WaypointPanel />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <DataDashboard />
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
}
