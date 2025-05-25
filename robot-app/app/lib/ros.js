// app/lib/ros.js
import ROSLIB from "roslib";

// const ROSBRIDGE_HOST = "192.168.2.102";  // ← your NUC’s IP
const ROSBRIDGE_HOST = "127.0.0.1"; // ← your NUC’s IP
const ROSBRIDGE_PORT = 9090; // ← default rosbridge port

// Build the WebSocket URL
const URL = `ws://${ROSBRIDGE_HOST}:${ROSBRIDGE_PORT}`;

console.log("🔗 connecting to rosbridge at", URL);
let ros = new ROSLIB.Ros({ url: URL });
let reconnectTimeout = null;

// Event handler functions (defined once to avoid duplicates)
const handleConnection = () => {
  console.log("✅ ROSBridge connected");
};

const handleError = (e) => {
  console.log("❌ ROSBridge can't connect:", e);
};

const handleClose = () => {
  console.log("⚠️ ROSBridge closed");

  // Clear any existing reconnect timeout
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
  }

  // Wait 5 seconds before reconnecting
  console.log("⏳ Waiting 5 seconds before reconnection...");
  reconnectTimeout = setTimeout(() => {
    createRosConnection();
  }, 5000);
};

function createRosConnection() {
  // Clean up existing connection if it exists
  if (ros) {
    try {
      ros.off("connection", handleConnection);
      ros.off("error", handleError);
      ros.off("close", handleClose);
      ros.close();
    } catch (err) {
      console.log("Error cleaning up previous ros connection:", err);
    }
  }

  // Create a new ros instance
  console.log("🔄 Reconnecting ROSBridge connection...");
  try {
    ros.connect(URL);
  } catch (err) {
    console.log("Connect Error:", err);
    return;
  }

  // Attach event listeners (only once per instance)
  ros.on("connection", handleConnection);
  ros.on("error", handleError);
  ros.on("close", handleClose);

  // Update the global reference
  if (typeof window !== "undefined") {
    window.ros = ros;
  }
}

// Initial connection
createRosConnection();

export default ros;
