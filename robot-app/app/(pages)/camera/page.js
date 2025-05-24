"use client";

import { useEffect, useRef, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Box, Typography, Button, CircularProgress, Stack, Alert, Grid } from "@mui/material";
import PhotoSphereViewer from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

// Helper for each camera window
function CameraViewer({ label, streamUrl }) {
  const viewerContainer = useRef(null);
  const viewerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let destroyed = false;
    setLoading(true);
    setConnected(false);
    setError("");

    viewerRef.current = new PhotoSphereViewer.Viewer({
      container: viewerContainer.current,
      panorama: streamUrl,
      navbar: ["autorotate", "zoom", "fullscreen"],
      useXmpData: false,
      size: { width: "100%", height: 400 },
    });

    viewerRef.current.on("ready", () => {
      if (!destroyed) {
        setLoading(false);
        setConnected(true);
      }
    });
    viewerRef.current.on("panorama-load-fail", () => {
      if (!destroyed) {
        setLoading(false);
        setConnected(false);
        setError("Could not connect to the camera. Please check your connection.");
        if (viewerContainer.current) {
          viewerContainer.current.innerHTML = "";
        }
      }
    });

    return () => {
      destroyed = true;
      if (viewerRef.current) viewerRef.current.destroy();
    };
    // eslint-disable-next-line
  }, [streamUrl]);

  const handleSnapshot = () => {
    if (viewerRef.current && viewerRef.current.canvas) {
      const dataUrl = viewerRef.current.canvas.toDataURL("image/jpeg");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${label.toLowerCase().replace(" ", "_")}_snapshot_${Date.now()}.jpg`;
      a.click();
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        p: { xs: 1, md: 2 },
        borderRadius: 2,
        boxShadow: 1,
        width: "100%",
        maxWidth: 700,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: 320,
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>{label}</Typography>
      <Stack direction="row" alignItems="center" gap={2} mb={2}>
        {loading && <CircularProgress size={22} />}
        {!loading && connected && (
          <Alert severity="success" sx={{ height: 34, py: 0 }}>Connected</Alert>
        )}
        {!loading && error && (
          <Alert severity="warning" sx={{ height: 34, py: 0 }}>{error}</Alert>
        )}
        <Button variant="outlined" onClick={handleSnapshot} disabled={!connected}>
          Snapshot
        </Button>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          Reload
        </Button>
      </Stack>
      {!error ? (
        <div
          ref={viewerContainer}
          style={{
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: 8,
            overflow: "hidden",
            background: "#eee",
            minHeight: 200,
          }}
        ></div>
      ) : (
        <Box
          sx={{
            width: "100%",
            aspectRatio: "16/9",
            minHeight: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#eee",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" align="center">
            Camera not connected.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default function DualCameraPage() {
  const frontCameraUrl = "http://192.168.2.102:8080/camera_front";
  const backCameraUrl = "http://192.168.2.102:8084/camera_back";

  return (
    <MainLayout>
      <Box sx={{ p: { xs: 1, md: 4 } }}>
        <Typography variant="h4" gutterBottom>
        <FontAwesomeIcon icon={faCamera} style={{ marginRight: 12 }} />
        Camera Views 
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CameraViewer label="Front View" streamUrl={frontCameraUrl} />
          </Grid>
          <Grid item xs={12} md={6}>
            <CameraViewer label="Back View" streamUrl={backCameraUrl} />
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
}
