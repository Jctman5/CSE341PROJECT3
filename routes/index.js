const router = require('express').Router();
router.use("/", require("./swagger"));
router.get("/", (req, res) => {
    res.send("Hello World")
});

router.use("/members", require("./members"));
router.use("/books", require("./books"));
router.use("/loans", require("./loans"));
router.use("/fines", require("./fines"));
module.exports = router;