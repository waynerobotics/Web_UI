import { Box, Typography } from "@mui/material";
import RosConnection from "../../components/ros/ConnectionStatus";
import MainLayout from "../../components/layout/MainLayout";

export default function RosConnectionPage() {
  return (
    <MainLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          ROS2 Connection
        </Typography>
        <Box
          sx={{
            height: 500,
            bgcolor: "background.paper",
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RosConnection />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            If you see "Disconnected" or "Error", please check if you're on the
            robot's internal Wi-Fi network.
          </Typography>
        </Box>
      </Box>
    </MainLayout>
  );
}
