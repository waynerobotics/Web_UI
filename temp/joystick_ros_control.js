// Canvas for drawing turtle
var turtlePosition = { x: 0, y: 0, theta: 0 };
var canvas, ctx;
var turtleImage = new Image();
turtleImage.src = "images/turtle.png";

// ROS Variables and connections
var cmdVelTopic;
var poseSub;

// Three.js variables for point cloud visualization
var scene, camera, renderer, controls;
var pointCloud;
var pointCloudActive = false;
var pointCloudSubscriber;
var pointCloudUpdateInterval;
var latestPointCloudMessage = null;

// Connect to ROS
var ros = new ROSLIB.Ros({
  url: "ws://192.168.2.102:9090",
});

ros.on("connection", function () {
  console.log("Connected to websocket server.");
  initPointCloudVisualization();
});

ros.on("error", function (error) {
  console.log("Error connecting to websocket server: ", error);
});

ros.on("close", function () {
  console.log("Connection to websocket server closed.");
});

// Subscribe to the pose topic
function subscribeToPose() {
  poseSub = new ROSLIB.Topic({
    ros: ros,
    name: "/turtle1/pose",
    messageType: "turtlesim/msg/Pose",
  });

  poseSub.subscribe(function (message) {
    turtlePosition.x = message.x;
    turtlePosition.y = message.y;
    turtlePosition.theta = message.theta;
    drawTurtle();
  });
}

// Initialize the cmd_vel topic
function initCmdVelTopic() {
  cmdVelTopic = new ROSLIB.Topic({
    ros: ros,
    name: "/turtle1/cmd_vel",
    messageType: "geometry_msgs/msg/Twist",
  });
}

// Move the turtle
function moveTurtle(linearX, angularZ) {
  if (!cmdVelTopic) {
    initCmdVelTopic();
  }

  var twist = new ROSLIB.Message({
    linear: {
      x: linearX,
      y: 0.0,
      z: 0.0,
    },
    angular: {
      x: 0.0,
      y: 0.0,
      z: angularZ,
    },
  });

  cmdVelTopic.publish(twist);
}

// Stop the turtle
function stopTurtle() {
  moveTurtle(0, 0);
}

// Draw the turtle on the canvas
function drawTurtle() {
  if (!canvas) {
    canvas = document.getElementById("turtleCanvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
  }

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Scale from turtlesim coordinates to canvas coordinates
  const scaleX = canvas.width / 11;
  const scaleY = canvas.height / 11;
  const x = turtlePosition.x * scaleX;
  const y = canvas.height - turtlePosition.y * scaleY;

  // Draw a circle at the turtle position
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-turtlePosition.theta);

  // Draw turtle image if loaded, otherwise draw a triangle
  if (turtleImage.complete) {
    ctx.drawImage(turtleImage, -15, -15, 30, 30);
  } else {
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-10, -7);
    ctx.lineTo(-10, 7);
    ctx.closePath();
    ctx.fillStyle = "green";
    ctx.fill();
  }

  ctx.restore();
}

// Function to get and display the list of topics
function getTurtleTopics() {
  console.log("Getting topics...");
  ros.getTopics(function (topicsResponse) {
    // Clear existing topics
    document.getElementById("topicList").innerHTML = "";

    // Add each topic to the list
    if (Array.isArray(topicsResponse.topics)) {
      topicsResponse.topics.forEach(function (topic) {
        let listItem = document.createElement("li");
        listItem.textContent = topic;
        document.getElementById("topicList").appendChild(listItem);
      });
    }
  });
}

// Initialize Three.js scene for point cloud visualization
function initPointCloudVisualization() {
  // Create a scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Create a camera
  camera = new THREE.PerspectiveCamera(
    75, // field of view
    1, // aspect ratio (width/height)
    0.1, // near clipping plane
    1000 // far clipping plane
  );
  camera.position.z = 5;

  // Create a renderer
  const container = document.getElementById("pointCloudContainer");
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Add orbit controls for mouse interaction
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Add smooth damping
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;
  controls.maxPolarAngle = Math.PI; // Allow full rotation
  controls.minDistance = 1;
  controls.maxDistance = 50;
  controls.target.set(0, 0, 0);

  // Add axes helper
  const axesHelper = new THREE.AxesHelper(2);
  scene.add(axesHelper);

  // Create empty point cloud
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
  });

  pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);

  // Start animation loop
  animate();

  // Handle window resize
  window.addEventListener("resize", onWindowResize);
}

// Handle window resize
function onWindowResize() {
  const container = document.getElementById("pointCloudContainer");
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Required for damping
  renderer.render(scene, camera);
}

// Toggle point cloud subscription
function togglePointCloudSubscription() {
  if (pointCloudActive) {
    if (pointCloudSubscriber) {
      pointCloudSubscriber.unsubscribe();
      console.log("Unsubscribed from point cloud topic");
    }
    if (pointCloudUpdateInterval) {
      clearInterval(pointCloudUpdateInterval);
      pointCloudUpdateInterval = null;
      console.log("Stopped point cloud update interval");
    }
    pointCloudActive = false;
  } else {
    createPointCloud();
    pointCloudActive = true;
  }
}

// Create point cloud subscriber
function createPointCloud() {
  console.log("Subscribing to /unilidar/cloud");

  // Create subscriber with the ROS 2 message type
  pointCloudSubscriber = new ROSLIB.Topic({
    ros: ros,
    name: "/unilidar/cloud",
    messageType: "sensor_msgs/msg/PointCloud2",
  });

  pointCloudSubscriber.subscribe(function (message) {
    // Store the latest message
    latestPointCloudMessage = message;
  });

  // Set up interval to process the latest point cloud message every 5 seconds
  pointCloudUpdateInterval = setInterval(function () {
    if (latestPointCloudMessage) {
      updatePointCloud(latestPointCloudMessage);
    }
  }, 5000); // 5000 milliseconds = 5 seconds
}

// Update point cloud visualization based on ROS message
function updatePointCloud(message) {
  try {
    // Parse PointCloud2 data
    const pointCount = message.width * message.height;
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);

    // Get data offset information
    const fields = message.fields;
    let xOffset = -1,
      yOffset = -1,
      zOffset = -1;
    let intensityOffset = -1;

    // Find offsets for x, y, z in the point cloud data
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (field.name === "x") xOffset = field.offset;
      if (field.name === "y") yOffset = field.offset;
      if (field.name === "z") zOffset = field.offset;
      if (field.name === "intensity") intensityOffset = field.offset;
    }

    // Convert data to proper format for processing
    let dataBuffer;
    if (typeof message.data === "string") {
      // Base64 encoded
      const binary = atob(message.data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      dataBuffer = bytes.buffer;
    } else if (message.data instanceof Uint8Array) {
      dataBuffer = message.data.buffer;
    } else if (message.data.buffer instanceof ArrayBuffer) {
      dataBuffer = message.data.buffer;
    } else {
      console.error("Unsupported data format:", typeof message.data);
      return;
    }

    // Create a DataView for reading binary data
    const dataView = new DataView(dataBuffer);
    const step = message.point_step;

    // If we found the necessary offsets, parse all points
    if (xOffset >= 0 && yOffset >= 0 && zOffset >= 0) {
      const limit = Math.min(
        pointCount,
        Math.floor(dataBuffer.byteLength / step)
      );

      let validPoints = 0;
      for (let i = 0; i < limit; i++) {
        const base = i * step;

        try {
          // Extract position
          const x = dataView.getFloat32(base + xOffset, true);
          const y = dataView.getFloat32(base + yOffset, true);
          const z = dataView.getFloat32(base + zOffset, true);

          // Skip invalid points
          if (
            isNaN(x) ||
            isNaN(y) ||
            isNaN(z) ||
            !isFinite(x) ||
            !isFinite(y) ||
            !isFinite(z)
          ) {
            continue;
          }

          positions[validPoints * 3] = x;
          positions[validPoints * 3 + 1] = y;
          positions[validPoints * 3 + 2] = z;

          // Use intensity for coloring if available, otherwise use height-based coloring
          if (intensityOffset >= 0) {
            const intensity =
              dataView.getFloat32(base + intensityOffset, true) / 255;
            colors[validPoints * 3] = intensity;
            colors[validPoints * 3 + 1] = intensity;
            colors[validPoints * 3 + 2] = intensity;
          } else {
            // Color based on height (z-value)
            const h = (z + 2) / 4; // normalize to 0-1 range

            // Simple height map: blue (low) to red (high)
            if (h < 0.25) {
              // Blue to cyan
              colors[validPoints * 3] = 0;
              colors[validPoints * 3 + 1] = h * 4;
              colors[validPoints * 3 + 2] = 1;
            } else if (h < 0.5) {
              // Cyan to green
              colors[validPoints * 3] = 0;
              colors[validPoints * 3 + 1] = 1;
              colors[validPoints * 3 + 2] = 1 - (h - 0.25) * 4;
            } else if (h < 0.75) {
              // Green to yellow
              colors[validPoints * 3] = (h - 0.5) * 4;
              colors[validPoints * 3 + 1] = 1;
              colors[validPoints * 3 + 2] = 0;
            } else {
              // Yellow to red
              colors[validPoints * 3] = 1;
              colors[validPoints * 3 + 1] = 1 - (h - 0.75) * 4;
              colors[validPoints * 3 + 2] = 0;
            }
          }

          validPoints++;
        } catch (error) {
          console.error(`Error processing point at index ${i}:`, error);
          break;
        }
      }

      // Trim arrays to only include valid points
      const trimmedPositions = positions.slice(0, validPoints * 3);
      const trimmedColors = colors.slice(0, validPoints * 3);

      // Update geometry with new positions and colors
      const geometry = pointCloud.geometry;
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(trimmedPositions, 3)
      );
      geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(trimmedColors, 3)
      );
      geometry.computeBoundingSphere();
    }
  } catch (error) {
    console.error("Error processing point cloud data:", error);
  }
}

// Initialize everything when page loads
window.onload = function () {
  // Set up canvas for turtle
  canvas = document.getElementById("turtleCanvas");
  if (canvas) {
    ctx = canvas.getContext("2d");
    drawTurtle(); // Draw initial turtle position
  }

  // Initialize ROS connection after page loads
  if (typeof ros !== "undefined" && ros.isConnected) {
    subscribeToPose();
    initCmdVelTopic();
  }
};
