const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.use(express.static(path.join(__dirname, "public")));
app.get("/health", (_req, res) => res.json({ ok: true, service: "Clarity" }));
const rooms = new Map();
io.on("connection", socket => {
  socket.on("join", ({ room, name }) => {
    room = String(room || "").toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 24);
    if (!room) return;
    const members = rooms.get(room) || new Set();
    if (members.size >= 2) { socket.emit("room-full"); return; }
    socket.join(room); socket.data.room = room; socket.data.name = String(name || "Convidado").slice(0,24);
    const others = [...members];
    members.add(socket.id); rooms.set(room, members);
    socket.emit("joined", { room, count: members.size, id: socket.id });
    for (const id of others) io.to(id).emit("peer-joined", { id: socket.id, name: socket.data.name });
    const existing = others[0];
    if (existing) socket.emit("peer-joined", { id: existing, name: io.sockets.sockets.get(existing)?.data.name || "Convidado" });
  });
  for (const event of ["offer", "answer", "ice"]) socket.on(event, data => {
    if (data?.to && socket.data.room) io.to(data.to).emit(event, { ...data, from: socket.id });
  });
  socket.on("disconnect", () => {
    const room = socket.data.room; if (!room) return;
    const members = rooms.get(room); if (!members) return;
    members.delete(socket.id);
    socket.to(room).emit("peer-left", { id: socket.id });
    if (!members.size) rooms.delete(room);
  });
});
const port = process.env.PORT || 3000;
server.listen(port, "0.0.0.0", () => console.log(`Clarity listening on ${port}`));
