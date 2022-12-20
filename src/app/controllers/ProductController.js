const Product = require('../models/Product');
const Color = require('../models/Color');
const Category = require('../models/Category');

const { mongooseToObject } = require('../../config/utility/mongoose');
const { multipleToObject } = require('../../config/utility/mongoose');

// [GET] /product
const showProductList = async(req, res, next) => {
    // Find product and product variation
    let p = await Product.find();
    let colors = await Color.find();
    let categories = await Category.find();
    res.render('TabProduct/product', { layout: 'mainClient.hbs', user: mongooseToObject(req.user), p: multipleToObject(p), color: multipleToObject(colors), category: multipleToObject(categories) });
}

// [GET] /product/category_id
const filterGender = async(req, res, next) => {
    let p = await Product.find({ gender: req.params.gender })
    let categories = await Category.find();
    let colors = await Color.find();
    res.render('TabProduct/product', { layout: 'mainClient.hbs', user: mongooseToObject(req.user), p: multipleToObject(p), category: multipleToObject(categories), color: multipleToObject(colors) })
}

// [GET] /:id/:sku
const showProductDetail = async(req, res, next) => {
    let colors = await Color.find();
    let categories = await Category.find();
    let product = await Product.findById({ _id: req.params.id })
        // Find skus[i] has sku = req.params.sku
    var skus = product.skus;
    let querySku = '';
    for (const item of skus) {
        if (`${item.sku}` == req.params.sku) {
            querySku = `${JSON.stringify(item)}`;
        }
    }
    const sku = JSON.parse(querySku)

    // Find sizes[i] has size = req.params.size
    const sizes = sku.sizes;
    let querySize = '';
    for (const item of sizes) {
        if (`${item.size}` == req.params.size) {
            querySize = `${JSON.stringify(item)}`;
        }
    }
    const size = JSON.parse(querySize)
    res.render('TabProduct/productdetail', { layout: 'mainClient.hbs', sku, size, product: mongooseToObject(product), color: multipleToObject(colors), category: multipleToObject(categories) })
}

module.exports = { showProductList, filterGender, showProductDetail }