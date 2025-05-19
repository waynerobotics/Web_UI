"use client";

import { Box, Typography } from "@mui/material";
import MainLayout from "../../components/layout/MainLayout";
import SettingsForm from "../../components/settings/SettingsForm";

export default function SettingsPage() {
  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Box sx={{ mt: 2 }}>
        <SettingsForm />
      </Box>
    </MainLayout>
  );
}
