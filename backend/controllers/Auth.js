
const User = require("../models/UserModel.js")
const bcrypt = require("bcryptjs")
const session = require("express-session")


exports.Login = async (req, res) => {

    const user = await User.findOne({
        
        where: {
            email: req.body.email
        }
    })

    if (!user) {
        return res.status(400).json({
            message: "email tidak ditemukan"
        });
    }

    console.log("ini ", req.body.password, " dan ", user.password);

    // Menggunakan 'await' di depan 'bcrypt.compare' karena ini adalah operasi asinkron
    let isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "password salah"
        })
    }

    
    req.session.userId = user.uuid;
    const uuid = user.uuid;
    const name = user.name;
    const email = user.email;
    const role = user.role;

    res.status(200).json({
        uuid, name, email, role
    })
}


exports.Me = async (req, res) => {
    if(!req.session.userId) {
        return res.status(400).json({
            message: "silakan login ke akun anda dahulu"
        })
    }

    const user = await User.findOne({
        attributes: ['uuid', 'name', 'email', 'role'],
        where: {
            uuid: req.session.userId
        }
    })

    if(!user) {
        return res.status(400).json({
            message: "User tidak ditemukan"
        })
    }

    res.status(200).json(user)
}


exports.logOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(400).json({
                message: "tidak dapat logout"
            });
        }

        // Setelah menghancurkan sesi, hapus data yang terkait dengan sesi dari req.session (opsional)
        req.session = null;

        res.status(200).json({
            message: "anda telah logout"
        })
    })
}

// exports.logOut = (req, res) => {

//     res.session.destroy((err) => {
//         if(err) {
//             return res.status(400).json({
//                 message: "tidak dapat logout"
//             })
//         }

//         res.status(200).json({
//             message: "anda telah logout"
//         })
//     })
    


// }