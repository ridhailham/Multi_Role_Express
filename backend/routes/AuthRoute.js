const express = require("express")
const { 
    Login, 
    Me, 
    logOut,
    Register } = require("../controllers/Auth.js")



const router = express.Router();

router.post('/register', Register)

router.get('/me', Me)
router.post('/login', Login)
router.delete('/logout', logOut)

module.exports = router;