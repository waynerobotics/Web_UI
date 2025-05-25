"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  faHome,
  faRobot,
  faMap,
  faWifi,
  faChartLine,
  faCog,
  faUsers,
  faCamera,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const expandedWidth = 240;
const collapsedWidth = 72;
const logoPath = "/WR.svg";

export default function MainLayout({ children }) {
  const theme = useTheme();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Load drawer state from localStorage
    const savedDrawerState = localStorage.getItem("drawerOpen");
    if (savedDrawerState !== null) {
      setDrawerOpen(JSON.parse(savedDrawerState));
    }
  }, []);

  const toggleDrawer = () => {
    const newDrawerState = !drawerOpen;
    setDrawerOpen(newDrawerState);

    // Save drawer state to localStorage
    localStorage.setItem("drawerOpen", JSON.stringify(newDrawerState));
  };
  const menuItems = [
    { text: "Robot View", icon: faRobot, path: "/robot-view" },
    { text: "LIDAR Map", icon: faMap, path: "/lidar" },
    { text: "ROS2 Connection", icon: faWifi, path: "/ros-connection" },
    { text: "Data Dashboard", icon: faChartLine, path: "/dashboard" },
    { text: "Camera", icon: faCamera, path: "/camera" },
    {
      text: "Turtle Control",
      icon: faArrowUpRightFromSquare,
      path: "/turtle-control",
    },
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
          width: `calc(100% - ${
            drawerOpen ? expandedWidth : collapsedWidth
          }px)`,
          // ml: `0px`,
          backgroundColor: "#093F39", // Primary green color (9,63,57)
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={toggleDrawer}
              color="inherit"
              edge="start"
              sx={{ mr: 2 }}
            >
              {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap>
              WayneRobotics
            </Typography>
          </Box>{" "}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Tooltip title="Home" arrow>
              <Link href="/" passHref>
                <IconButton
                  component="a"
                  sx={{
                    ...navButtonStyle,
                    backgroundColor:
                      pathname === "/"
                        ? "rgba(255,255,255,0.2)"
                        : "transparent",
                    "&:hover": {
                      backgroundColor:
                        pathname === "/"
                          ? "rgba(255,255,255,0.3)"
                          : "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <HomeIcon />
                </IconButton>
              </Link>
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
              <IconButton
                href="/Shanti_2025_igvc_report.pdf"
                target="_blank"
                rel="noopener noreferrer"
                sx={navButtonStyle}
              >
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
      </AppBar>{" "}
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
            backgroundColor:
              theme.palette.mode === "light" ? "#FFFFFF" : "#1e1e1e", // White in light mode, dark in dark mode
            color: theme.palette.mode === "light" ? "#000000" : "#FFCC33", // Black text in light mode, white in dark mode
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
            />{" "}
          </Link>
        </Toolbar>
        <Divider
          sx={{
            borderColor:
              theme.palette.mode === "light"
                ? "rgba(0, 0, 0, 0.12)"
                : "rgba(255, 255, 255, 0.12)",
          }}
        />
        <List>
          {menuItems.map((item) => (
            <Tooltip
              key={item.text}
              title={drawerOpen ? "" : item.text}
              placement="right"
              arrow
            >
              <ListItem disablePadding sx={{ display: "block" }}>
                {" "}
                <Link href={item.path} style={{ textDecoration: "none" }}>
                  {" "}
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: drawerOpen ? "initial" : "center",
                      px: 2.5,
                      backgroundColor:
                        pathname === item.path
                          ? theme.palette.mode === "light"
                            ? "rgba(9, 63, 57, 0.15)"
                            : "rgba(255, 204, 51, 0.15)"
                          : "transparent",
                      "&:hover": {
                        backgroundColor:
                          theme.palette.mode === "light"
                            ? "rgba(9, 63, 57, 0.08)"
                            : "rgba(255, 255, 255, 0.08)",
                      },
                    }}
                  >
                    {" "}
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: drawerOpen ? 2 : "auto",
                        justifyContent: "center",
                        color:
                          pathname === item.path
                            ? theme.palette.mode === "light"
                              ? "#093F39"
                              : "#FFCC33"
                            : theme.palette.mode === "light"
                            ? "#093F39"
                            : "#FFFFFF", // Green in light mode, white in dark mode
                        fontWeight: pathname === item.path ? "bold" : "normal",
                      }}
                    >
                      <FontAwesomeIcon icon={item.icon} size="lg" />
                    </ListItemIcon>{" "}
                    {drawerOpen && (
                      <ListItemText
                        primary={item.text}
                        sx={{
                          color:
                            pathname === item.path
                              ? theme.palette.mode === "light"
                                ? "#093F39"
                                : "#FFCC33"
                              : theme.palette.mode === "light"
                              ? "#000000"
                              : "#FFFFFF",
                          fontWeight:
                            pathname === item.path ? "bold" : "normal",
                        }}
                      />
                    )}
                  </ListItemButton>
                </Link>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>{" "}
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          backgroundColor: theme.palette.background.default,
          // ml: `3vw`,
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
