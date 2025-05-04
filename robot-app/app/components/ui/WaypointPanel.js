"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";

export default function WaypointPanel() {
  const [waypoint, setWaypoint] = useState({ x: 3.2, y: 5.1 });
  const [distance, setDistance] = useState(2.7);
  const [eta, setEta] = useState(5.2);
  const [status, setStatus] = useState("Approaching");

  // Simulate status update
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly change values
      const newDistance = parseFloat((Math.random() * 5).toFixed(2));
      setDistance(newDistance);
      setEta(parseFloat((newDistance / 0.5).toFixed(1))); // assume 0.5 m/s

      if (newDistance < 0.5) setStatus("Reached");
      else setStatus("Approaching");
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
      <Typography variant="h6" gutterBottom>
        Next Waypoint
      </Typography>

      <Stack spacing={1}>
        <Typography variant="body2">
          Coordinates:{" "}
          <strong>
            ({waypoint.x}, {waypoint.y})
          </strong>
        </Typography>
        <Typography variant="body2">
          Distance: <strong>{distance} m</strong>
        </Typography>
        <Typography variant="body2">
          ETA: <strong>{eta} sec</strong>
        </Typography>
        <Box
          sx={{ display: "flex", alignItems: "center", fontSize: "0.875rem" }}
        >
          Status:{" "}
          <Box component="span" sx={{ ml: 0.5 }}>
            <Chip
              label={status}
              color={status === "Reached" ? "success" : "primary"}
              size="small"
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
