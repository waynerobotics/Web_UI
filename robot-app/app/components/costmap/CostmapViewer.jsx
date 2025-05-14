"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Props:
 * - useMock (bool): If true, renders mock data. If false, expects ROS2 data connection.
 * - showLocal (bool): Whether to show local costmap (mocked).
 * - showGlobal (bool): Whether to show global costmap (mocked).
 */
export default function CostmapViewer({ useMock = true, showLocal = true, showGlobal = true }) {
  const mount = useRef(null);

  useEffect(() => {
    const container = mount.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    scene.add(new THREE.GridHelper(20, 20, 0x888888, 0xcccccc));
    scene.add(new THREE.AxesHelper(2));

    const globalGroup = new THREE.Group();
    const localGroup = new THREE.Group();
    const robotGroup = new THREE.Group();
    scene.add(globalGroup);
    scene.add(localGroup);
    scene.add(robotGroup);

    function generateMockCostmap(group, size, colorFn, yOffset = 0.01) {
      group.clear();
      const spacing = 1;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const cost = Math.random();
          const height = 0.1 + cost * 0.4;
          const color = colorFn(cost);
          const geo = new THREE.BoxGeometry(0.9, height, 0.9);
          const mat = new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.7 });
          const cell = new THREE.Mesh(geo, mat);
          cell.position.set(i - size / 2 + 0.5, height / 2 + yOffset, j - size / 2 + 0.5);
          group.add(cell);
        }
      }
    }

    function renderMockRobot() {
      robotGroup.clear();

      // Main square base
      const baseGeo = new THREE.BoxGeometry(0.6, 0.2, 0.6);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x156289 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.1;
      robotGroup.add(baseMesh);

      // LIDAR/sensor on top
      const lidarGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32);
      const lidarMat = new THREE.MeshStandardMaterial({ color: 0xff4444 });
      const lidarMesh = new THREE.Mesh(lidarGeo, lidarMat);
      lidarMesh.position.set(0, 0.25, 0);
      robotGroup.add(lidarMesh);
    }

    if (useMock) {
      if (showGlobal) {
        generateMockCostmap(globalGroup, 10, (cost) =>
          new THREE.Color().setHSL((1 - cost) * 0.4, 1, 0.4)
        );
      }
      if (showLocal) {
        generateMockCostmap(localGroup, 6, (cost) =>
          new THREE.Color().setHSL(0.1 + (1 - cost) * 0.3, 1, 0.6),
          0.05
        );
      }
      renderMockRobot();
    } else {
      // TODO: Setup ROS connection and subscribe to real topics here
      console.warn("ROS mode not implemented yet");
    }

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", resize);
    resize();

    let frameId;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [useMock, showLocal, showGlobal]);

  return (
    <div
      ref={mount}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}
