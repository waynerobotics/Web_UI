"use client";

import { Box, Typography } from "@mui/material";
import MainLayout from "../../components/layout/MainLayout";
import IMUViewer from "../../components/imu/IMUViewer";

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
