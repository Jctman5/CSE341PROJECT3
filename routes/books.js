const router = require("express").Router();
const booksController = require("../controllers/books");
const authenticate = require("../middleware/authenticate");

router.get("/", booksController.getAll);
router.get("/:id", booksController.getSingle);
router.post("/", authenticate.isAuthenticated, booksController.createBook);
router.put("/:id", authenticate.isAuthenticated, booksController.updateBook);
router.delete("/:id", authenticate.isAuthenticated, booksController.deleteBook);

module.exports = router;