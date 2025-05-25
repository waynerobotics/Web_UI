"use client";

import dynamic from "next/dynamic";
import { Box, Typography } from "@mui/material";
import MainLayout from "../../components/layout/MainLayout";

// Dynamically import IMUViewer to prevent SSR issues
const IMUViewer = dynamic(() => import("../../components/imu/IMUViewer"), {
  ssr: false,
});

export default function IMUPage() {
  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        IMU
      </Typography>
      <Box
        sx={{
          position: "relative",
          pb: "56%", // 16:9 aspect
          height: 0,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 1,
        }}
      >
        <IMUViewer />
      </Box>
    </MainLayout>
  );
}
