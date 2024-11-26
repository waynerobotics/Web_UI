import React from "react";
import { Container, Typography, Box } from "@mui/material";
import TurtleControls from "./TurtleControls";
import TurtleTopics from "./TurtleTopics";

function App() {
  return (
    <Container>
      <Box 
        sx={{
          textAlign: "center", 
          marginTop: 2, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center"
        }}
      >
        <Typography variant="h3" sx={{ fontSize: { xs: '2rem', sm: '3rem', md: '4rem' } }}>
          Groot Web
        </Typography>

        {/* Flexbox Container for Canvas and Controls */}
        <Box
          sx={{
            marginTop: 5, 

            display: "flex", 
            flexDirection: { xs: "column", sm: "row" }, // Stack on smaller screens, row on larger screens
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
              display: "flex",
              border: "1px solid black",
              width: { xs: '100%', sm: '400px', md: "500px" }, 
              height: { xs: '300px', sm: '400px', md: '500px' },
              marginBottom: { xs: 2, sm: 0 }, // Add margin on small screens to separate from controls
            }}
          ></Box>

          {/* TurtleControls to the right of the canvas */}
          <Box
            sx={{
              display: "flex",
              marginTop: 5, 
              flexDirection: "column",
              alignItems: "center",
              marginLeft: { sm: 4 }, // Space between canvas and controls on larger screens
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

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: '100%', // Full width to make sure they align centrally
          }}
        >
          <TurtleTopics />
        </Box>
      </Box>
    </Container>
  );
}

export default App;
