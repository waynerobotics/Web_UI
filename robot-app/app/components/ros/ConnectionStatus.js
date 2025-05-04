// app/components/ros/ConnectionStatus.js
"use client";

import { useState, useEffect } from "react";
import ros from "@/lib/ros";
import { Box, Typography, Chip } from "@mui/material";

export default function ConnectionStatus() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // update on connect / close
    ros.on("connection", () => setConnected(true));
    ros.on("close",      () => setConnected(false));
    // cleanup
    return () => {
      ros.off("connection");
      ros.off("close");
    };
  }, []);

  return (
    <Box sx={{ p: 1, display: "flex", alignItems: "center" }}>
      <Typography variant="subtitle1" sx={{ mr: 1 }}>
        ROSBridge:
      </Typography>
      <Chip
        label={connected ? "Connected" : "Disconnected"}
        color={connected ? "success" : "error"}
        size="small"
      />
    </Box>
  );
}
