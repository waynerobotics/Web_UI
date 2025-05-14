"use client";

import { useEffect, useState, useRef } from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function Speedometer() {
  const [speed, setSpeed] = useState(0);
  const maxSpeed = 5; // Maximum speed in m/s
  const canvasRef = useRef(null);

  // Simulate changing velocity
  useEffect(() => {
    const interval = setInterval(() => {
      const newSpeed = parseFloat((Math.random() * maxSpeed).toFixed(2)); // 0 to 3 m/s
      setSpeed(newSpeed);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Draw speedometer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height * 0.75; // Place center point near bottom
    const radius = Math.min(width, height) * 0.4;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw speedometer arc background
    ctx.beginPath();
    ctx.lineWidth = 20;
    ctx.strokeStyle = "#e0e0e0";
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI, false);
    ctx.stroke();

    // Draw speed gradient arc
    const startAngle = Math.PI;
    const endAngle = startAngle + (speed / maxSpeed) * Math.PI;

    // Create gradient
    const gradient = ctx.createLinearGradient(
      centerX - radius,
      centerY,
      centerX + radius,
      centerY
    );
    gradient.addColorStop(0, "#2196f3"); // Blue for low speed
    gradient.addColorStop(0.6, "#4caf50"); // Green for medium speed
    gradient.addColorStop(1, "#f44336"); // Red for high speed

    ctx.beginPath();
    ctx.lineWidth = 20;
    ctx.strokeStyle = gradient;
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.stroke();

    // Draw tick marks
    for (let i = 0; i <= 6; i++) {
      const angle = Math.PI + (i / 6) * Math.PI;
      const outerX = centerX + (radius + 15) * Math.cos(angle);
      const outerY = centerY + (radius + 15) * Math.sin(angle);
      const innerX = centerX + (radius - 15) * Math.cos(angle);
      const innerY = centerY + (radius - 15) * Math.sin(angle);

      ctx.beginPath();
      ctx.lineWidth = i % 2 === 0 ? 3 : 1.5;
      ctx.strokeStyle = "#616161";
      ctx.moveTo(innerX, innerY);
      ctx.lineTo(outerX, outerY);
      ctx.stroke();

      // Add speed labels
      if (i % 2 === 0 || i === 6) {
        const labelX = centerX + (radius + 30) * Math.cos(angle);
        const labelY = centerY + (radius + 30) * Math.sin(angle);
        const speedValue = ((i / 6) * maxSpeed).toFixed(1);

        ctx.fillStyle = "#616161";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${speedValue}`, labelX, labelY);
      }
    }

    // Draw needle
    const needleAngle = Math.PI + (speed / maxSpeed) * Math.PI;
    const needleLength = radius * 0.9;

    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#e53935";
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + needleLength * Math.cos(needleAngle),
      centerY + needleLength * Math.sin(needleAngle)
    );
    ctx.stroke();

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#424242";
    ctx.fill();
  }, [speed]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "calc(100% - 40px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <canvas
          ref={canvasRef}
          width={220}
          height={180}
          style={{ width: "100%", height: "100%" }}
        />

        <Typography
          variant="h5"
          component="div"
          sx={{ mt: 0, fontWeight: "bold", color: "#2f2f2f" }}
        >
          {speed.toFixed(1)} m/s
        </Typography>
      </Box>
    </Box>
  );
}
