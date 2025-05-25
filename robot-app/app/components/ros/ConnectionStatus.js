// app/components/ros/ConnectionStatus.js
"use client";

import { useState, useEffect } from "react";
import ros from "@/lib/ros";
import { Box, Typography, Chip } from "@mui/material";

export default function ConnectionStatus() {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    let isMounted = true;
    let intervalId; // Initial check
    if (ros && ros.isConnected) {
      setConnected(true);
      setError(false);
    }

    // Periodic check every 3 seconds
    intervalId = setInterval(() => {
      if (isMounted) {
        const isConnected = ros && ros.isConnected;
        setConnected(isConnected);
        if (!isConnected) {
          setError(false); // Reset error state if just disconnected
        }
      }
    }, 3000);

    const handleConnection = () => {
      if (isMounted) {
        setConnected(true);
        setError(false);
      }
    };

    const handleClose = () => {
      if (isMounted) {
        setConnected(false);
      }
    };

    const handleError = (err) => {
      console.log("ROS connection error:", err);
      if (isMounted) {
        setConnected(false);
        setError(true);
      }
    };
    try {
      if (ros) {
        ros.on("connection", handleConnection);
        ros.on("close", handleClose);
        ros.on("error", handleError);
      }
    } catch (err) {
      handleError(err);
    }

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
      try {
        if (ros) {
          ros.off("connection", handleConnection);
          ros.off("close", handleClose);
          ros.off("error", handleError);
        }
      } catch (cleanupErr) {
        console.warn("ROS cleanup failed:", cleanupErr);
      }
    };
  }, []);

  return (
    <Box sx={{ p: 1, display: "flex", alignItems: "center" }}>
      <Typography variant="subtitle1" sx={{ mr: 1 }}>
        ROSBridge:
      </Typography>
      <Chip
        label={error ? "Error" : connected ? "Connected" : "Disconnected"}
        color={error ? "warning" : connected ? "success" : "error"}
        size="small"
      />
    </Box>
  );
}
