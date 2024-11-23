// Canvas for drawing turtle
var turtlePosition = { x: 0, y: 0, theta: 0 };
console.log("Initial turtlePosition:", turtlePosition);

// ToDO: init these in the correct place
var canvas; // = document.getElementById("turtleCanvas");
var ctx; // = canvas.getContext("2d");

var turtleImage = new Image();
turtleImage.src = "images/turtle.png";

// Connect to ROS
var ros = new ROSLIB.Ros({
  url: "ws://localhost:9090",
});

ros.on("connection", function () {
  console.log("Connected to websocket server.");
  getTurtleTopics();
  subscribeToPose();
});

ros.on("error", function (error) {
  console.log("Error connecting to websocket server: ", error);
});

ros.on("close", function () {
  console.log("Connection to websocket server closed.");
});

// Create a topic object
var cmdVel = new ROSLIB.Topic({
  ros: ros,
  name: "/turtle1/cmd_vel",
  messageType: "geometry_msgs/Twist",
});

// Function to move the turtle
function moveTurtle(linear, angular) {
  var twist = new ROSLIB.Message({
    linear: {
      x: linear,
      y: 0.0,
      z: 0.0,
    },
    angular: {
      x: 0.0,
      y: 0.0,
      z: angular,
    },
  });
  cmdVel.publish(twist);
}

// Function to stop the turtle
function stopTurtle() {
  moveTurtle(0, 0);
}

// Function to draw the turtle
function drawTurtle() {
  if (!canvas || !ctx) {
    canvas = document.getElementById("turtleCanvas");
    console.log("Canvas:", canvas);
    ctx = canvas.getContext("2d");
    console.log("Context:", ctx);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Draw the turtle at the new position and orientation
  ctx.save(); // Save the canvas state
  ctx.translate(turtlePosition.x * 50, canvas.height - turtlePosition.y * 50); // Scale the position
  ctx.rotate(-turtlePosition.theta); // Rotate based on orientation
  ctx.drawImage(turtleImage, -15, -15, 30, 30); // Draw turtle image with size 30x30
  ctx.restore(); // Restore the canvas state
}

// Subscribe to turtle pose
function subscribeToPose() {
  var poseListener = new ROSLIB.Topic({
    ros: ros,
    name: "/turtle1/pose",
    messageType: "turtlesim/Pose",
  });

  poseListener.subscribe(function (message) {
    // Update the turtle position
    turtlePosition.x = message.x;
    turtlePosition.y = message.y;
    turtlePosition.theta = message.theta;
    drawTurtle(); // Redraw turtle on the canvas
  });
}

// Function to get and display the list of topics
function getTurtleTopics() {
  console.log("Getting topics...");
  ros.getTopics(function (topicsResponse) {
    console.log("Topics:", topicsResponse); // Log the full response

    // Check if the response contains 'topics' and it's an array
    if (Array.isArray(topicsResponse.topics)) {
      topicsResponse.topics.forEach(function (topic) {
        let listItem = document.createElement("li");
        listItem.textContent = topic;
        document.getElementById("topicList").appendChild(listItem);
      });
    } else {
      console.error("Expected an array for topics, but got:", topicsResponse);
    }
  });
}
