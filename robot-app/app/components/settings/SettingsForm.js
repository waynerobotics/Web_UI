"use client";

import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Slider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { ColorModeContext } from "../../layout";

export default function SettingsForm() {
  // Context for color mode
  const { mode, toggleColorMode } = useContext(ColorModeContext);

  // Local form state
  const [rosEndpoint, setRosEndpoint] = useState("");
  const [refreshRate, setRefreshRate] = useState(5);
  const [sensorThreshold, setSensorThreshold] = useState(0.5);

  // Switch state kept in sync with context
  const [darkModeSwitch, setDarkModeSwitch] = useState(mode === "dark");
  useEffect(() => {
    setDarkModeSwitch(mode === "dark");
  }, [mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const settings = {
      rosEndpoint,
      refreshRate,
      sensorThreshold,
      darkMode: mode,
    };
    console.log("Save settings:", settings);
    // TODO: persist settings to localStorage or backend
  };

  const handleDarkModeToggle = (e) => {
    const checked = e.target.checked;
    setDarkModeSwitch(checked);
    toggleColorMode();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 3, width: 400 }}
    >
      <Typography variant="h6">Application Settings</Typography>
      <TextField
        label="ROS Endpoint URL"
        value={rosEndpoint}
        onChange={(e) => setRosEndpoint(e.target.value)}
        placeholder="ws://localhost:9090"
        fullWidth
      />
      <Box>
        <Typography gutterBottom>Data Refresh Rate (sec)</Typography>
        <Slider
          value={refreshRate}
          onChange={(e, v) => setRefreshRate(v)}
          step={1}
          marks
          min={1}
          max={60}
          valueLabelDisplay="auto"
        />
      </Box>
      <Box>
        <Typography gutterBottom>Sensor Threshold</Typography>
        <Slider
          value={sensorThreshold}
          onChange={(e, v) => setSensorThreshold(v)}
          step={0.01}
          min={0}
          max={1}
          valueLabelDisplay="auto"
        />
      </Box>
      <FormControlLabel
        control={
          <Switch checked={darkModeSwitch} onChange={handleDarkModeToggle} />
        }
        label="Enable Dark Mode"
      />{" "}
      <Button type="submit" variant="contained" color="secondary">
        Save Settings
      </Button>
    </Box>
  );
}
