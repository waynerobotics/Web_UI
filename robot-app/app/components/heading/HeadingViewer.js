// app/components/heading/HeadingViewer.js

"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

// ← Add it here, with no “.js” extension
import { FontLoader }    from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry }  from "three/examples/jsm/geometries/TextGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// …the rest of your HeadingViewer code…

export default function HeadingViewer() {
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
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 2);

    // ─── Controls ─────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 1;
    controls.maxDistance = 5;
    controls.target.set(0, 0, 0);

    // ─── Lights ───────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // ─── Helpers ──────────────────────────────────────────────────────
    scene.add(new THREE.GridHelper(4, 8, 0x888888, 0xcccccc));

    // ─── Build the Compass ────────────────────────────────────────────
    const dialGroup = new THREE.Group();

    // Dial base
    const dialGeo  = new THREE.CircleGeometry(1, 64);
    const dialMat  = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const dialMesh = new THREE.Mesh(dialGeo, dialMat);
    dialMesh.rotation.x = -Math.PI / 2;
    dialGroup.add(dialMesh);

    // Tick marks (N/E/S/W)
    const fontLoader = new FontLoader();
    fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      ["N", "E", "S", "W"].forEach((label, i) => {
        const textGeo = new TextGeometry(label, {
          font,
          size: 0.15,
          height: 0.01,
        });
        const textMat  = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const textMesh = new THREE.Mesh(textGeo, textMat);
        const angle    = (i * Math.PI) / 2;
        textMesh.position.set(
          Math.sin(angle) * 0.8,
          0.01,
          Math.cos(angle) * 0.8
        );
        textMesh.rotation.y = -angle;
        dialGroup.add(textMesh);
      });
    });

    // Heading arrow
    const arrowDir    = new THREE.Vector3(0, 0, 1);
    const arrowOrigin = new THREE.Vector3(0, 0.02, 0);
    const headingArrow = new THREE.ArrowHelper(
      arrowDir,
      arrowOrigin,
      0.9,
      0xff3333,
      0.1,
      0.05
    );
    dialGroup.add(headingArrow);

    scene.add(dialGroup);

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

      // ███ Hook your real heading data here ███
      // const theta = THREE.MathUtils.degToRad(headingDegrees);
      // headingArrow.setDirection(
      //   new THREE.Vector3(Math.sin(theta), 0, Math.cos(theta))
      // );

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
        top:      0,
        left:     0,
        width:    "100%",
        height:   "100%",
      }}
    />
  );
}
