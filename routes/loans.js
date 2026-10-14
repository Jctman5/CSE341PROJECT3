const router = require("express").Router();
const Loancontroller = require("../controllers/loans");
const autheticate = require("../middleware/authenticate");
router.get("/", Loancontroller.getAll);
router.get("/:id", Loancontroller.getSingle);
router.post("/", autheticate.isAuthenticated, Loancontroller.createLoan);
router.put("/:id", autheticate.isAuthenticated, Loancontroller.updateLoan);
router.delete("/:id", autheticate.isAuthenticated, Loancontroller.deleteLoan);
module.exports = router;