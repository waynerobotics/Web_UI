"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ConnectionStatus from "@/components/ros/ConnectionStatus";
import { Box, Button, Stack, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-solid-svg-icons";

// Dynamically import LidarPointCloud to prevent SSR issues
const LidarPointCloud = dynamic(
  () => import("@/components/lidar/LidarPointCloud"),
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Loading LIDAR visualization...</Typography>
      </Box>
    ),
  }
);

export default function LidarMapPage() {
  const [useMock, setUseMock] = useState(true);

  return (
    <MainLayout>
      <ConnectionStatus />

      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} mb={2}>
          <Typography variant="h4" gutterBottom>
            <FontAwesomeIcon icon={faMap} style={{ marginRight: 12 }} />
            Lidar Point Cloud
          </Typography>

          <Button variant="contained" onClick={() => setUseMock((v) => !v)}>
            {useMock ? "Switch to Live" : "Switch to Mock"}
          </Button>
        </Stack>

        <Box sx={{ width: "100%", height: "calc(100vh - 160px)" }}>
          <LidarPointCloud useMock={useMock} />
        </Box>
      </Box>
    </MainLayout>
  );
}
