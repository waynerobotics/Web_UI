"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Box } from "@mui/material";

export default function LidarPointCloud() {
  const mountRef = useRef(null);
  const [pointCloud, setPointCloud] = useState(null);

  useEffect(() => {
    // Create a new scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    // Grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0x444444);
    scene.add(gridHelper);

    // Create point cloud
    const pointCloudObj = createPointCloud();
    scene.add(pointCloudObj);
    setPointCloud(pointCloudObj);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Animation/render loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      // Update point cloud data
      if (pointCloudObj) {
        updatePointCloud(pointCloudObj);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // Create a point cloud with simulated LIDAR data
  const createPointCloud = () => {
    // Generate initial point cloud data
    const numPoints = 5000;
    const positions = new Float32Array(numPoints * 3);
    const colors = new Float32Array(numPoints * 3);

    // Fill with simulated LIDAR scan data (a cylinder shape pattern)
    for (let i = 0; i < numPoints; i++) {
      // Simulate a 360-degree LIDAR scan pattern
      const theta = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 3;
      const height = Math.random() * 2 - 1;

      // Convert to Cartesian coordinates
      const x = radius * Math.cos(theta);
      const y = height;
      const z = radius * Math.sin(theta);

      // Add some noise
      const noise = Math.random() * 0.1;

      // Set position
      positions[i * 3] = x + noise;
      positions[i * 3 + 1] = y + noise;
      positions[i * 3 + 2] = z + noise;

      // Set color based on distance
      const distance = Math.sqrt(x * x + y * y + z * z);
      const normalizedDistance = Math.min(distance / 6, 1);

      // Create a color gradient from blue (close) to red (far)
      colors[i * 3] = normalizedDistance; // R
      colors[i * 3 + 1] = 0.2; // G
      colors[i * 3 + 2] = 1 - normalizedDistance; // B
    }

    // Create geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Point material
    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    // Create point cloud
    const pointCloud = new THREE.Points(geometry, material);

    return pointCloud;
  };

  // Simulate updating the point cloud with new LIDAR data
  const updatePointCloud = (pointCloud) => {
    if (!pointCloud) return;

    const positions = pointCloud.geometry.attributes.position.array;

    // Simulate slight movement or changes in the data
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += (Math.random() - 0.5) * 0.01;
      positions[i + 1] += (Math.random() - 0.5) * 0.01;
      positions[i + 2] += (Math.random() - 0.5) * 0.01;
    }

    // Mark attributes for update
    pointCloud.geometry.attributes.position.needsUpdate = true;
  };

  return <Box ref={mountRef} sx={{ width: "100%", height: "100%" }} />;
}
