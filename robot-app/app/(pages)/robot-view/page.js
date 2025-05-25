"use client";

import dynamic from "next/dynamic";
import { Box, Typography } from "@mui/material";
import MainLayout from "../../components/layout/MainLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

// Dynamically import RobotViewer to prevent SSR issues
const RobotViewer = dynamic(() => import("@/components/robot/RobotViewer"), {
  ssr: false,
});

export default function RobotViewPage() {
  return (
    <MainLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          <FontAwesomeIcon icon={faRobot} style={{ marginRight: 12 }} />
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
