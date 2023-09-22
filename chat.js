// const http = require("http");
const socket = require("socket.io");
const express = require("express");

const path = require("path");
const multer = require("multer");
const app = express();

const cors = require("cors");
app.use(express.json());

app.use(cors());

app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = req.file.path;

  return res.json({ image: req.file.originalname });
});
const server = app.listen(3000, () => {});
const io = socket(server, {
  cors: {
    origin: "*",
  },
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
