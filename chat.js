const http = require("http");
const { Server } = require("socket.io");
const express = require("express");

const path = require("path");
const multer = require("multer");
const app = express();
const server = http.createServer();
const cors = require("cors");
app.use(express.json());

app.use(cors());

app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = req.file.path;

  return res.json({ image: req.file.originalname });
});

const user = {};
io.on("connection", (socket) => {
  socket.on("newuser-join", (obje) => {
    user[socket.id] = obje.name;
    user["image"] = obje.image;
    socket.broadcast.emit("sabhidekhonewuser", {
      name: user[socket.id],
      image: user["image"],
    });
    socket.on("send", (message) => {
      socket.broadcast.emit("usermessagedekho", {
        message: message,
        name: user[socket.id],
        image: user["image"],
      });
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("sabhidekhonewuserr", {
      name: user[socket.id],
      image: user["image"],
    });
  });
});

server.listen(2000, () => {});
app.listen(3000, () => {});
