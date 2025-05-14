"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Box } from "@mui/material";

export default function RobotViewer() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Create a new scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

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

    // ✅ Prevent duplicate canvases
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    mountRef.current.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    // Grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Axis helper
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    // Create simple robot model (placeholder)
    const robotBody = createRobotModel();
    scene.add(robotBody);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Animation/render loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
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
  // Create a robot model based on the URDF description
  const createRobotModel = () => {
    const robotGroup = new THREE.Group();

    // Robot dimensions from URDF (converted to a reasonable scale for Three.js)
    const baseWidth = 0.66;
    const baseLength = 0.91;
    const baseHeight = 0.635;
    const wheelRadius = 0.1;
    const wheelWidth = 0.076;

    // Robot base (chassis)
    const baseGeometry = new THREE.BoxGeometry(
      baseLength,
      baseHeight,
      baseWidth
    );
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff }); // Cyan
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = baseHeight / 2;
    robotGroup.add(base);

    // Robot wheels (6 wheels - 3 on each side)
    const wheelGeometry = new THREE.CylinderGeometry(
      wheelRadius,
      wheelRadius,
      wheelWidth,
      16
    );
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Gray

    // Wheel positions based on URDF (left side)
    const leftWheelPositions = [
      [-baseLength / 2 + 0.2, wheelRadius, baseWidth / 2 + 0.025], // front left
      [0, wheelRadius, baseWidth / 2 + 0.025], // middle left
      [baseLength / 2 - 0.2, wheelRadius, baseWidth / 2 + 0.025], // back left
    ];

    // Wheel positions (right side)
    const rightWheelPositions = [
      [-baseLength / 2 + 0.2, wheelRadius, -(baseWidth / 2 + 0.025)], // front right
      [0, wheelRadius, -(baseWidth / 2 + 0.025)], // middle right
      [baseLength / 2 - 0.2, wheelRadius, -(baseWidth / 2 + 0.025)], // back right
    ];

    // Add left wheels
    leftWheelPositions.forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.x = Math.PI / 2; // Rotate to align with correct axis
      wheel.position.set(x, y, z);
      robotGroup.add(wheel);
    });

    // Add right wheels
    rightWheelPositions.forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.x = Math.PI / 2; // Rotate to align with correct axis
      wheel.position.set(x, y, z);
      robotGroup.add(wheel);
    });

    // LiDAR sensors (front left and back right)
    const lidarGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.1, 16);
    const lidarMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 }); // Dark gray

    // Front left LiDAR
    const frontLeftLidar = new THREE.Mesh(lidarGeometry, lidarMaterial);
    frontLeftLidar.position.set(
      baseLength / 2 - 0.1,
      baseHeight,
      baseWidth / 2 - 0.1
    );
    robotGroup.add(frontLeftLidar);

    // Back right LiDAR
    const backRightLidar = new THREE.Mesh(lidarGeometry, lidarMaterial);
    backRightLidar.position.set(
      -baseLength / 2 + 0.1,
      baseHeight,
      -baseWidth / 2 + 0.1
    );
    robotGroup.add(backRightLidar);

    // IMU sensor representation
    const imuGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const imuMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Green
    const imu = new THREE.Mesh(imuGeometry, imuMaterial);
    imu.position.set(0, baseHeight + 0.05, 0); // Positioned on top of the base
    robotGroup.add(imu);

    // GPS sensor representation
    const gpsGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const gpsMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red
    const gps = new THREE.Mesh(gpsGeometry, gpsMaterial);
    gps.position.set(0, baseHeight + 0.1, 0); // Positioned on top of the IMU
    robotGroup.add(gps);

    return robotGroup;
  };

  return (
    <Box
      ref={mountRef}
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
}
