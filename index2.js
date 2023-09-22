const http = require("http"); // Import the http module
const { Server } = require("socket.io"); // Import the Server class from socket.io

const server = http.createServer(); // Create an HTTP server

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
// let value = 0;
let namspace = io.of("/kunal");

namspace.on("connection", (socket) => {
  console.log("A user connected");
  // value++;
  // socket.on("message", (data) => {
  //   console.log(data);
  // });
  // socket.send("hey buddy");
  // socket.emit("message", "hello kunal");
  // socket.emit("broadcast", "hello welcome");
  // io.sockets.emit("broadcast", "hello users" + "  " + value);
  // socket.broadcast.emit("broadcast", "hello users" + "  " + value);
  // value++;
  namspace.emit("enterroom", "hellobrother1");
  namspace.emit("enterroomm", "hellobrother2");
  // socket.join("room1" + value);
  // namspace
  //   .to("room1" + value)
  //   .emit("enterroom", "welcome to " + " " + value + "room");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Socket.IO server is running on port 3000");
});
