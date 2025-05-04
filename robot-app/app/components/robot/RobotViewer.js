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

  // Create a simple robot model
  const createRobotModel = () => {
    const robotGroup = new THREE.Group();

    // Robot base (chassis)
    const baseGeometry = new THREE.BoxGeometry(1.5, 0.3, 2);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x3a86ff });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.15;
    robotGroup.add(base);

    // Robot body
    const bodyGeometry = new THREE.BoxGeometry(1, 0.8, 1.2);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8338ec });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.7;
    robotGroup.add(body);

    // Robot head
    const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xff006e });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.3;
    head.position.z = 0.2;
    robotGroup.add(head);

    // Robot wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x212529 });

    const positions = [
      [-0.85, 0.3, 0.7],
      [0.85, 0.3, 0.7],
      [-0.85, 0.3, -0.7],
      [0.85, 0.3, -0.7],
    ];

    positions.forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, y, z);
      robotGroup.add(wheel);
    });

    // Add a sensor on top (represents LIDAR or camera)
    const sensorGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const sensorMaterial = new THREE.MeshStandardMaterial({ color: 0xfb5607 });
    const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
    sensor.position.y = 1.2;
    robotGroup.add(sensor);

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
