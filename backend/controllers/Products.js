
const Product = require("../models/ProductModel.js")
const User = require("../models/UserModel.js")
const {Op, where} = require("sequelize")

exports.getProducts = async(req, res) => {
    try {
        let response;
        
        if(req.role === "admin") {
            response = await Product.findAll({
                attributes: ['uuid', 'name', 'price'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })

        } else {
            
            response = await Product.findAll({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    userId: req.userId
                }, 
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
        }
        
        res.status(200).json(response)

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getProductById = async (req, res) => {
    try {

        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        })

        if(!product) {
            return res.status(400).json({
                message: "data tidak ditemukan"
            })
        }

        let response;
        
        if(req.role === "admin") {
            response = await Product.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    id: product.id
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })

        } else {
            
            response = await Product.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    [Op.and]: [{id: product.id}, {userId: req.userId}]
                }, 
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
        }
        
        res.status(200).json(response)

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.createProduct = async (req, res) =>{

    const { name, price } = req.body

    try {
        await Product.create({
            name: name,
            price: price,
            userId: req.session.userId
        })

        res.status(201).json({
            message: "product created successfully"
        })

    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }
}

exports.updateProduct = async (req, res) =>{
    try {

        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        })

        if(!product) {
            return res.status(400).json({
                message: "data tidak ditemukan"
            })
        }

        const { name, price } = req.body
        
        if(req.role === "admin") {
            await Product.update(
                {name, price},{
                where: {
                    id: product.id
                }
            })

        } else {
            if(req.userId !== product.userId) {
                return res.status(403).json({
                    message: "akses terlarang, anda bukan admin"
                })
            }
            await Product.update(
                {name, price},{
                where: {
                    [Op.and]: [{id: product.id}, {userId: req.userId}]
                }, 
            }) 
        }
        
        res.status(200).json(response)

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.deleteProduct = (req, res) =>{
    
}