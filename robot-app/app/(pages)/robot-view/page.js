"use client";

import { Box, Typography } from "@mui/material";
import MainLayout from "../../components/layout/MainLayout";
import RobotViewer from "../../components/robot/RobotViewer";

export default function RobotViewPage() {
  return (
    <MainLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Robot Visualization
        </Typography>
        <Box
          sx={{
            height: 600,
            bgcolor: "background.paper",
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <RobotViewer />
        </Box>
      </Box>
    </MainLayout>
  );
}
