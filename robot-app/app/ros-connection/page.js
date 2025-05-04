'use client';
import { Box, Typography } from '@mui/material';
import RosConnection from '../components/ros/ConnectionStatus';
import MainLayout from '../components/layout/MainLayout';

export default function RosConnectionPage() {
  return (
    <MainLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>ROS2 Connection</Typography>
        <Box sx={{ height: 500, bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 1 }}>
          <RosConnection />
        </Box>
      </Box>
    </MainLayout>
  );
}
