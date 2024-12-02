require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const { connectToDatabase } = require("./config/database");
const path = require("path");

const app = express();

connectToDatabase();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

// app.use(globalErrorHandler);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 8000;

// async function startServer() {
//   try {
//     await connectToDatabase();
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error("Failed to start server:", error);
//     process.exit(1);
//   }
// }

// startServer();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
