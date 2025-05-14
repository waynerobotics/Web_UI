"use client";

import { Box, Typography } from "@mui/material";

/**
 * A responsive card component with title and gradient background
 * @param {Object} props - Component properties
 * @param {string} props.title - Card title displayed in the top left corner
 * @param {React.ReactNode} props.children - Card content
 * @param {Object} props.sx - Additional MUI styling to apply to the card
 * @param {string} props.titleVariant - MUI Typography variant for the title (default: "h6")
 */
const Card = ({ title, children, sx = {}, titleVariant = "h6" }) => {
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
        background:
          "linear-gradient(45deg,rgb(252, 252, 241) 0%,rgb(241, 250, 255) 100%)",
        ...sx,
      }}
    >
      {" "}
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
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            height: "2px",
            width: "100%",
            background:
              "linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.05))",
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
