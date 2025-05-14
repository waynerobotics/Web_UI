"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import GitHubIcon from "@mui/icons-material/GitHub";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import {
  faBolt,
  faCompass,
  faMapLocation,
  faLocationArrow,
  faSliders,
  faArrowUpRightFromSquare,
  faRobot,
  faMap,
  faWifi,
  faChartLine,
  faCog,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const expandedWidth = 240;
const collapsedWidth = 72;
const logoPath = "/WR.svg";

export default function MainLayout({ children }) {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const menuItems = [
    { text: "Robot View", icon: faRobot, path: "/robot-view" },
    { text: "LIDAR Map", icon: faMap, path: "/lidar-map" },
    { text: "ROS2 Connection", icon: faWifi, path: "/ros-connection" },
    { text: "Data Dashboard", icon: faChartLine, path: "/dashboard" },
    { text: "Turtle Control", icon: faArrowUpRightFromSquare, path: "/turtle-control" },
    { text: "Current Sensor", icon: faBolt, path: "/current-sensor" },
    { text: "IMU", icon: faCompass, path: "/imu" },
    { text: "Costmap", icon: faMapLocation, path: "/costmap" },
    { text: "Heading", icon: faLocationArrow, path: "/heading" },
    { text: "Modes", icon: faSliders, path: "/modes" },
    { text: "Settings", icon: faCog, path: "/settings" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerOpen ? expandedWidth : collapsedWidth}px)`,
          ml: `${drawerOpen ? expandedWidth : collapsedWidth}px`,
          backgroundColor: "#2e7d32",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={toggleDrawer} color="inherit" edge="start" sx={{ mr: 2 }}>
              {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap>
              WayneRobotics
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Tooltip title="Home" arrow>
              <IconButton href="/" sx={navButtonStyle}>
                <HomeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="GitHub" arrow>
              <IconButton
                href="https://github.com/waynerobotics"
                target="_blank"
                rel="noopener noreferrer"
                sx={navButtonStyle}
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Docs" arrow>
              <IconButton href="/docs" sx={navButtonStyle}>
                <MenuBookIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Team" arrow>
              <IconButton href="/team" sx={navButtonStyle}>
                <FontAwesomeIcon icon={faUsers} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerOpen ? expandedWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerOpen ? expandedWidth : collapsedWidth,
            overflowX: "hidden",
            whiteSpace: "nowrap",
            boxSizing: "border-box",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Toolbar sx={{ justifyContent: "center", py: 2 }}>
          <Link href="/" passHref>
            <Box
              component="img"
              src={logoPath}
              alt="Logo"
              sx={{ height: 40, cursor: "pointer" }}
            />
          </Link>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <Tooltip key={item.text} title={drawerOpen ? "" : item.text} placement="right" arrow>
              <ListItem disablePadding sx={{ display: "block" }}>
                <Link href={item.path} style={{ textDecoration: "none" }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: drawerOpen ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: drawerOpen ? 2 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <FontAwesomeIcon icon={item.icon} size="lg" />
                    </ListItemIcon>
                    {drawerOpen && <ListItemText primary={item.text} />}
                  </ListItemButton>
                </Link>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: `${drawerOpen ? expandedWidth : collapsedWidth}px`,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

const navButtonStyle = {
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
};
