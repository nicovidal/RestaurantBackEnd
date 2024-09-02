const { Router } = require("express");
const {getWaiters, getProduct, getMesa, getAdmin, getPedidos, getCategoria}=require('../controllers/Gets.js');
const { addWaiter } = require("../controllers/Post.js");
const router = Router();


router.get("/waiters", getWaiters);
router.get("/product", getProduct);
router.get("/mesa", getMesa);
router.get("/admin", getAdmin);
router.get("/pedidos", getPedidos);
router.get("/categoria", getCategoria);




router.post("/addWaiter",addWaiter)

module.exports = router;
