const mongoose = require('mongoose');

const quote = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    datePublish: {
        type: String,
        required: true
    },
    dateExpire: {
        type: String,
        required: true
    },
    deliveryTerm: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        required: false
    },
    contactPhone: {
        type: String,
        required: false
    },
    contactEmail: {
        type: String,
        required: false
    },
    contactAddress: {
        type: String,
        required: false
    },
    productId: {
        type: String
    },
    productName: {
        type: String
    },
    productDescription: {
        type: String
    },
    productAmount: {
        type: String
    },
    productType: {
        type: String
    },
    status: {
        type: String,
        required: true,
        default: 'Publicado'
    },
    url: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('Quote', quote);