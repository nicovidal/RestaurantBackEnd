const { Router } = require("express");
const {getWaiters}=require('../controllers/WaiterControl.js')
const router = Router();


//GetTasks
router.get("/waiters", getWaiters);

module.exports = router;
