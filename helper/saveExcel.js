const ExcelJS = require('exceljs');
const colors = require('colors');

const saveExcel = (data) => {

    const workbook = new ExcelJS.Workbook();
    const fileName = 'cotizaciones.xlsx';
    const sheet = workbook.addWorksheet('Cotizaciones');

    
    const reColumns = [
        { header: 'id',                       key: 'id' },
        { header: 'nombre',                   key: 'name' },
        { header: 'descripcion',              key: 'description' },
        { header: 'Region',                   key: 'region' },
        { header: 'fecha publicado',          key: 'datePublish' },
        { header: 'fecha expirado',           key: 'dateExpire' },
        { header: 'Tiempo de entrega',        key: 'deliveryTerm' },
        { header: 'direccion',                key: 'address' },
        { header: 'Precio',                   key: 'price' },
        { header: 'Nombre del anunciante',    key: 'contactName' },
        { header: 'Celular del anunciante',   key: 'contactPhone' },
        { header: 'Correo del anunciante',    key: 'contactEmail' },
        { header: 'Direccion del anunciante', key: 'contactAddress' },
        { header: 'ID del producto',          key: 'productId' },
        { header: 'Nombre del producto',      key: 'productName' },
        { header: 'Descripcion del producto', key: 'productDescription' },
        { header: 'Cantidad del producto',    key: 'productAmount' },
        { header: 'Tipo del producto',        key: 'productType' },
        { header: 'Tipo licitacion',          key: 'status' },
        { header: 'url',                      key: 'url' },
    ];

    sheet.columns = reColumns;
    
    sheet.addRows(data);
    
    workbook.xlsx.writeFile(fileName)
        .then(() => {
            // count the rows all
            const rows = workbook.worksheets.reduce((acc, sheet) => acc + sheet.rowCount, 0);
            console.log(`${fileName} creado exitosamente, hay ${rows - 1} licitaciones.`.green);
        }
    );
}

module.exports = {
    saveExcel
}