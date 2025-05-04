"use client";

import { Box, Typography } from "@mui/material";
import MainLayout       from "../components/layout/MainLayout";
import CostmapViewer   from "../components/costmap/CostmapViewer";

export default function CostmapPage() {
  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Costmap
      </Typography>

      <Box
        sx={{
          position: "relative",
          pb: "56%",       // 16:9 aspect ratio
          height: 0,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 1,
        }}
      >
        <CostmapViewer />
      </Box>
    </MainLayout>
  );
}
