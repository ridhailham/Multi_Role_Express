
const { response } = require("express")
const Product = require("../models/ProductModel.js")
const User = require("../models/UserModel.js")
const {Op, where} = require("sequelize")

exports.getProducts = async(req, res) => {
    try {
        let response
        if(req.role === "admin") {
            response = await Product.findAll({
                attributes: ['uuid', 'name', 'price'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })

            if(!response) {
                return res.status(400).json({
                    message: "user tidak ditemukan"
                })
            }

            res.status(200).json(response)

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

            if(!response) {
                return res.status(400).json({
                    message: "produk milik user tidak ditemukan"
                })
            }

            res.status(200).json(response)
        }

    } catch (error) {
        createUser.status(500).json(error.message)
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
                message: "product tidak ditemukan"
            })
        }

        let response
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

            if(!response) {
                return res.status(400).json({
                    message: "user tidak ditemukan"
                })
            }

            res.status(200).json(response)

        } else {
            response = await Product.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    [Op]: [{id: product.id}, {userId: req.userId}]
                    
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })

            if(!response) {
                return res.status(400).json({
                    message: "produk milik user tidak ditemukan"
                })
            }

            res.status(200).json(response)
        }

    } catch (error) {
        createUser.status(500).json(error.message)
    }
}

exports.createProduct = async (req, res) =>{
    try {
        const { name, price } = req.body

        await Product.create({
            name: name,
            price: price,
            userId: req.userId
        })

        res.status(200).json({
            message: "product created successfully"
        })
    } catch (error) {
        res.status(500).json(error.message)
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
                message: "produk tidak ditemukan"
            })
        }

        const {name, price} = req.body

        if(req.role === "admin") {
            await Product.update({name, price}, {
                where: {
                    id: product.id
                }
            })
        } else {
            await Product.update({name, price}, {
                where: {
                    [Op.and]: [{id: product.id}, {userId: req.userId}]
                }
            })
        }

        res.status(200).json({
            message: "product updated successfully"
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

exports.deleteProduct = async (req, res) =>{
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        })

        if(!product) {
            return res.status(400).json({
                message: "produk tidak ditemukan"
            })
        }

        const {name, price} = req.body

        if(req.role === "admin") {
            await Product.destroy({
                where: {
                    id: product.id
                }
            })
        } else {
            await Product.destroy({
                where: {
                    [Op.and]: [{id: product.id}, {userId: req.userId}]
                }
            })
        }

        res.status(200).json({
            message: "product deleted successfully"
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
}