var express = require("express");
const productControllers=require('../controllers/productControllers')

var router = express.Router();

/* GET home page. */
router.post("/", function(req, res) {
	res.render("index", { title: "Express" });
});

router.post("/admin/ProductListing",productControllers.createProduct)
router.get("/AllProducts",productControllers.getAllProducts)
router.get("/:id",productControllers.getProduct)
router.put("/:id",productControllers.updateProduct)
router.delete("/:id",productControllers.deleteProduct)
module.exports = router;
