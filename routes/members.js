const router = require("express").Router();
const membersController = require("../controllers/members");

router.get("/", membersController.getAll);
router.get("/:id", membersController.getSingle);
router.post("/", membersController.createMember);
router.put("/:id", membersController.updateMember);
router.delete("/:id", membersController.deleteMember);

module.exports = router;