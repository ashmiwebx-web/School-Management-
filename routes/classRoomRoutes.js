const express = require("express");
const router = express.Router();

const classRoomController = require("../controllers/classRoomController");

router.get("/", classRoomController.getClassRooms);
router.post("/", classRoomController.createClassRoom);
router.put("/:id", classRoomController.updateClassRoom);

module.exports = router;