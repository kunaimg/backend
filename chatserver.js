const express = require("express");
const socket = require("socket.io");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
const path = require("path");
const multer = require("multer");
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
let dataa;
io.on("connection", (socket) => {
  socket.on("newuserjoin", (data) => {
    dataa = data;
    socket.broadcast.emit("usermessagedekho", data);
  });
  socket.on("message", (datas) => {
    console.log(datas);
    socket.broadcast.emit("messagee", datas);
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("disusermessagedekho", dataa);
  });
});
