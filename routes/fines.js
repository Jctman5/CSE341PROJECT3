const router = require("express").Router();
const finesController = require("../controllers/fines");
const authenticate = require("../middleware/authenticate");
router.get("/", finesController.getAll);
router.get("/:id", finesController.getSingle);
router.post("/", authenticate.isAuthenticated, finesController.createFine);
router.put("/:id", authenticate.isAuthenticated, finesController.updateFine);
router.delete("/:id", authenticate.isAuthenticated, finesController.deleteFine);
module.exports = router;