const { Router } = require("express");
const {getWaiters, getProduct, getMesa, getAdmin, getPedidos}=require('../controllers/Gets.js')
const router = Router();


router.get("/waiters", getWaiters);
router.get("/product", getProduct);
router.get("/mesa", getMesa);
router.get("/admin", getAdmin);
router.get("/pedidos", getPedidos);

module.exports = router;
