import React from "react";
import { Box, Button } from "@mui/material";

const moveTurtle = (x, y) => {
  console.log(`Move turtle by x:${x}, y:${y}`);
};

const stopTurtle = () => {
  console.log("Stop turtle");
};

function TurtleControls() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <Button variant="contained" color="primary" onClick={() => moveTurtle(0, -2)}>
        Move Up
      </Button>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={() => moveTurtle(2, 0)}>
          Move Right
        </Button>
        <Button variant="contained" color="primary" onClick={() => moveTurtle(0, 2)}>
          Move Left
        </Button>
      </Box>
      <Button variant="contained" color="primary" onClick={() => moveTurtle(-2, 0)}>
        Move Down
      </Button>
      <Button variant="outlined" color="secondary" onClick={stopTurtle}>
        Stop
      </Button>
    </Box>
  );
}

export default TurtleControls;
