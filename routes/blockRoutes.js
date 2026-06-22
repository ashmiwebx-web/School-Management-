const express = require("express");
const router = express.Router();

const blockController = require("../controllers/blockController");

router.get("/", blockController.getBlocks);
router.post("/", blockController.createBlock);
router.put("/:id", blockController.updateBlock);

module.exports = router;