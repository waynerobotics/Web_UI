"use client";

import { Box, Typography, useTheme } from "@mui/material";

/**
 * A responsive card component with title and dark mode support
 * @param {Object} props - Component properties
 * @param {string} props.title - Card title displayed in the top left corner
 * @param {React.ReactNode} props.children - Card content
 * @param {Object} props.sx - Additional MUI styling to apply to the card
 * @param {string} props.titleVariant - MUI Typography variant for the title (default: "h6")
 */
const Card = ({ title, children, sx = {}, titleVariant = "h6" }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        borderRadius: 4,
        boxShadow: 1,
        p: 2,
        overflow: "hidden",
        background: isDark
          ? "linear-gradient(135deg, #23272F 0%, #2D313A 100%)"
          : "linear-gradient(45deg, rgb(252, 252, 241) 0%, rgb(241, 250, 255) 100%)",
        color: isDark ? "#F3F6F9" : "inherit",
        ...sx,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          paddingTop: 1,
          paddingX: 2,
        }}
      >
        <Typography
          variant={titleVariant}
          sx={{
            fontWeight: "medium",
            mb: 0.5,
            color: isDark ? "#F3F6F9" : "inherit",
            textShadow: isDark ? "0 1px 8px #101112" : "none",
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            height: "2px",
            width: "100%",
            background: isDark
              ? "linear-gradient(to right, rgba(240,240,240,0.12), rgba(36, 36, 38, 0.3))"
              : "linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.05))",
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          pt: 5,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Card;
