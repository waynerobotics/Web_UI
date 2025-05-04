"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function IMUViewer() {
  const mount = useRef(null);

  useEffect(() => {
    const container = mount.current;
    if (!container) return;

    // ─── Renderer ─────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // ─── Scene, Camera ────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(1, 1, 1);

    // ─── Controls ─────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 0.5;
    controls.maxDistance = 5;

    // ─── Lights ───────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(2, 5, 2);
    scene.add(dirLight);

    // ─── Helpers ──────────────────────────────────────────────────────
    scene.add(new THREE.GridHelper(5, 10, 0x888888, 0xcccccc));
    scene.add(new THREE.AxesHelper(1));

    // ─── IMU Group ────────────────────────────────────────────────────
    const imuGroup = new THREE.Group();

    // Central cube
    const cubeGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const cubeMat = new THREE.MeshStandardMaterial({ color: 0x2194ce });
    const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
    imuGroup.add(cubeMesh);

    // Axis arrows (red=X, green=Y, blue=Z)
    const arrowLen = 0.5;
    const xArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      arrowLen,
      0xff0000
    );
    const yArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      arrowLen,
      0x00ff00
    );
    const zArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 0),
      arrowLen,
      0x0000ff
    );
    imuGroup.add(xArrow, yArrow, zArrow);

    scene.add(imuGroup);

    // ─── Resize Handler ───────────────────────────────────────────────
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

      // TODO: when you have real IMU yaw/pitch/roll,
      // just do: imuGroup.rotation.set(pitch, yaw, roll)
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
