// app/current-sensor/page.js
"use client";

import dynamic from "next/dynamic";
import { Box, Typography } from "@mui/material";
import MainLayout from "../../components/layout/MainLayout";

// Dynamically import CurrentSensorViewer to prevent SSR issues
const CurrentSensorViewer = dynamic(
  () => import("../../components/current-sensor/CurrentSensorViewer"),
  { ssr: false }
);

export default function CurrentSensorPage() {
  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Current Sensor
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
        <CurrentSensorViewer />
      </Box>
    </MainLayout>
  );
}
