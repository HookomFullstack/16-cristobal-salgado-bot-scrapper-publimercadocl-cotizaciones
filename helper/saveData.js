const quote = require("../models/quote");
const { saveExcel } = require("./saveExcel");

const saveData = async () => {
    let item = []
    for await (const { id, name, description, region, address, price, datePublish, dateExpire, deliveryTerm, contactName, contactPhone, contactEmail, contactAddress, productId, productName, productDescription, productType, productAmount, status, url } of quote.find()) {
        item.push({
            id,
            name, 
            description, 
            region, 
            address, 
            price, 
            datePublish, 
            dateExpire, 
            deliveryTerm, 
            contactName, 
            contactPhone, 
            contactEmail, 
            contactAddress, 
            productId, 
            productName, 
            productDescription, 
            productAmount, 
            productType,
            status,
            url
        })
    }
    await saveExcel(item);
    return;
}

module.exports = {
    saveData
}