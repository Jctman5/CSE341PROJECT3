const router = require("express").Router();
const membersController = require("../controllers/members");
const authenticate = require("../middleware/authenticate");
router.get("/", membersController.getAll);
router.get("/:id", membersController.getSingle);
router.post("/", authenticate.isAuthenticated, membersController.createMember);
router.put("/:id", authenticate.isAuthenticated, membersController.updateMember);
router.delete("/:id", authenticate.isAuthenticated, membersController.deleteMember);

module.exports = router;