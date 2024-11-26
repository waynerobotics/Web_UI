import React from "react";
import { Container, Typography, Box } from "@mui/material";
import TurtleControls from "./TurtleControls";
import TurtleTopics from "./TurtleTopics";

function App() {
  return (
    <Container>
      {/* Page Title */}
      <Typography 
        variant="h3" 
        sx={{ 
          textAlign: "center", 
          marginTop: 10,  // You can keep this or adjust as needed
          fontSize: { xs: "2rem", sm: "3rem", md: "4rem" } 
        }}
      >
        Groot Web
      </Typography>

      {/* Main Layout */}
      <Box 
        sx={{
          marginTop: 4,  // Reduced marginTop to bring the components closer to the title
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" }, 
          alignItems: "stretch", 
          gap: 2, 
          minHeight: "calc(100vh - 100px)", 
        }}
      >
        {/* Left Side: Controls and Topics */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "center", 
            gap: 2, 
            width: { xs: "100%", sm: "30%" },
          }}
        >
          <TurtleControls />
          <TurtleTopics />
        </Box>

        {/* Right Side: Canvas */}
        <Box
          sx={{
            flexGrow: 1, 
            display: "flex",
            justifyContent: "center", 
            alignItems: "center", 
          }}
        >
          <Box
            component="canvas"
            id="turtleCanvas"
            sx={{
              border: "1px solid black",
              width: { xs: "100%", sm: "500px" },
              height: { xs: "300px", sm: "400px", md: "500px" },
            }}
          ></Box>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
