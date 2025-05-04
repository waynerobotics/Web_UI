'use client';

import { Box, Grid, Container, Typography } from '@mui/material';
import MainLayout from './components/layout/MainLayout';
import RobotViewer from './components/robot/RobotViewer';
import LidarPointCloud from './components/lidar/LidarPointCloud';
import RosConnection from './components/ros/ConnectionStatus';
import DataDashboard from './components/dashboard/DataDashboard';
import BatteryGauge from './components/ui/BatteryGauge';
import Speedometer from './components/ui/Speedometer';
import WaypointPanel from './components/ui/WaypointPanel';
import RobotMap from './components/ui/RobotMap';

export default function Home() {
  return (
    <MainLayout>
      <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        {/* Dashboard Title + Component */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Robot Data Dashboard
          </Typography>
          <Box sx={{ bgcolor: 'background.paper', boxShadow: 1, borderRadius: 1, p: 2, mb: 4 }}>
            <DataDashboard />
          </Box>
        </Grid>

        {/* Row: ROS2 + Battery + Speed + Waypoint */}
        <Grid container spacing={3} alignItems="flex-start" sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}><RosConnection /></Grid>
          <Grid item xs={12} md={3}><BatteryGauge /></Grid>
          <Grid item xs={12} md={3}><Speedometer /></Grid>
          <Grid item xs={12} md={3}><WaypointPanel /></Grid>
        </Grid>

        {/* Row: Robot Viewer + Lidar + Map */}
        <Grid container spacing={5} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Robot Visualization</Typography>
            <Box sx={{ height: 500, width: '100%', bgcolor: 'background.paper', boxShadow: 1, borderRadius: 1, p: 2 }}>
              <RobotViewer />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>LIDAR Point Cloud</Typography>
            <Box sx={{ height: 500, width: '100%', bgcolor: 'background.paper', boxShadow: 1, borderRadius: 1, p: 2, overflow: 'hidden' }}>
              <LidarPointCloud />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Robot Map</Typography>
            <Box sx={{ height: 500, width: '100%', bgcolor: 'background.paper', boxShadow: 1, borderRadius: 1, p: 2 }}>
              <RobotMap />
            </Box>
          </Grid>
        </Grid>

      </Container>
    </MainLayout>
  );
}
