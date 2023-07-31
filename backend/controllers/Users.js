
const User = require("../models/UserModel.js")
const bcrypt = require("bcryptjs")

exports.getUsers = async(req, res) =>{
    try {
        const response = await User.findAll({
            attributes:['uuid','name','email','role']
        });
        res.status(200).json(response);
        
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

exports.getUserById = async (req, res) =>{
    try {
        const response = await User.findOne({
            attributes:['uuid','name','email','role'],
            where: {
                uuid: req.params.id
            }
        })

        res.status(200).json(response)

    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

exports.createUser = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
  
    if (name == null || email == null || password == null || confPassword == null || role == null) {
      return res.status(400).json({
        message: "mohon diisi dengan lengkap",
      });
    }
  
    if (password !== confPassword) {
      return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
    }
  
    // Email validation using regular expression for Gmail addresses
    const isGmail = /@gmail\.com$/.test(email);
    if (!isGmail) {
      return res.status(400).json({ msg: "Email harus menggunakan Gmail" });
    }
   
    const isUserExist = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
  
    if (isUserExist) {
      return res.status(400).json({
        message: "email sudah digunakan",
      });
    }


    const hashPassword = await bcrypt.hash(password, 8)


    try {
      User.create({
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      });
      res.status(201).json({ msg: "Register Berhasil" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };
  

exports.updateUser = async (req, res) =>{
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) {
        return res.status(404).json({msg: "User tidak ditemukan"});
    }

    const {name, email, password, confPassword, role} = req.body;
    let hashPassword;
    if(password === "" || password === null){
        hashPassword = user.password
    }else{
        hashPassword = bcrypt.hash(password);
    }
    if(password !== confPassword) return res.status(400).json({
        msg: "Password dan Confirm Password tidak cocok"
    })

    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        },{
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

exports.deleteUser = async (req, res) =>{
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    })

    if(!user) {
        return res.status(404).json({msg: "User tidak ditemukan"})
    }

    try {
        await User.destroy({
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}