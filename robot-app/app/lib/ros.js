// app/lib/ros.js
import ROSLIB from "roslib";

const ROSBRIDGE_HOST = "192.168.2.102"; // ← your NUC's IP
const ROSBRIDGE_PORT = 9090; // ← default rosbridge port

// Build the WebSocket URL with exactly two slashes after "ws:"
const URL = `ws://${ROSBRIDGE_HOST}:${ROSBRIDGE_PORT}`;

console.log("🔗 connecting to rosbridge at", URL);

// Create the ROS connection instance
const ros = new ROSLIB.Ros({ url: URL });

ros.on("connection", () => console.log("✅ ROSBridge connected"));
ros.on("error", (e) => console.warn("❌ ROSBridge error:", e));
ros.on("close", () => console.log("⚠️ ROSBridge closed"));

export default ros;
