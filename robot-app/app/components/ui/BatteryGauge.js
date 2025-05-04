"use client";

import { Box, Typography, LinearProgress } from "@mui/material";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import Battery60Icon from "@mui/icons-material/Battery60";
import Battery20Icon from "@mui/icons-material/Battery20";
import BatteryAlertIcon from "@mui/icons-material/BatteryAlert";
import { useState, useEffect } from "react";

export default function BatteryGauge() {
  // Use state with a default value of 0, then update it client-side only
  const [batteryLevel, setBatteryLevel] = useState(0);

  // Update battery level on client-side only to avoid hydration mismatch
  useEffect(() => {
    // Simulate a stable battery value (could be replaced with actual ROS data)
    setBatteryLevel(62); // Using a fixed value to match what was seen in the error
  }, []);

  // Pick icon based on battery level
  const getBatteryIcon = () => {
    if (batteryLevel > 80) return <BatteryFullIcon color="success" />;
    if (batteryLevel > 50) return <Battery60Icon color="primary" />;
    if (batteryLevel > 20) return <Battery20Icon color="warning" />;
    return <BatteryAlertIcon color="error" />;
  };

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        {getBatteryIcon()}
        <Typography variant="h6" sx={{ ml: 1 }}>
          Battery Level
        </Typography>
      </Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
        {batteryLevel}%
      </Typography>
      <LinearProgress
        variant="determinate"
        value={batteryLevel}
        sx={{
          height: 12,
          borderRadius: 6,
          backgroundColor: "#ddd",
          "& .MuiLinearProgress-bar": {
            backgroundColor:
              batteryLevel > 50
                ? "#4caf50"
                : batteryLevel > 20
                ? "#ff9800"
                : "#f44336",
          },
        }}
      />
    </Box>
  );
}
