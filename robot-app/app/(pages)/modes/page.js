"use client";

import { Box, Typography, ButtonGroup, Button } from "@mui/material";
import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import ModesViewer from "../../components/modes/ModesViewer";

export default function ModesPage() {
  const [modeIdx, setModeIdx] = useState(0);
  const labels = ["Autonomous", "Teleop", "Standby"];

  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Modes
      </Typography>

      {/* MUI buttons to switch modes */}
      <ButtonGroup sx={{ mb: 2 }}>
        {labels.map((lbl, i) => (
          <Button
            key={lbl}
            variant={modeIdx === i ? "contained" : "outlined"}
            onClick={() => setModeIdx(i)}
          >
            {lbl}
          </Button>
        ))}
      </ButtonGroup>

      <Box
        sx={{
          position: "relative",
          pb: "56%", // 16:9
          height: 0,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 1,
        }}
      >
        <ModesViewer activeMode={modeIdx} />
      </Box>
    </MainLayout>
  );
}
