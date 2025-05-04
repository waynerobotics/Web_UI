"use client";

import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function Speedometer() {
  const [speed, setSpeed] = useState(0);

  // Simulate changing velocity
  useEffect(() => {
    const interval = setInterval(() => {
      const newSpeed = parseFloat((Math.random() * 3).toFixed(2)); // 0 to 3 m/s
      setSpeed(newSpeed);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Scale speed to percent (for CircularProgress)
  const speedPercent = Math.min((speed / 3) * 100, 100);

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Velocity
      </Typography>

      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
          mb: 1,
        }}
      >
        <CircularProgress
          variant="determinate"
          value={speedPercent}
          size={100}
          thickness={4}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" component="div">
            {speed} m/s
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
