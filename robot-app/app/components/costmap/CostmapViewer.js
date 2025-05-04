"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function CostmapViewer() {
  const mount = useRef(null);

  useEffect(() => {
    const container = mount.current;
    if (!container) return;

    // ─── Renderer ─────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // ─── Scene & Camera ───────────────────────────────────────────────
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

    // ─── Orbit Controls ───────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);

    // ─── Lights ───────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // ─── Helpers ──────────────────────────────────────────────────────
    scene.add(new THREE.GridHelper(10, 10, 0x888888, 0xcccccc));
    scene.add(new THREE.AxesHelper(1));

    // ─── Costmap Cells ────────────────────────────────────────────────
    const costGroup = new THREE.Group();
    const size = 10;
    const spacing = 1;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        // placeholder “cost” value
        const cost = Math.random(); // 0 → 1

        // map cost to height and color
        const height = 0.2 + cost * 0.8;
        const color = new THREE.Color().setHSL((1 - cost) * 0.4, 1, 0.5);

        const geo = new THREE.BoxGeometry(0.9, height, 0.9);
        const mat = new THREE.MeshStandardMaterial({ color });
        const cell = new THREE.Mesh(geo, mat);

        cell.position.set(
          i - size / 2 + 0.5,
          height / 2,
          j - size / 2 + 0.5
        );
        costGroup.add(cell);
      }
    }
    scene.add(costGroup);

    // ─── Resize Handling ──────────────────────────────────────────────
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", resize);
    resize();

    // ─── Animate Loop ────────────────────────────────────────────────
    let frameId;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // ─── Cleanup ───────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mount}
      style={{
        position: "absolute",
        top:    0,
        left:   0,
        width:  "100%",
        height: "100%",
      }}
    />
  );
}
