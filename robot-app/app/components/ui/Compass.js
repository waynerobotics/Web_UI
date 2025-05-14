"use client";

import { Box, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";

export default function Compass({ heading = 0 }) {
  // Use state with a default value of 0, then update it client-side only
  const [currentHeading, setCurrentHeading] = useState(0);
  const compassRef = useRef(null);

  // Update heading on client-side only to avoid hydration mismatch
  // In a real app, this would be updated via props from ROS data
  useEffect(() => {
    // Initialize with the provided heading or simulate a value
    setCurrentHeading(heading);

    // Mock changing heading for demo purposes - remove in production
    // and replace with actual ROS data through the heading prop
    const interval = setInterval(() => {
      setCurrentHeading((prev) => (prev + 2) % 360);
    }, 1000);

    return () => clearInterval(interval);
  }, [heading]);

  // Calculate cardinal direction text
  const getCardinalDirection = (degrees) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round((degrees % 360) / 45) % 8;
    return directions[index];
  };

  return (
    <Box
      sx={{
        p: 2,
        mt: 5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 200,
          height: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Compass Circle */}
        <Box
          sx={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            border: "2px solid #333",
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Cardinal points */}
          {["N", "E", "S", "W"].map((point, index) => (
            <Typography
              key={point}
              variant="body1"
              fontWeight="bold"
              sx={{
                position: "absolute",
                transform: `rotate(${
                  index * 90
                }deg) translateY(-75px) rotate(-${index * 90}deg)`,
              }}
            >
              {point}
            </Typography>
          ))}

          {/* Intercardinal points */}
          {["NE", "SE", "SW", "NW"].map((point, index) => (
            <Typography
              key={point}
              variant="body2"
              sx={{
                position: "absolute",
                transform: `rotate(${
                  45 + index * 90
                }deg) translateY(-75px) rotate(-${45 + index * 90}deg)`,
                opacity: 0.7,
              }}
            >
              {point}
            </Typography>
          ))}

          {/* Compass Needle */}
          <Box
            ref={compassRef}
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              transform: `rotate(${currentHeading}deg)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "4px",
                height: "80px",
                marginLeft: "-2px",
                marginTop: "-40px",
                background: "linear-gradient(to bottom, #dc3545 50%, #333 50%)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "12px",
                height: "12px",
                marginLeft: "-6px",
                marginTop: "-6px",
                borderRadius: "50%",
                backgroundColor: "#333",
              }}
            />
          </Box>
        </Box>
      </Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mt: 5 }}>
        {getCardinalDirection(currentHeading)} : {currentHeading.toFixed(0)}°
      </Typography>
    </Box>
  );
}
