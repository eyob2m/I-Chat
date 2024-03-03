const express = require("express");
const path = require("path");
const app = express();
const { format } = require("timeago.js");
const server = app.listen(3002);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));
let socketsConnectd = new Set();

io.on("connection", (socket) => {
  socketsConnectd.add(socket.id);

  // focus keypress blur
  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });

  io.emit("clients-total", socketsConnectd.size);

  socket.on("disconnect", () => {
    socketsConnectd.delete(socket.id);

    io.emit("clients-total", socketsConnectd.size);
  });
  const { format } = require("timeago.js");
  socket.on("message", (data) => {
    socket.broadcast.emit("chat-message", data);
  });
});
