// app/components/ros/ConnectionStatus.js
"use client";

import { useState, useEffect } from "react";
import ros from "@/lib/ros";
import { Box, Typography, Chip } from "@mui/material";

export default function ConnectionStatus() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Define handler functions explicitly so we can reference them in cleanup
    const handleConnection = () => setConnected(true);
    const handleClose = () => setConnected(false);

    // update on connect / close
    ros.on("connection", handleConnection);
    ros.on("close", handleClose);

    // cleanup - must use the same function references
    return () => {
      ros.off("connection", handleConnection);
      ros.off("close", handleClose);
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
