"use client";


import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Box } from "@mui/material";

// Robot model generator
const createRobotModel = () => {
  const robotGroup = new THREE.Group();

  // --- Main Body ---
  const baseWidth = 0.66, baseLength = 0.91, baseHeight = 0.44;
  const baseGeometry = new THREE.BoxGeometry(baseLength, baseHeight, baseWidth);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.0,
    roughness: 0.50,
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = baseHeight / 2;
  robotGroup.add(base);

  // --- Pyramid (Trapezoidal) Top ---
  const topHeight = 0.2;
  const topGeometry = new THREE.CylinderGeometry(0.1, 0.45, topHeight, 4, 1, true);
  const topMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.30,
    roughness: 0.50,
    side: THREE.DoubleSide,
  });
  const pyramid = new THREE.Mesh(topGeometry, topMaterial);
  pyramid.rotation.y = Math.PI / 4;
  pyramid.position.y = baseHeight + topHeight / 2 - 0.04;
  robotGroup.add(pyramid);

  // --- Buttons (Red/Yellow, Blue) ---
  // Yellow Button
  const button1Geo = new THREE.BoxGeometry(0.07, 0.02, 0.07);
  const button1Mat = new THREE.MeshStandardMaterial({ color: 0xffeb3b, metalness: 0.5, roughness: 0.3 });
  const button1 = new THREE.Mesh(button1Geo, button1Mat);
  button1.position.set(0.1, baseHeight + 0.13, -0.10);
  robotGroup.add(button1);

  // Red dot on yellow button
  const buttonDotGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.011, 16);
  const buttonDotMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, metalness: 0.7, roughness: 0.2 });
  const buttonDot = new THREE.Mesh(buttonDotGeo, buttonDotMat);
  buttonDot.rotation.x = Math.PI / 2;
  buttonDot.position.set(0.1, baseHeight + 0.142, -0.10);
  robotGroup.add(buttonDot);

  // Blue Button
  const button2Mat = new THREE.MeshStandardMaterial({ color: 0x1976d2, metalness: 0.5, roughness: 0.3 });
  const button2 = new THREE.Mesh(button1Geo, button2Mat);
  button2.position.set(0.20, baseHeight + 0.13, -0.10);
  robotGroup.add(button2);

  // --- Red Dome Light ---
  const domeGeo = new THREE.SphereGeometry(0.035, 16, 16);
  const domeMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xaa0000, metalness: 0.8, roughness: 0.3 });
  const dome = new THREE.Mesh(domeGeo, domeMat);
  dome.position.set(0.16, baseHeight + topHeight + 0.02, 0.02);
  robotGroup.add(dome);

  // --- Wheels (treads simplified as cylinders) ---
  const wheelRadius = 0.09, wheelWidth = 0.055;
  const wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x5d5d5d, metalness: 0.7, roughness: 0.3 });

  [1, -1].forEach(sign => {
    for (let i = -1; i <= 1; i += 2) {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.rotation.y = Math.PI / 2;
      wheel.position.set((baseLength / 2 - 0.18) * i, wheelRadius, (baseWidth / 2 + 0.025) * sign);
      robotGroup.add(wheel);
    }
    // Middle wheel
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.rotation.y = Math.PI / 2;
    wheel.position.set(0, wheelRadius, (baseWidth / 2 + 0.025) * sign);
    robotGroup.add(wheel);
  });

  // --- Side LiDAR Sensors ---
  const lidarGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.15, 16);
  const lidarMat = new THREE.MeshStandardMaterial({ color: 0x363636, metalness: 0.6, roughness: 0.25 });
  // Left
  const lidarLeft = new THREE.Mesh(lidarGeo, lidarMat);
  lidarLeft.rotation.x = Math.PI / 2;
  lidarLeft.position.set(baseLength / 2 + 0.045, baseHeight * 0.6, 0.21);
  robotGroup.add(lidarLeft);
  // Right
  const lidarRight = new THREE.Mesh(lidarGeo, lidarMat);
  lidarRight.rotation.x = Math.PI / 2;
  lidarRight.position.set(-(baseLength / 2 + 0.045), baseHeight * 0.6, -0.21);
  robotGroup.add(lidarRight);

  return robotGroup;
};

export default function RobotViewer() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2.8;
    camera.position.y = 1.6;
    camera.lookAt(0, 0.3, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );

    // Prevent duplicate canvases
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    mountRef.current.appendChild(renderer.domElement);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;

    // Helpers
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    // Robot model
    const robotBody = createRobotModel();
    scene.add(robotBody);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(3, 10, 5);
    scene.add(directionalLight);

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
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

  return (
    <>
      <Box
        ref={mountRef}
        sx={{
          width: "100%",
          height: { xs: "350px", md: "500px" },
          minHeight: "320px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>
          SHANTI
        </span>
      </Box>
    </>
  );
}
