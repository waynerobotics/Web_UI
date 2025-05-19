"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import CostmapViewer from "../../components/costmap/CostmapViewer";

export default function CostmapPage() {
  const [showLocal, setShowLocal] = useState(true);
  const [showGlobal, setShowGlobal] = useState(true);
  const [useMock, setUseMock] = useState(true);

  const toggleMock = () => setUseMock((prev) => !prev);

  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Costmap Viewer
      </Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" onClick={toggleMock}>
          {useMock ? "Switch to Live Data" : "Switch to Simulation"}
        </Button>
        <Button
          variant={showLocal ? "contained" : "outlined"}
          onClick={() => setShowLocal((prev) => !prev)}
        >
          Toggle Local
        </Button>
        <Button
          variant={showGlobal ? "contained" : "outlined"}
          onClick={() => setShowGlobal((prev) => !prev)}
        >
          Toggle Global
        </Button>
      </Stack>

      <Box display="flex" gap={2} flexWrap="wrap">
        {showLocal && (
          <Box sx={{ flex: 1, minWidth: "300px" }}>
            <Typography variant="h5" gutterBottom>
              Local Costmap
            </Typography>
            <Box
              sx={{
                position: "relative",
                pb: "56%",
                height: 0,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 1,
              }}
            >
              <CostmapViewer
                useMock={useMock}
                showGlobal={false}
                showLocal={true}
              />
            </Box>
          </Box>
        )}

        {showGlobal && (
          <Box sx={{ flex: 1, minWidth: "300px" }}>
            <Typography variant="h5" gutterBottom>
              Global Costmap
            </Typography>
            <Box
              sx={{
                position: "relative",
                pb: "56%",
                height: 0,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 1,
              }}
            >
              <CostmapViewer
                useMock={useMock}
                showGlobal={true}
                showLocal={false}
              />
            </Box>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}
