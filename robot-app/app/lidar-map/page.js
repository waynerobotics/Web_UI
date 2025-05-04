'use client';

import { Box, Typography } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import LidarPointCloud from '../components/lidar/LidarPointCloud';

export default function LidarMapPage() {
  return (
    <MainLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          LIDAR Point Cloud
        </Typography>
        <Box
          sx={{
            height: 600,
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <LidarPointCloud />
        </Box>
      </Box>
    </MainLayout>
  );
}
