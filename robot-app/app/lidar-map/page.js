"use client";

import ConnectionStatus  from "@/components/ros/ConnectionStatus";
import LidarPointCloud   from "@/components/lidar/LidarPointCloud";

export default function RosConnectionPage() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ConnectionStatus />
      <LidarPointCloud />
    </div>
  );
}
