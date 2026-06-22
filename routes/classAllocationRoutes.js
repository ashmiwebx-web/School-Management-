const express = require("express");
const router = express.Router();

const classAllocationController = require("../controllers/classAllocationController");

router.get("/", classAllocationController.getClassAllocations);
router.post("/", classAllocationController.createClassAllocation);
router.put("/:id", classAllocationController.updateClassAllocation);

module.exports = router;