"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faGaugeHigh,
  faList,
  faRefresh,
  faLink,
} from "@fortawesome/free-solid-svg-icons";

export default function DataDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [grafanaUrl, setGrafanaUrl] = useState("http://localhost:3000");
  const [dashboardId, setDashboardId] = useState("robot-data");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(true);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Simulate loading of Grafana dashboards
  const refreshDashboard = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowDemo(true);
    }, 1000);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="dashboard tabs"
        >
          <Tab
            icon={<FontAwesomeIcon icon={faChartLine} />}
            iconPosition="start"
            label="Robot Telemetry"
          />
          <Tab
            icon={<FontAwesomeIcon icon={faGaugeHigh} />}
            iconPosition="start"
            label="Performance"
          />
          <Tab
            icon={<FontAwesomeIcon icon={faList} />}
            iconPosition="start"
            label="Logs"
          />
        </Tabs>
      </Box>

      {/* Settings Bar */}
      <Paper
        sx={{
          p: 1,
          mt: 1,
          mb: 2,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <TextField
          label="Grafana URL"
          size="small"
          value={grafanaUrl}
          onChange={(e) => setGrafanaUrl(e.target.value)}
          sx={{ flexGrow: 1, minWidth: "200px" }}
        />
        <TextField
          label="Dashboard ID"
          size="small"
          value={dashboardId}
          onChange={(e) => setDashboardId(e.target.value)}
          sx={{ width: "150px" }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={refreshDashboard}
          startIcon={<FontAwesomeIcon icon={faRefresh} />}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={20} /> : "Refresh"}
        </Button>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
          }
          label="Auto Refresh"
          sx={{ ml: 1 }}
        />
      </Paper>

      {/* Dashboard Content */}
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : showDemo ? (
          <TabPanel value={tabValue} index={0}>
            <Typography variant="body1" sx={{ p: 2 }}>
              Overview telemetry is shown above (Battery, Speed, Waypoint). More visualizations coming soon.
            </Typography>

          </TabPanel>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Alert severity="info" sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FontAwesomeIcon icon={faLink} style={{ marginRight: "8px" }} />
                <Typography variant="body2">
                  Connect to a Grafana instance to view dashboards
                </Typography>
              </Box>
            </Alert>
            <Button variant="outlined" onClick={refreshDashboard}>
              Connect
            </Button>
          </Box>
        )}

        <TabPanel value={tabValue} index={1}>
          <PerformancePanel />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <LogsPanel />
        </TabPanel>
      </Box>
    </Box>
  );
}

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      style={{ height: "100%" }}
      {...other}
    >
      {value === index && <Box sx={{ height: "100%" }}>{children}</Box>}
    </div>
  );
}

// Simple Robot Dashboard (Demo Component)
function SimpleRobotDashboard() {
  // Generate random value between min and max
  const randomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Simulate some robot metrics
  const metrics = {
    battery: randomValue(50, 98),
    temperature: randomValue(30, 75),
    cpuLoad: randomValue(10, 85),
    memoryUsage: randomValue(30, 70),
    diskSpace: randomValue(20, 60),
    velocity: (Math.random() * 2).toFixed(1),
    runtime: randomValue(120, 3600),
  };

  // Format runtime in hours:minutes
  const formatRuntime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Grid container spacing={2}>
      {/* Battery Status */}
      <Grid item xs={6} md={4}>
        <MetricCard
          title="Battery"
          value={`${metrics.battery}%`}
          color={
            metrics.battery > 20
              ? metrics.battery > 50
                ? "#4caf50"
                : "#ff9800"
              : "#f44336"
          }
        />
      </Grid>

      {/* Temperature */}
      <Grid item xs={6} md={4}>
        <MetricCard
          title="Temperature"
          value={`${metrics.temperature}°C`}
          color={
            metrics.temperature < 50
              ? "#4caf50"
              : metrics.temperature < 65
              ? "#ff9800"
              : "#f44336"
          }
        />
      </Grid>

      {/* CPU Load */}
      <Grid item xs={6} md={4}>
        <MetricCard
          title="CPU Load"
          value={`${metrics.cpuLoad}%`}
          color={
            metrics.cpuLoad < 50
              ? "#4caf50"
              : metrics.cpuLoad < 80
              ? "#ff9800"
              : "#f44336"
          }
        />
      </Grid>

      {/* Memory Usage */}
      <Grid item xs={6} md={4}>
        <MetricCard
          title="Memory"
          value={`${metrics.memoryUsage}%`}
          color={
            metrics.memoryUsage < 50
              ? "#4caf50"
              : metrics.memoryUsage < 80
              ? "#ff9800"
              : "#f44336"
          }
        />
      </Grid>

      {/* Velocity */}
      <Grid item xs={6} md={4}>
        <MetricCard
          title="Velocity"
          value={`${metrics.velocity} m/s`}
          color="#2196f3"
        />
      </Grid>

      {/* Runtime */}
      <Grid item xs={6} md={4}>
        <MetricCard
          title="Runtime"
          value={formatRuntime(metrics.runtime)}
          color="#9c27b0"
        />
      </Grid>

      {/* Disk Space */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mt: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Disk Usage
          </Typography>
          <Box
            sx={{
              height: 20,
              width: "100%",
              backgroundColor: "#e0e0e0",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${metrics.diskSpace}%`,
                backgroundColor:
                  metrics.diskSpace < 50
                    ? "#4caf50"
                    : metrics.diskSpace < 80
                    ? "#ff9800"
                    : "#f44336",
                transition: "width 0.3s ease",
              }}
            />
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}
          >
            <Typography variant="caption" color="text.secondary">
              {metrics.diskSpace}% Used
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {100 - metrics.diskSpace}% Free
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

// Performance Panel Component
function PerformancePanel() {
  return (
    <Box sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="body1" color="text.secondary">
        Performance metrics will be displayed here
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1 }}
      >
        Connect to Grafana to see real-time performance data
      </Typography>
    </Box>
  );
}

// Logs Panel Component
function LogsPanel() {
  // Sample log entries
  const logs = [
    {
      timestamp: "10:45:12",
      level: "INFO",
      message: "Robot initialized successfully",
    },
    {
      timestamp: "10:45:30",
      level: "INFO",
      message: "Navigation system started",
    },
    {
      timestamp: "10:46:02",
      level: "WARN",
      message: "Obstacle detected in path",
    },
    { timestamp: "10:46:15", level: "INFO", message: "Recalculating route" },
    {
      timestamp: "10:47:00",
      level: "ERROR",
      message: "Failed to connect to sensor: timeout",
    },
    {
      timestamp: "10:47:30",
      level: "INFO",
      message: "Sensor connection re-established",
    },
    {
      timestamp: "10:48:45",
      level: "DEBUG",
      message: "Position updated: x=2.3, y=4.5, θ=0.23",
    },
  ];

  // Get color for log level
  const getLevelColor = (level) => {
    switch (level) {
      case "ERROR":
        return "#f44336";
      case "WARN":
        return "#ff9800";
      case "INFO":
        return "#2196f3";
      case "DEBUG":
        return "#9e9e9e";
      default:
        return "inherit";
    }
  };

  return (
    <Box sx={{ p: 1, height: "100%", overflow: "auto" }}>
      {logs.map((log, index) => (
        <Box
          key={index}
          sx={{
            p: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
            fontFamily: "monospace",
            fontSize: "0.85rem",
          }}
        >
          <Typography component="span" sx={{ mr: 2, color: "text.secondary" }}>
            {log.timestamp}
          </Typography>
          <Typography
            component="span"
            sx={{
              mr: 2,
              color: getLevelColor(log.level),
              fontWeight: log.level === "ERROR" ? "bold" : "normal",
            }}
          >
            [{log.level}]
          </Typography>
          <Typography component="span">{log.message}</Typography>
        </Box>
      ))}
    </Box>
  );
}

// Metric Card Component
function MetricCard({ title, value, color }) {
  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: color,
          mt: 1,
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}
