import React from "react";
import { Container, Box, Typography } from "@mui/material";
import TurtleControls from "./TurtleControls";
import TurtleTopics from "./TurtleTopics";

function App() {
  return (
    <Container>
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h3">
          Groot Web
        </Typography>
        <Box
          component="canvas"
          id="turtleCanvas"
          sx={{
            marginTop: 2,
            border: "1px solid black",
            width: '500px', 
            height: '500px',
            mx: "auto", 
          }}
        ></Box>
        
        <Box sx={{ marginTop: 4 }}>
          <TurtleControls />
        </Box>

        <Box sx={{ marginTop: 4 }}>
          <TurtleTopics />
        </Box>
      </Box>
    </Container>
  );
}

export default App;
