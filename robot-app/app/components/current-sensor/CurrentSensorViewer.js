"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function CurrentSensorViewer() {
  const mount = useRef(null);

  useEffect(() => {
    const container = mount.current;
    if (!container) return;

    // ─── Renderer ─────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const scene    = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // calculate size
    const onResize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    container.appendChild(renderer.domElement);

    // ─── Camera & Controls ────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 1.2, 2.5);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 1;
    controls.maxDistance = 5;

    // ─── Lights ───────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(2, 5, 2);
    scene.add(dirLight);

    // ─── Helpers ──────────────────────────────────────────────────────
    scene.add(new THREE.AxesHelper(1.5));
    scene.add(new THREE.GridHelper(10, 20, 0x888888, 0xcccccc));

    // ─── Sensor Dial Group ────────────────────────────────────────────
    const sensorGroup = new THREE.Group();

    // Base plate
    const baseMat  = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const baseGeo  = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    sensorGroup.add(baseMesh);

    // Dial face (semi‐circle)
    const dialMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0 });
    const dialGeo = new THREE.CircleGeometry(0.28, 64, Math.PI, Math.PI);
    const dialMesh = new THREE.Mesh(dialGeo, dialMat);
    dialMesh.rotation.x = -Math.PI / 2;
    dialMesh.position.y = 0.027;
    sensorGroup.add(dialMesh);

    // Pointer
    const pointerMat = new THREE.MeshStandardMaterial({ color: 0xff3333 });
    const pointerGeo = new THREE.ConeGeometry(0.015, 0.2, 32);
    const pointerMesh = new THREE.Mesh(pointerGeo, pointerMat);
    pointerMesh.rotation.x = Math.PI;         // point toward dial
    pointerMesh.position.set(0, 0.13, 0);

    // Pivot for rotation
    const pointerPivot = new THREE.Object3D();
    pointerPivot.add(pointerMesh);
    pointerPivot.position.y = 0.05;
    sensorGroup.add(pointerPivot);

    // add all
    scene.add(sensorGroup);

    // ─── Animate Loop ─────────────────────────────────────────────────
    let frameId;
    const animate = () => {
      controls.update();

      // UPDATE POINTER HERE:
      // e.g. pointerPivot.rotation.z = someAngleInRadiansBasedOnData;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    // ─── Initial sizing & start ──────────────────────────────────────
    onResize();
    window.addEventListener("resize", onResize);
    animate();

    // ─── Cleanup ───────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
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
