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
  Typography,
  Tooltip,
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
  faBars,
  faRobot,
  faMap,
  faWifi,
  faChartLine,
  faCog,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const drawerWidth = 240;
const logoPath = "/WR.svg";

export default function MainLayout({ children }) {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen((open) => !open);
  };

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

  const drawerContent = (
    <Box>
      <Toolbar sx={{ justifyContent: "center" }}>
        <Box component="img" src={logoPath} alt="Logo" sx={{ height: 60, my: 1 }} />
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Link href={item.path} style={{ textDecoration: "none", width: "100%" }}>
              <ListItemButton>
                <ListItemIcon>
                  <FontAwesomeIcon icon={item.icon} size="lg" />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* APP BAR */}
      <AppBar
        position="fixed"
        sx={{
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: {
            sm: drawerOpen
              ? `calc(100% - ${drawerWidth}px)`
              : "100%",
          },
          ml: { sm: drawerOpen ? `${drawerWidth}px` : 0 },
          backgroundColor: "#2e7d32",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap>
              WayneRobotics
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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

      {/* MOBILE DRAWER */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* DESKTOP PERSISTENT DRAWER */}
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ml: { sm: drawerOpen ? `${drawerWidth}px` : 0 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

// NavBar hover style
const navButtonStyle = {
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
};
