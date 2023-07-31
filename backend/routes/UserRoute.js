
const express = require("express")

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/Users.js")

const { verifyUser, adminOnly } = require('../middleware/AuthUser.js')


const router = express.Router();

router.get('/users', verifyUser, adminOnly,getUsers)
router.get('/users/:id', verifyUser, adminOnly, getUserById)
router.post('/users', verifyUser, adminOnly, createUser)
router.patch('/users/:id', verifyUser, adminOnly, updateUser)
router.delete('/users/:id', verifyUser, adminOnly, deleteUser)

module.exports = router

