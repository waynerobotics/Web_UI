"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  TextField,
  Stack,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faCheck,
  faTimes,
  faExchangeAlt,
  faList,
  faCode,
} from "@fortawesome/free-solid-svg-icons";

// Simulated ROS2 topics
const TOPICS = [
  { name: "/robot/cmd_vel", type: "geometry_msgs/Twist", active: true },
  { name: "/robot/odom", type: "nav_msgs/Odometry", active: true },
  { name: "/robot/scan", type: "sensor_msgs/LaserScan", active: true },
  { name: "/robot/imu", type: "sensor_msgs/Imu", active: true },
  { name: "/robot/battery", type: "std_msgs/Float32", active: true },
  { name: "/robot/status", type: "std_msgs/String", active: false },
  { name: "/map", type: "nav_msgs/OccupancyGrid", active: true },
];

export default function RosConnection() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [topics, setTopics] = useState(TOPICS);
  const [rosUrl, setRosUrl] = useState("ws://localhost:9090");
  const [messages, setMessages] = useState([]);

  // Simulate connection to ROS2
  const connectToRos = () => {
    setConnecting(true);

    // Simulating connection delay
    setTimeout(() => {
      setConnected(true);
      setConnecting(false);

      // Start simulated message reception
      startMessageSimulation();
    }, 1500);
  };

  // Disconnect from ROS2
  const disconnectFromRos = () => {
    setConnected(false);
    setMessages([]);
  };

  // Simulate receiving messages from ROS2
  const startMessageSimulation = () => {
    // Clear existing interval if any
    if (window.messageInterval) {
      clearInterval(window.messageInterval);
    }

    // Start new simulation
    window.messageInterval = setInterval(() => {
      if (!connected) {
        clearInterval(window.messageInterval);
        return;
      }

      // Randomly select a topic
      const activeTopics = topics.filter((t) => t.active);
      const randomTopic =
        activeTopics[Math.floor(Math.random() * activeTopics.length)];

      // Generate a simulated message based on the topic
      let messageContent;
      switch (randomTopic.name) {
        case "/robot/cmd_vel":
          messageContent = {
            linear: { x: (Math.random() - 0.5).toFixed(2), y: 0, z: 0 },
            angular: { x: 0, y: 0, z: (Math.random() - 0.5).toFixed(2) },
          };
          break;
        case "/robot/odom":
          messageContent = {
            position: {
              x: (Math.random() * 10).toFixed(2),
              y: (Math.random() * 10).toFixed(2),
              z: 0,
            },
            orientation: { w: 1, x: 0, y: 0, z: 0 },
          };
          break;
        case "/robot/scan":
          messageContent = {
            angle_min: -1.57,
            angle_max: 1.57,
            ranges: Array(5)
              .fill()
              .map(() => (Math.random() * 5 + 1).toFixed(2)),
          };
          break;
        case "/robot/battery":
          messageContent = {
            data: (Math.random() * 100).toFixed(1) + "%",
          };
          break;
        default:
          messageContent = {
            data: "Message at " + new Date().toLocaleTimeString(),
          };
      }

      // Create new message
      const newMessage = {
        id: Date.now(),
        topic: randomTopic.name,
        type: randomTopic.type,
        timestamp: new Date().toLocaleTimeString(),
        data: messageContent,
      };

      // Add to messages (keep most recent 5)
      setMessages((prev) => [newMessage, ...prev].slice(0, 5));
    }, 2000); // New message every 2 seconds
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.messageInterval) {
        clearInterval(window.messageInterval);
      }
    };
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <FontAwesomeIcon
          icon={faWifi}
          style={{
            color: connected ? "#4caf50" : "#f44336",
            marginRight: "8px",
            fontSize: "1.5rem",
          }}
        />
        <Typography variant="h6">ROS2 Bridge</Typography>
        <Chip
          label={connected ? "Connected" : "Disconnected"}
          color={connected ? "success" : "error"}
          size="small"
          sx={{ ml: 2 }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          label="Bridge URL"
          value={rosUrl}
          onChange={(e) => setRosUrl(e.target.value)}
          size="small"
          fullWidth
          disabled={connected}
          variant="outlined"
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color={connected ? "error" : "primary"}
          onClick={connected ? disconnectFromRos : connectToRos}
          fullWidth
          disabled={connecting}
          startIcon={
            connected ? (
              <FontAwesomeIcon icon={faTimes} />
            ) : (
              <FontAwesomeIcon icon={faCheck} />
            )
          }
        >
          {connecting ? "Connecting..." : connected ? "Disconnect" : "Connect"}
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="subtitle2"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <FontAwesomeIcon icon={faList} style={{ marginRight: "8px" }} />
        Active Topics
      </Typography>

      <Box sx={{ flexGrow: 1, overflow: "auto", my: 1 }}>
        <List dense>
          {topics.map((topic) => (
            <ListItem key={topic.name} disablePadding>
              <ListItemIcon sx={{ minWidth: 24 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor:
                      topic.active && connected
                        ? "success.main"
                        : "text.disabled",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={topic.name}
                secondary={topic.type}
                primaryTypographyProps={{ fontSize: "0.8rem" }}
                secondaryTypographyProps={{ fontSize: "0.7rem" }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="subtitle2"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <FontAwesomeIcon icon={faExchangeAlt} style={{ marginRight: "8px" }} />
        Recent Messages
      </Typography>

      <Box sx={{ flexGrow: 1, overflow: "auto", my: 1 }}>
        <Stack spacing={1}>
          {messages.length > 0 ? (
            messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  p: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  fontSize: "0.75rem",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="caption"
                    color="primary"
                    fontWeight="bold"
                  >
                    {msg.topic}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {msg.timestamp}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: 0.5,
                    fontSize: "0.7rem",
                    fontFamily: "monospace",
                    backgroundColor: "action.hover",
                    p: 0.5,
                    borderRadius: 0.5,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCode}
                    style={{ marginRight: "4px", opacity: 0.5 }}
                  />
                  {JSON.stringify(msg.data)}
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" align="center">
              No messages received
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
