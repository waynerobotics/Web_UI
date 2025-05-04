'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleDown,
  faCircleUp,
  faCircleRight,
  faCircleLeft,
  faStopCircle,
} from '@fortawesome/free-solid-svg-icons';

const moveTurtle = (x, y) => {
  console.log(`Move turtle by x:${x}, y:${y}`);
};

const stopTurtle = () => {
  console.log('Stop turtle');
};

export default function TurtleControls() {
  const [activeButton, setActiveButton] = useState(null);

  const handlePress = (dir, action) => {
    setActiveButton(dir);
    action();
  };

  const handleRelease = () => setActiveButton(null);

  const styleBtn = (btn) => ({
    cursor: 'pointer',
    transform: activeButton === btn ? 'scale(0.9)' : 'scale(1)',
    transition: 'transform 0.1s ease-in-out',
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div
        onMouseDown={() => handlePress('up', () => moveTurtle(0, 2))}
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        style={styleBtn('up')}
      >
        <FontAwesomeIcon icon={faCircleUp} style={{ fontSize: '48px', color: '#0ebe11' }} />
      </div>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <div
          onMouseDown={() => handlePress('left', () => moveTurtle(-2, 0))}
          onMouseUp={handleRelease}
          onMouseLeave={handleRelease}
          style={styleBtn('left')}
        >
          <FontAwesomeIcon icon={faCircleLeft} style={{ fontSize: '48px', color: '#0ebe11' }} />
        </div>

        <div
          onMouseDown={() => handlePress('stop', stopTurtle)}
          onMouseUp={handleRelease}
          onMouseLeave={handleRelease}
          style={styleBtn('stop')}
        >
          <FontAwesomeIcon icon={faStopCircle} style={{ fontSize: '48px', color: '#d60000' }} />
        </div>

        <div
          onMouseDown={() => handlePress('right', () => moveTurtle(2, 0))}
          onMouseUp={handleRelease}
          onMouseLeave={handleRelease}
          style={styleBtn('right')}
        >
          <FontAwesomeIcon icon={faCircleRight} style={{ fontSize: '48px', color: '#0ebe11' }} />
        </div>
      </Box>

      <div
        onMouseDown={() => handlePress('down', () => moveTurtle(0, -2))}
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        style={styleBtn('down')}
      >
        <FontAwesomeIcon icon={faCircleDown} style={{ fontSize: '48px', color: '#0ebe11' }} />
      </div>
    </Box>
  );
}
