// app/components/ros/ConnectionStatus.js
"use client";

import { useState, useEffect } from "react";
import ros from "@/lib/ros";
import { Box, Typography, Chip } from "@mui/material";

export default function ConnectionStatus() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // 1) Define your handlers as named functions:
    function handleConnect() {
      setConnected(true);
    }
    function handleClose() {
      setConnected(false);
    }
    function handleError() {
      setConnected(false);
    }

    // 2) Register them:
    ros.on("connection", handleConnect);
    ros.on("close",      handleClose);
    ros.on("error",      handleError);

    // 3) Cleanup by unregistering the *same* function references:
    return () => {
      ros.off("connection", handleConnect);
      ros.off("close",      handleClose);
      ros.off("error",      handleError);
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
