// app/team/page.js

"use client";
import { Box, Typography, Card, CardContent, Avatar, Grid, Divider, Chip } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import SchoolIcon from '@mui/icons-material/School';
import MainLayout from "@/components/layout/MainLayout";

const teamGroups = [
  {
    title: "Board of Directors",
    members: [
      { name: "Blaine Oania"},
      { name: "Jaideep Siva"},
      { name: "Lucas Frazer"},
      { name: "Adrian Tlatelpa"},
      { name: "Rupesh Kanna"},
      { name: "Daniel Lord"},
      
    ],
  },
  {
    title: "Software Team",
    members: [
      { name: "Hamsini Gupta" },
      { name: "Jean Dilloway" },
      { name: "Kalaivani Elavazhuti" },
      { name: "Laxmi Shankar" },
      { name: "Nathan Chantiny" },
      { name: "Naznin Nesha" },
      { name: "Ryan Ross" },
      { name: "Syeda Ahmed" },
      { name: "Yihao Cai" },
    ],
  },
  {
    title: "Electrical Team",
    members: [
        { name: "Akash Patel" },
        { name: "Augustine Garcia" },
        { name: "Gokula Kumaran" },
        { name: "Salem Al Hadrusi" },
        { name: "Valentine Borjas" },
    ],
  },
  {
    title: "Hardware Team",
    members: [
        { name: "Aisha Mazloum" },
        { name: "Hadi Mhanna" },
        { name: "Mehreen Farooqi" },
        { name: "Roelle Delos Reyes" },
    ],
  },
];

const supervisor = { name: "Professor Abhilash Pandya", avatar: null };

export default function TeamPage() {
  return (
      <MainLayout>
        <Box sx={{
            maxWidth: 820,
            mx: "auto",
            mt: 6,
            px: { xs: 2, sm: 4 },
            py: 5,
            background: "rgba(255,255,255,0.8)",
            borderRadius: 4,
            boxShadow: 6,
            backdropFilter: "blur(4px)"
    }}>
      {/* WIntelligent Ground Vehicle Competition 2025 badge */}
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Chip
          icon={<StarIcon sx={{ color: "#ffd700" }} />}
          label="Intelligent Ground Vehicle Competition 2025"
          sx={{
            fontWeight: "bold",
            bgcolor: "#fffde7",
            color: "#222",
            mb: 2,
            px: 2,
            py: 1,
            fontSize: 18,
            borderRadius: "12px",
            boxShadow: 2,
          }}
        />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Wayne State University
        </Typography>
        <Typography variant="h5" fontWeight="bold" color="text.secondary" sx={{ mb: 2 }}>
          Warrior Robotics
        </Typography>
      </Box>
      {/* Team groups */}
      {teamGroups.map((group, idx) => (
        <Box key={idx} sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {group.title}
          </Typography>
          <Grid container spacing={3}>
            {group.members.map((member, id) => (
              <Grid item xs={12} sm={6} md={4} key={id}>
                <Card sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRadius: 3,
                  boxShadow: 3,
                  minHeight: 140,
                  background: "rgba(250,250,250,0.98)"
                }}>
                  <Avatar
                    alt={member.name}
                    src={member.avatar}
                    sx={{ width: 56, height: 56, mb: 1.5, bgcolor: "primary.light", fontSize: 24 }}
                  >
                    {member.name.split(" ").map(w => w[0]).join("")}
                  </Avatar>
                  <CardContent sx={{ p: 0, textAlign: "center" }}>
                    <Typography variant="body1" fontWeight="bold">{member.name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
      {/* Supervisor */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Supervisor
        </Typography>
        <Card sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 3,
          boxShadow: 3,
          minHeight: 140,
          background: "rgba(240,240,250,0.98)"
        }}>
          <Avatar
            alt={supervisor.name}
            src={supervisor.avatar}
            sx={{ width: 56, height: 56, mb: 1.5, bgcolor: "secondary.light", fontSize: 24 }}
          >
            <SchoolIcon sx={{ fontSize: 32, color: "#1976d2" }} />
          </Avatar>
          <CardContent sx={{ p: 0, textAlign: "center" }}>
            <Typography variant="body1" fontWeight="bold">{supervisor.name}</Typography>
            <Typography variant="caption" color="text.secondary">Project Supervisor</Typography>
          </CardContent>
        </Card>
      </Box>
      <Divider sx={{ my: 4 }} />
      <Typography variant="caption" display="block" align="center" color="text.secondary">
        &copy; {new Date().getFullYear()} Jean Dilloway.<br />
        Content copyright of Warrior Robotics.
      </Typography>
    </Box>
    </MainLayout>
  );
}
