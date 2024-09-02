const { Router } = require("express");
const {getWaiters}=require('../controllers/Gets.js')
const router = Router();


//GetTasks
router.get("/waiters", getWaiters);

module.exports = router;
