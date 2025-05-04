"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader }    from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry }  from "three/examples/jsm/geometries/TextGeometry";

export default function ModesViewer({ activeMode = 0 }) {
  const mount = useRef(null);

  useEffect(() => {
    const container = mount.current;
    if (!container) return;

    // ─── Renderer ─────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // ─── Scene & Camera ───────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 3);

    // ─── Controls ─────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);

    // ─── Lights ───────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 5, 3);
    scene.add(dirLight);

    // ─── Mode Dial Group ──────────────────────────────────────────
    const dialGroup = new THREE.Group();
    const radius = 1;
    const thickness = 0.25;
    const modes = [
      { name: "Autonomous", color: 0x33cc33 },
      { name: "Teleop",     color: 0x3366ff },
      { name: "Standby",    color: 0xffcc00 },
    ];

    // Create 3 wedge segments
    modes.forEach((m, i) => {
      const start = (i / modes.length) * Math.PI * 2;
      const end = ((i + 1) / modes.length) * Math.PI * 2;
      const shape = new THREE.Shape();
      shape.moveTo(
        (radius - thickness) * Math.cos(start),
        (radius - thickness) * Math.sin(start)
      );
      shape.absarc(0, 0, radius, start, end, false);
      shape.absarc(0, 0, radius - thickness, end, start, true);
      shape.closePath();

      const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false });
      const mat = new THREE.MeshStandardMaterial({ color: m.color });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      dialGroup.add(mesh);

      // add text label
      const loader = new FontLoader();
      loader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
        const midAngle = (start + end) / 2;
        const txtGeo = new TextGeometry(m.name, {
          font,
          size: 0.12,
          height: 0.01,
        });
        const txtMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const txtMesh = new THREE.Mesh(txtGeo, txtMat);
        txtMesh.position.set(
          Math.cos(midAngle) * (radius - thickness / 2),
          0.03,
          Math.sin(midAngle) * (radius - thickness / 2)
        );
        txtMesh.rotation.y = -midAngle;
        dialGroup.add(txtMesh);
      });
    });

    // Pointer
    const pointerPivot = new THREE.Object3D();
    const ptrMat = new THREE.MeshStandardMaterial({ color: 0xff3333 });
    const ptrGeo = new THREE.ConeGeometry(0.05, 0.2, 32);
    const ptrMesh = new THREE.Mesh(ptrGeo, ptrMat);
    ptrMesh.rotation.x = Math.PI;
    ptrMesh.position.y = 0.1;
    pointerPivot.add(ptrMesh);
    dialGroup.add(pointerPivot);

    scene.add(dialGroup);

    // ─── Resize Handler ───────────────────────────────────────────
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", resize);
    resize();

    // ─── Animate Loop ─────────────────────────────────────────────
    let frameId;
    const animate = () => {
      controls.update();

      // Rotate pointer to active mode
      const angle = ((activeMode + 0.5) / modes.length) * Math.PI * 2 - Math.PI / 2;
      pointerPivot.rotation.y = angle;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // ─── Cleanup ─────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeMode]);

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
