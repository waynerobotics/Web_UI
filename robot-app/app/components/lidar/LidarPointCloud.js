"use client";

import ROSLIB from "roslib";
import ros from "@/lib/ros";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

export default function LidarPointCloud({ useMock = true }) {
  const mountRef = useRef(null);

  useEffect(() => {
    let listener = null;
    let animationId = null;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 6);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.GridHelper(10, 10, 0x444444, 0x888888));
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Create point cloud geometry and material
    const maxPoints = 5000;
    const geom = new THREE.BufferGeometry();
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
      let i = 0;
      for (let x = -5; x <= 5; x += 0.3) {
        for (let z = -5; z <= 5; z += 0.3) {
          const y = 1 + 0.2 * Math.sin(x + tick * 0.01 + z);
          if (i >= maxPoints) break;

          positions[i * 3] = x;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = z;

          const color = new THREE.Color();
          color.setHSL((1 - y / 3), 1, 0.5); // height based
          colors[i * 3] = color.r;
          colors[i * 3 + 1] = color.g;
          colors[i * 3 + 2] = color.b;

          i++;
        }
      }
      geom.setDrawRange(0, i);
      geom.attributes.position.needsUpdate = true;
      geom.attributes.color.needsUpdate = true;
    }

    function updateRealPoints(msg) {
      const pts = parsePointCloud2(msg);
      const pos = geom.attributes.position.array;
      const col = geom.attributes.color.array;

      for (let i = 0; i < pts.length && i < maxPoints; i++) {
        const { x, y, z } = pts[i];
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;

        const color = new THREE.Color();
        color.setHSL((1 - y / 5), 1, 0.5);
        col[i * 3] = color.r;
        col[i * 3 + 1] = color.g;
        col[i * 3 + 2] = color.b;
      }

      geom.setDrawRange(0, Math.min(pts.length, maxPoints));
      geom.attributes.position.needsUpdate = true;
      geom.attributes.color.needsUpdate = true;
    }

    let tick = 0;
    const animate = () => {
      controls.update();
      if (useMock) {
        updateMockRoomScan(tick);
        tick++;
      }
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    if (!useMock) {
      listener = new ROSLIB.Topic({
        ros,
        name: "/unilidar/cloud",
        messageType: "sensor_msgs/PointCloud2",
        throttle_rate: 30,
      });
      listener.subscribe(updateRealPoints);
    }

    const handleResize = () => {
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      listener?.unsubscribe();
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      if (
        mountRef.current &&
        renderer.domElement.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [useMock]);

  return <Box ref={mountRef} sx={{ width: "100%", height: "100%" }} />;
}

function parsePointCloud2(msg) {
  const { width, height, point_step, is_bigendian, data: b64 } = msg;
  const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const view = new DataView(bin.buffer);
  const little = !is_bigendian;
  const n = width * height;
  const out = new Array(n);

  for (let i = 0; i < n; i++) {
    const off = i * point_step;
    const x = view.getFloat32(off, little);
    const y = view.getFloat32(off + 4, little);
    const z = view.getFloat32(off + 8, little);
    out[i] = { x, y, z };
  }
  return out;
}
