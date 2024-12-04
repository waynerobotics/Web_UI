import React from "react";
import { Container, Typography, Box } from "@mui/material";
import TurtleControls from "./TurtleControls";
import TurtleTopics from "./TurtleTopics";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
    <Navbar />
    <Container>
      

      {/* Main Content */}
      <Box 
        sx={{
          textAlign: "center", 
          marginTop: 0,  // Adjust spacing to align with navbar
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          padding: 2,
          minHeight: '100vh', // Ensure content stretches full height
        }}
      >
      
        {/* Flexbox Container for Canvas and Controls */}
        <Box
          sx={{
            marginTop: 2, 
            display: "flex", 
            flexDirection: { xs: "column", sm: "row" }, 
            alignItems: "center", 
            justifyContent: "center",
            width: '100%',
          }}
        >
          {/* Canvas Box */}
          <Box
            component="canvas"
            id="turtleCanvas"
            sx={{
              border: "1px solid", 
              borderColor: 'divider', // Match the border color from the navbar
              width: { xs: '100%', sm: '400px', md: "500px" }, 
              height: { xs: '300px', sm: '400px', md: '500px' },
              marginBottom: { xs: 2, sm: 0 }, // Add margin on small screens to separate from controls
            }}
          ></Box>

          {/* TurtleControls to the right of the canvas */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: { xs: 4, sm: 0 }, // Adjust space on small screens
              marginLeft: { sm: 4 },
              width: "auto",
            }}
          >
            <TurtleControls />
          </Box>
        </Box>

        {/* TurtleTopics below the canvas and controls */}
        <Box 
          sx={{
            marginTop: 5,
            width: '100%', 
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TurtleTopics />
        </Box>
      </Box>
    </Container>
    </>
  );
}

export default App;
