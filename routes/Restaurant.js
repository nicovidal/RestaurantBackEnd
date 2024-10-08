const { Router } = require("express");
const {getWaiters, getProduct, getMesa, getAdmin, getPedidos, getCategoria, showPedido}=require('../controllers/Gets.js');
const { addWaiter, addMesa, addProduct, addPedido } = require("../controllers/Post.js");
const { finishPedido, updateStateMesa, updateStateFinPedido, updatePedido } = require("../controllers/Update.js");
const router = Router();


router.get("/waiters", getWaiters);
router.get("/product", getProduct);
router.get("/mesa", getMesa);
router.get("/admin", getAdmin);
router.get("/pedidos", getPedidos);
router.get("/categoria", getCategoria);
router.get("/verPedido",showPedido)





router.post("/addWaiter",addWaiter)
router.post("/addMesa",addMesa)
router.post("/addProduct",addProduct)
router.post("/addPedido",addPedido)



router.put("/finishPedido",finishPedido)
router.put("/libre",updateStateMesa)
router.put("/entregado",updateStateFinPedido)
router.put("/updatePedido",updatePedido)

module.exports = router;
