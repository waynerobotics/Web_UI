"use client";

import { Box, Typography } from "@mui/material";
import BatteryGauge from "react-battery-gauge";
import { useState, useEffect } from "react";

export default function BatteryIndicator() {
  // Use state with a default value of 0, then update it client-side only
  const [batteryLevel, setBatteryLevel] = useState(0);

  // Update battery level on client-side only to avoid hydration mismatch
  useEffect(() => {
    // Simulate a stable battery value (could be replaced with actual ROS data)
    setBatteryLevel(62); // Using a fixed value to match what was seen in the error
  }, []);

  // Determine battery color based on level
  const getBatteryColor = () => {
    if (batteryLevel > 50) return "#4caf50"; // green
    if (batteryLevel > 20) return "#ff9800"; // orange
    return "#f44336"; // red
  };

  return (
    <BatteryGauge
      value={batteryLevel}
      animated={true}
      customization={{
        batteryBody: {
          strokeWidth: 4,
          cornerRadius: 8,
          fill: "white",
          stroke: "#333",
        },
        batteryCap: {
          fill: "#333",
          width: 20,
          height: 10,
        },
        batteryMeter: {
          fill: getBatteryColor(),
          lowBatteryValue: 20,
          lowBatteryFill: "#f44336",
          outerGap: 2,
          noOfCells: 3,
        },
        readingText: {
          lightContrastColor: "#333",
          darkContrastColor: "white",
          lowBatteryColor: "#f44336",
          fontFamily: "Arial",
          fontSize: 24,
          showPercentage: true,
        },
      }}
    />
  );
}
