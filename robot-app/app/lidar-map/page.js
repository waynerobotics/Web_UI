// app/lidar-map/page.js
"use client";

import Link from "next/link";
import { Box, Button } from "@mui/material";
import ConnectionStatus from "@/components/ros/ConnectionStatus";
import LidarPointCloud from "@/components/lidar/LidarPointCloud";

export default function LidarMapPage() {
  return (
    <Box sx={{ position: "relative", width: "100%", height: "100vh", bgcolor: "black" }}>
      {/* ← Back button */}
      <Button
        component={Link}
        href="/ros-connection"
        variant="contained"
        size="small"
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
        }}
      >
        ← Back
      </Button>

      {/* connection status chip */}
      <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
        <ConnectionStatus />
      </Box>

      {/* full-screen Three.js canvas */}
      <LidarPointCloud />
    </Box>
  );
}
