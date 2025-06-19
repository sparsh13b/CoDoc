const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const Document = require('./models/Document'); // <-- import model

dotenv.config();

const app = express();
const server = http.createServer(app); // for socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // or your frontend port
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.log("❌ DB Connection Error:", err);
});

app.get("/", (req, res) => res.send("Server is working ✅"));

// Socket.IO logic
const DEFAULT_DATA = "";

io.on("connection", socket => {
  console.log("📡 New connection:", socket.id);

  socket.on("get-document", async ({ documentId, documentName }) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;
  const doc = await Document.findById(id);
  if (doc) return doc;
  return await Document.create({ _id: id, data: DEFAULT_DATA });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
