const User = require('../models/UserModel.js')

exports.verifyUser = async (req, res, next) => {
    if(!req.session.userId) {
        return res.status(400).json({
            message: "silakan login ke akun anda dahulu"
        })
    }

    const user = await User.findOne({
        
        where: {
            uuid: req.session.userId
        }

    })

    if(!user) {
        return res.status(400).json({
            message: "User tidak ditemukan"
        })
    }

    req.userId = user.id
    req.role = user.role
    next()
}


exports.adminOnly = async (req, res, next) => {

    const user = await User.findOne({
        
        where: {
            uuid: req.session.userId
        }
    })

    if(!user) {
        return res.status(400).json({
            message: "User tidak ditemukan"
        })
    }

    if(user.role !== "admin") {
        return res.status(403).json({
            message: "akses terlarang, anda bukan"
        })
    }

    next()
}