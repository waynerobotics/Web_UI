"use client";

import { Box, Typography } from "@mui/material";
import MainLayout from "../../components/layout/MainLayout";
import TurtleControls from "../../components/turtle/TurtleControls";
import TurtleTopics from "../../components/turtle/TurtleTopics";

export default function TurtleControlPage() {
  return (
    <MainLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Turtle Control Center
        </Typography>

        <Box sx={{ mt: 4 }}>
          <TurtleControls />
        </Box>

        <Box sx={{ mt: 4 }}>
          <TurtleTopics />
        </Box>
      </Box>
    </MainLayout>
  );
}
