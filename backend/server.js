
require("dotenv").config();

const express = require("express");
const bookingRoutes = require("./routes/bookingRoutes");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected successfully!");
    console.log("Database name:", mongoose.connection.name);

    const serverInfo = await mongoose.connection.db.admin().command({ hello: 1 });
console.log("Backend replica set:", serverInfo.setName);
console.log("Backend MongoDB server:", serverInfo.me);

const collections = await mongoose.connection.db.listCollections().toArray();
console.log("Collections:", collections.map((collection) => collection.name));

    const bookingCount = await mongoose.connection.db
  .collection("bookings")
  .countDocuments();

console.log("Total bookings in MongoDB:", bookingCount);

    const databases = await mongoose.connection.db
      .admin()
      .listDatabases();

    console.log(
      "Available databases:",
      databases.databases.map((db) => db.name)
    );
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("TravelMate backend is running!");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`TravelMate backend running on http://localhost:${PORT}`);
});
