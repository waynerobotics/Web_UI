"use client";

import { Box, Typography } from "@mui/material";
import MainLayout    from "../components/layout/MainLayout";
import HeadingViewer from "../components/heading/HeadingViewer";

export default function HeadingPage() {
  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Heading
      </Typography>

      <Box
        sx={{
          position: "relative",
          pb: "56%",      // 16:9 aspect ratio
          height: 0,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 1,
        }}
      >
        <HeadingViewer />
      </Box>
    </MainLayout>
  );
}
