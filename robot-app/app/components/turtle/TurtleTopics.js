'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const getTurtleTopics = () => {
  console.log('Getting topics...');
};

export default function TurtleTopics() {
  return (
    <Box sx={{ textAlign: 'center', mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Available Turtle Topics
      </Typography>
      <Button variant="contained" color="primary" onClick={getTurtleTopics}>
        Update Topic List
      </Button>
    </Box>
  );
}
