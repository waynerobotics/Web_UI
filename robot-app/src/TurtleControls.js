import React, { useState } from "react";
import { Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDown, faCircleUp, faCircleRight, faCircleLeft, faStopCircle } from "@fortawesome/free-solid-svg-icons";

const moveTurtle = (x, y) => {
  console.log(`Move turtle by x:${x}, y:${y}`);
};

const stopTurtle = () => {
  console.log("Stop turtle");
};

function TurtleControls() {
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonPress = (button) => {
    setActiveButton(button);
  };

  const handleButtonRelease = () => {
    setActiveButton(null);
  };

  const buttonStyles = (button) => ({
    cursor: "pointer",
    transform: activeButton === button ? "scale(0.9)" : "scale(1)", 
    transition: "transform 0.1s ease-in-out", 
  });

  return (
    <Box 
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        justifyContent: "center",
       
      }}
    >
      <div
        onMouseDown={() => {
          handleButtonPress("up");
          moveTurtle(0, 2);
        }}
        onMouseUp={handleButtonRelease}
        onMouseLeave={handleButtonRelease}
        onTouchStart={() => {
          handleButtonPress("up");
          moveTurtle(0, 2);
        }}
        onTouchEnd={handleButtonRelease}
        onTouchCancel={handleButtonRelease}
        style={buttonStyles("up")}
        aria-label="Move Up"
      >
        <FontAwesomeIcon icon={faCircleUp} style={{ color: "#0ebe11", fontSize: "48px" }} />
      </div>

      <Box
        sx={{
          display: "flex",
          gap: 2,
         
        }}
      >
        <div
          onMouseDown={() => {
            handleButtonPress("left");
            moveTurtle(-2, 0);
          }}
          onMouseUp={handleButtonRelease}
          onMouseLeave={handleButtonRelease}
          onTouchStart={() => {
            handleButtonPress("left");
            moveTurtle(-2, 0);
          }}
          onTouchEnd={handleButtonRelease}
          onTouchCancel={handleButtonRelease}
          style={buttonStyles("left")}
          aria-label="Move Left"
        >
          <FontAwesomeIcon icon={faCircleLeft} style={{ color: "#0ebe11", fontSize: "48px" }} />
        </div>

        <div
          onMouseDown={() => {
            handleButtonPress("stop");
            stopTurtle();
          }}
          onMouseUp={handleButtonRelease}
          onMouseLeave={handleButtonRelease}
          onTouchStart={() => {
            handleButtonPress("stop");
            stopTurtle();
          }}
          onTouchEnd={handleButtonRelease}
          onTouchCancel={handleButtonRelease}
          style={buttonStyles("stop")}
          aria-label="Stop"
        >
          <FontAwesomeIcon icon={faStopCircle} style={{ color: "#d60000", fontSize: "48px" }} />
        </div>

        <div
          onMouseDown={() => {
            handleButtonPress("right");
            moveTurtle(2, 0);
          }}
          onMouseUp={handleButtonRelease}
          onMouseLeave={handleButtonRelease}
          onTouchStart={() => {
            handleButtonPress("right");
            moveTurtle(2, 0);
          }}
          onTouchEnd={handleButtonRelease}
          onTouchCancel={handleButtonRelease}
          style={buttonStyles("right")}
          aria-label="Move Right"
        >
          <FontAwesomeIcon icon={faCircleRight} style={{ color: "#0ebe11", fontSize: "48px" }} />
        </div>
      </Box>

      <div
        onMouseDown={() => {
          handleButtonPress("down");
          moveTurtle(0, -2);
        }}
        onMouseUp={handleButtonRelease}
        onMouseLeave={handleButtonRelease}
        onTouchStart={() => {
          handleButtonPress("down");
          moveTurtle(0, -2);
        }}
        onTouchEnd={handleButtonRelease}
        onTouchCancel={handleButtonRelease}
        style={buttonStyles("down")}
        aria-label="Move Down"
      >
        <FontAwesomeIcon icon={faCircleDown} style={{ color: "#0ebe11", fontSize: "48px" }} />
      </div>
    </Box>
  );
}

export default TurtleControls;
