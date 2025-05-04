// app/lidar-map/page.js
"use client";

import MainLayout from "@/components/layout/MainLayout";
import ConnectionStatus from "@/components/ros/ConnectionStatus";
import LidarPointCloud from "@/components/lidar/LidarPointCloud";
import { Box } from "@mui/material";

export default function LidarMapPage() {
  return (
    <MainLayout>
      {/* your existing “Connected/Disconnected” chip */}
      <ConnectionStatus />

      {/* Three.js canvas fills the rest */}
      <Box sx={{ width: "100%", height: "calc(100vh - 64px)" }}>
        <LidarPointCloud />
      </Box>
    </MainLayout>
  );
}
