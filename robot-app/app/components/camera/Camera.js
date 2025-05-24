"use client";

import { useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Box, Typography } from "@mui/material";
import PhotoSphereViewer from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";

export default function CameraPage() {
  const viewerRef = useRef(null);
  const streamUrl = "http://<YOUR_CAMERA_IP>:8080/stream?topic=/camera/image_raw"; // Change to your live 360 camera stream

  useEffect(() => {
    if (viewerRef.current && viewerRef.current.viewer) {
      viewerRef.current.viewer.destroy();
    }
    viewerRef.current.viewer = new PhotoSphereViewer.Viewer({
      container: viewerRef.current,
      panorama: streamUrl,
      navbar: ["autorotate", "zoom", "fullscreen"],
      loadingImg: null,
      useXmpData: false,
      size: { width: "100%", height: 500 },
    });

    return () => {
      if (viewerRef.current && viewerRef.current.viewer) {
        viewerRef.current.viewer.destroy();
      }
    };
  }, [streamUrl]);

  return (
    <MainLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Camera View,icon: faCamera 
        </Typography>
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
            width: "100%",
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          <div
            ref={viewerRef}
            style={{ width: "100%", height: 500, borderRadius: 8, overflow: "hidden" }}
          ></div>
        </Box>
      </Box>
    </MainLayout>
  );
}
