require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const createTables = require("./database/createTables");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

app.use("/api/blocks", require("./routes/blockRoutes"));
app.use("/api/classrooms", require("./routes/classRoomRoutes"));
app.use("/api/standards", require("./routes/standardRoutes"));
app.use("/api/sections", require("./routes/sectionRoutes"));
app.use("/api/academic-levels", require("./routes/academicLevelRoutes"));
app.use("/api/combined-stds", require("./routes/combinedStdRoutes"));
app.use("/api/class-allocations", require("./routes/classAllocationRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/students", require("./routes/rollNoRoutes.js"));
app.use("/api/subjects", require("./routes/subjectRoutes"));
app.use("/api/allote-subjects", require("./routes/alloteSubjectRoutes"));
app.use("/api/teachers", require("./routes/teacherRoutes"));
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/routes",  require("./routes/routeRoutes"));

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await createTables();

    app.listen(PORT, () => {
      console.log("=================================");
      console.log(`🚀 Server Running : ${PORT}`);
      console.log("✅ PostgreSQL Connected");
      console.log("=================================");
    });
  } catch (error) {
    console.error("❌ Startup Error:", error.message);
    process.exit(1);
  }
})();