"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ConnectionStatus from "@/components/ros/ConnectionStatus";
import LidarPointCloud from "@/components/lidar/LidarPointCloud";
import { Box, Button, Stack, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-solid-svg-icons";

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
