// app/components/lidar/LidarPointCloud.js
"use client";

import ROSLIB from "roslib";
import ros from "@/lib/ros";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export default function LidarPointCloud() {
  const mountRef = useRef(null);

  useEffect(() => {
    // ——— Three.js setup ———
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // grid + light
    scene.add(new THREE.GridHelper(10, 10, 0x444444, 0x888888));
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // ——— empty point cloud placeholder ———
    const pointCloud = createEmptyPointCloud();
    scene.add(pointCloud);

    // ——— subscribe to ROS2 PointCloud2 ———
    const listener = new ROSLIB.Topic({
      ros,
      name: "/unilidar/cloud",
      messageType: "sensor_msgs/PointCloud2",
      throttle_rate: 30,
    });
    listener.subscribe((msg) => {
      const pts = parsePointCloud2(msg);
      updateGeometry(pointCloud, pts);
    });

    // ——— render loop ———
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ——— resize handling ———
    function onResize() {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    // ——— cleanup ———
    return () => {
      listener.unsubscribe();
      window.removeEventListener("resize", onResize);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <Box ref={mountRef} sx={{ width: "100%", height: "100%" }} />;
}


// ——— helper: make a one‐point BufferGeometry so Three.js isn’t upset ———
function createEmptyPointCloud() {
  const geom = new THREE.BufferGeometry();
  const positions = new Float32Array(3);
  geom.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
  );

  const mat = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff });
  return new THREE.Points(geom, mat);
}


// ——— helper: parse ROS PointCloud2 into an array of {x,y,z} ———
function parsePointCloud2(msg) {
  const { width, height, point_step, is_bigendian, data: b64 } = msg;
  const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const view = new DataView(bin.buffer);
  const little = !is_bigendian;
  const n = width * height;
  const output = new Array(n);

  for (let i = 0; i < n; i++) {
    const off = i * point_step;
    const x = view.getFloat32(off, little);
    const y = view.getFloat32(off + 4, little);
    const z = view.getFloat32(off + 8, little);
    output[i] = { x, y, z };
  }
  return output;
}


// ——— helper: resize/reset the buffer & fill in new XYZ data ———
function updateGeometry(pointCloud, points) {
  const geom = pointCloud.geometry;
  let arr = geom.attributes.position.array;

  if (points.length * 3 !== arr.length) {
    arr = new Float32Array(points.length * 3);
    geom.setAttribute(
      "position",
      new THREE.BufferAttribute(arr, 3).setUsage(THREE.DynamicDrawUsage)
    );
  }

  for (let i = 0; i < points.length; i++) {
    const { x, y, z } = points[i];
    arr[i * 3]     = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
  }
  geom.attributes.position.needsUpdate = true;
}
