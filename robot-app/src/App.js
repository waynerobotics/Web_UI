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
          marginTop: 4, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center"
        }}
      >
        <Typography variant="h3" sx={{ fontSize: { xs: '2rem', sm: '3rem', md: '4rem' } }}>
          Groot Web
        </Typography>

       
        <Box
          component="canvas"
          id="turtleCanvas"
          sx={{
            border: "1px solid black",
            width: { xs: '100%', sm: '500px' },
            height: { xs: '300px', sm: '400px', md: '500px' },
            marginTop: 2,
          }}
        ></Box>

        <Box 
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: '100%'
          }}
        >
          <TurtleControls />
          <TurtleTopics />
        </Box>
      </Box>
    </Container>
  );
}

export default App;
