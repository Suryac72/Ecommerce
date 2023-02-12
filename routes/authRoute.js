const express = require('express');
const { createUser, loginUserCtrl, getAllUsers, getSingleUser, deleteUser, updateaUser } = require('../controllers/userController');
const router = express.Router();
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware');

router.post("/register",createUser);
router.post("/login",loginUserCtrl);
router.get("/all-users",getAllUsers);
router.get("/:id",authMiddleware,isAdmin,getSingleUser);
router.delete("/:id",deleteUser);
router.put("/:id",updateaUser);

module.exports = router;