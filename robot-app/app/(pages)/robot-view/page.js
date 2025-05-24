"use client";

import { Box, Typography } from "@mui/material";
import MainLayout from "../../components/layout/MainLayout";
import RobotViewer from "@/components/robot/RobotViewer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

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
