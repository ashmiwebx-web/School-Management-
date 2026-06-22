const express = require("express");
const router = express.Router();

const combinedStdController = require("../controllers/combinedStdController");

router.get("/", combinedStdController.getCombinedStds);
router.post("/", combinedStdController.createCombinedStd);
router.put("/:id", combinedStdController.updateCombinedStd);

module.exports = router;