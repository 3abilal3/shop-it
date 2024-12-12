var express = require("express");
const productControllers=require('../controllers/productControllers')

var router = express.Router();

/* GET home page. */
router.post("/", function(req, res) {
	res.render("index", { title: "Express" });
});

router.post("/admin/ProductListing",productControllers.ProductListing)
router.get("/AllProducts",productControllers.AllProducts)
router.get("/:id",productControllers.getProduct)
router.put("/:id",productControllers.updateProduct)
router.delete("/:id",productControllers.DeleteProduct)
module.exports = router;
