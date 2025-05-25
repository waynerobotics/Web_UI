"use client";

import ROSLIB from "roslib";
import ros from "@/lib/ros";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export default function LidarPointCloud({ useMock = true }) {
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only initialize Three.js after component is mounted on client
    if (!isMounted || !mountRef.current) {
      return;
    }

    let listener = null;
    let animationId = null;
    let isCleanedUp = false;
    let scene, camera, renderer, controls, geom;

    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);

      // Get dimensions with fallback values
      const width = mountRef.current.clientWidth || 800;
      const height = mountRef.current.clientHeight || 600;

      if (width === 0 || height === 0) {
        setError("Container has zero dimensions");
        setIsLoading(false);
        return;
      }

      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 2, 6);
      camera.lookAt(0, 1, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);

      // Safely append renderer to DOM
      if (mountRef.current && !mountRef.current.contains(renderer.domElement)) {
        mountRef.current.appendChild(renderer.domElement);
      }

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      scene.add(new THREE.GridHelper(10, 10, 0x444444, 0x888888));
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));

      // Create point cloud geometry and material
      const maxPoints = 5000;
      geom = new THREE.BufferGeometry();
      const positions = new Float32Array(maxPoints * 3);
      const colors = new Float32Array(maxPoints * 3);
      geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        sizeAttenuation: true,
      });
      const cloud = new THREE.Points(geom, mat);
      scene.add(cloud);

      function updateMockRoomScan(tick = 0) {
        try {
          let i = 0;
          for (let x = -5; x <= 5; x += 0.3) {
            for (let z = -5; z <= 5; z += 0.3) {
              const y = 1 + 0.2 * Math.sin(x + tick * 0.01 + z);
              if (i >= maxPoints) break;

              positions[i * 3] = x;
              positions[i * 3 + 1] = y;
              positions[i * 3 + 2] = z;

              const color = new THREE.Color();
              color.setHSL(1 - y / 3, 1, 0.5); // height based
              colors[i * 3] = color.r;
              colors[i * 3 + 1] = color.g;
              colors[i * 3 + 2] = color.b;

              i++;
            }
          }
          geom.setDrawRange(0, i);
          geom.attributes.position.needsUpdate = true;
          geom.attributes.color.needsUpdate = true;
        } catch (error) {
          console.error("Error in updateMockRoomScan:", error);
        }
      }

      function updateRealPoints(msg) {
        try {
          const pts = parsePointCloud2(msg);
          const pos = geom.attributes.position.array;
          const col = geom.attributes.color.array;

          for (let i = 0; i < pts.length && i < maxPoints; i++) {
            const { x, y, z } = pts[i];
            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            const color = new THREE.Color();
            color.setHSL(1 - y / 5, 1, 0.5);
            col[i * 3] = color.r;
            col[i * 3 + 1] = color.g;
            col[i * 3 + 2] = color.b;
          }

          geom.setDrawRange(0, Math.min(pts.length, maxPoints));
          geom.attributes.position.needsUpdate = true;
          geom.attributes.color.needsUpdate = true;
        } catch (error) {
          console.error("Error in updateRealPoints:", error);
        }
      }

      let tick = 0;
      const animate = () => {
        try {
          // Prevent animation if component is cleaned up
          if (isCleanedUp) return;

          controls.update();
          if (useMock) {
            updateMockRoomScan(tick);
            tick++;
          }
          renderer.render(scene, camera);
          animationId = requestAnimationFrame(animate);
        } catch (error) {
          console.error("Error in animation loop:", error);
          // Don't continue animation if there's an error
          isCleanedUp = true;
        }
      };

      animate();

      if (!useMock) {
        try {
          listener = new ROSLIB.Topic({
            ros,
            name: "/unilidar/cloud",
            messageType: "sensor_msgs/PointCloud2",
            throttle_rate: 30,
          });
          listener.subscribe(updateRealPoints);
        } catch (error) {
          console.error("Error setting up ROS listener:", error);
          // Fall back to mock mode if ROS setup fails
          // The component will continue to work with mock data
        }
      }

      // Set loading to false and clear any errors once everything is initialized
      setIsLoading(false);
      setError(null);

      const handleResize = () => {
        if (!mountRef.current || isCleanedUp) return;

        const w = mountRef.current.clientWidth || 800;
        const h = mountRef.current.clientHeight || 600;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        // Mark as cleaned up to prevent further animation frames
        isCleanedUp = true;

        // Clean up ROS listener
        if (listener) {
          listener.unsubscribe();
          listener = null;
        }

        // Cancel animation frame
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }

        // Remove event listener
        window.removeEventListener("resize", handleResize);

        // Clean up Three.js objects
        if (controls) {
          controls.dispose();
        }

        // Remove renderer from DOM safely
        if (
          mountRef.current &&
          renderer &&
          renderer.domElement &&
          renderer.domElement.parentNode === mountRef.current
        ) {
          mountRef.current.removeChild(renderer.domElement);
        }

        // Dispose of Three.js resources
        if (renderer) {
          renderer.dispose();
        }

        if (scene) {
          // Dispose of geometries and materials
          scene.traverse((object) => {
            if (object.geometry) {
              object.geometry.dispose();
            }
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((material) => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          });
          scene.clear();
        }
      };
    } catch (error) {
      console.error("Error initializing Three.js scene:", error);
      setError(`Failed to initialize 3D scene: ${error.message}`);
      setIsLoading(false);
    }
  }, [useMock, isMounted]);

  // Don't render anything until mounted on client
  if (!isMounted) {
    return (
      <Box
        ref={mountRef}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2">Initializing...</Typography>
      </Box>
    );
  }

  // Render loading state
  if (isLoading) {
    return (
      <Box
        ref={mountRef}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2">Loading LIDAR visualization...</Typography>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box
        ref={mountRef}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
          color: "error.main",
        }}
      >
        <Typography variant="h6">Error</Typography>
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }

  return <Box ref={mountRef} sx={{ width: "100%", height: "100%" }} />;
}

function parsePointCloud2(msg) {
  try {
    const { width, height, point_step, is_bigendian, data: b64 } = msg;

    // Validate input
    if (!b64 || !width || !height || !point_step) {
      console.warn("Invalid PointCloud2 message:", msg);
      return [];
    }

    const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const view = new DataView(bin.buffer);
    const little = !is_bigendian;
    const n = width * height;
    const out = new Array(n);

    for (let i = 0; i < n; i++) {
      const off = i * point_step;

      // Check bounds
      if (off + 12 > bin.length) {
        console.warn("Point cloud data truncated at point", i);
        return out.slice(0, i);
      }

      const x = view.getFloat32(off, little);
      const y = view.getFloat32(off + 4, little);
      const z = view.getFloat32(off + 8, little);

      // Filter out invalid points
      if (
        isNaN(x) ||
        isNaN(y) ||
        isNaN(z) ||
        !isFinite(x) ||
        !isFinite(y) ||
        !isFinite(z)
      ) {
        continue;
      }

      out[i] = { x, y, z };
    }
    return out.filter(Boolean); // Remove undefined entries
  } catch (error) {
    console.error("Error parsing PointCloud2:", error);
    return [];
  }
}
