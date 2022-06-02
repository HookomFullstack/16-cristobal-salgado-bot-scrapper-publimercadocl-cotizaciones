const puppeteer = require('puppeteer');
const { saveData } = require('../helper/saveData');
const quote = require('../models/quote');
const { waitFile } = require('../helper/downloadFiles/waitFile');

let browser = null;
let page = null;
let next = -1;
let first = true;



const scrapPublicadas = async({nextPage}) => {
    let idArr = [];
    if (nextPage == -1) {
        browser = await puppeteer.launch({
            headless: false,
            args: [
                '--start-maximized',
                '--disable-notifications',
            ],
            slowMo: 10,
            userDataDir: './userData',
            defaultViewport: null,
            userDataDir: './userDataDir'
        });
        page = await browser.newPage();
        page.setDefaultTimeout(0);
        await page.goto('https://www.mercadopublico.cl/Home/Autenticacion?esNuevaHome=true#tabs2');
        await page.waitForSelector('#tabs > div > div.resp-tab-content.tabs.resp-tab-content-active');
        // TODO: Add login
        await page.type('#txtRUT', '141462261');
        await page.type('#txtPass', 'Portal.930');
        await page.keyboard.press('Enter');
        await page.waitForNavigation();
        // await page.waitForSelector('#mnuPrincipaln3 > table > tbody > tr > td > a');
        await page.click('#mnuPrincipaln3 > table > tbody > tr > td > a')
    }
    await page.waitForSelector('#content > iframe');
    await page.waitForTimeout(5000);
    const elementHandle = await page.$('#content > iframe');
    const frame = await elementHandle.contentFrame();
    // Click on the first quote
    if(nextPage == -1) {
        await frame.waitForSelector('#ddlRegion');
        const region = await frame.$('#ddlRegion');
        // TODO: Seleccionadores dinámicos
        const ocEmitida = await frame.$('#ddlState');
        await ocEmitida.select('4');
        await region.select('CL;13');
        const buscar = await frame.$('#btnSearchParameter');
        await buscar.click('#btnSearchParameter');
        await frame.waitForTimeout(10000);
        // const omitir = await frame.$('#btnOmitir');

        // if(omitir != null) await frame.click('#btnOmitir');
    }
    
    const resultados = await frame.$$('#gvQuoteSearch > tbody > tr > td:nth-child(1)');

    for (const item of resultados) {
        // extract property onclick
        const onclick = await item.$eval('#gvQuoteSearch > tbody > tr > td:nth-child(1) a', el => el.getAttribute('onclick'));
        const id      = await item.$eval('#gvQuoteSearch > tbody > tr > td:nth-child(1) span', el => el.innerText);
        const exist   = await quote.findOne({ id });
        if (!exist) idArr.push(`https://www.mercadopublico.cl/CompraAgil/Modules/Cotizacion/${onclick.split('\'')[1]}`);
    }
    
    for (const urlPage of idArr) {

        let productoIdCotizacionArr          = [];
        let productoNombreCotizacionArr      = [];
        let productoDescripcionCotizacionArr = [];
        let productoUnidadCotizacionArr      = [];
        let productoTypeCotizacionArr        = [];

        const page2 = await browser.newPage();
        page2.setDefaultTimeout(0);

        await page2.goto(urlPage);
        await page2.waitForTimeout(1000);
        
        // Detalles de la cotizacion 
        await page2.waitForSelector('body');
        const typeCot                = await page2.$('#lblrstStatus');
        const idFrame                = await page2.$('#lblExternalCodeQuote');
        const nombreCot              = await page2.$('#lblNameQuote');
        const descripcionCot         = await page2.$('#lblDescriptionQuote');
        const direccionCot           = await page2.$('#lblDireccionEntrega');
        const fechaPubCot            = await page2.$('#lblFechaPublicacion');
        const fechaCierreCot         = await page2.$('#lblDateClose');
        const plazoEntregaCot        = await page2.$('#lblPlazoEntrega');
        const montoCot               = await page2.$('#lblMontoTotalDisponible');
        // Producto
        const productIds             = await page2.$$('td:nth-child(1) > div > span:nth-child(2)')
        const productoNombres        = await page2.$$('td:nth-child(1) > div > span:nth-child(1)');
        const productoDescripciones  = await page2.$$('#gvCategory > tbody > tr > td:nth-child(1) > span');
        const productoUnidades       = await page2.$$('#gvCategory > tbody > tr > td:nth-child(2) > span:nth-child(1)');
        const productoTipos          = await page2.$$('td:nth-child(2) > span:nth-child(2)');

        // Adjuntos 
        const adjuntCot              = await page2.$('#form1 > div.row > div.col-md-8 > div:nth-child(9) > div > div > a'); 

        // Contact Info
        const nombreContacto    = await page2.$('#lblNombreContacto');
        const celularContacto   = await page2.$('#lblTelefonoContacto');
        const correoContacto    = await page2.$('#lblMailContacto');
        const direccionContacto = await page2.$('#form1 > div.row > div.col-md-4 > div.card.card-info-chilecompra.card-datos-cotizacion.mt-2 > div');

        // Extract detalles 
        const tipoCotizacion                = await page2.evaluate(typeCot         => typeCot.innerText,         typeCot);
        const idCot                         = await page2.evaluate(id              => id.innerText,              idFrame);
        const nombreCotizacion              = await page2.evaluate(nombreCot       => nombreCot.innerText,       nombreCot);
        const descripcionCotizacion         = await page2.evaluate(descripcionCot  => descripcionCot.innerText,  descripcionCot);
        const direccionCotizacion           = await page2.evaluate(direccionCot    => direccionCot.innerText,    direccionCot);
        const fechaPublicacionCotizacion    = await page2.evaluate(fechaPubCot     => fechaPubCot.innerText,     fechaPubCot);
        const fechaCierreCotizacion         = await page2.evaluate(fechaCierreCot  => fechaCierreCot.innerText,  fechaCierreCot);
        const plazoEntregaCotizacion        = await page2.evaluate(plazoEntregaCot => plazoEntregaCot.innerText, plazoEntregaCot);
        const montoCotizacion               = await page2.evaluate(montoCot        => montoCot.innerText,        montoCot);
        
        
        if(adjuntCot){
            await page2.click('#form1 > div.row > div.col-md-8 > div:nth-child(9) > div > div > a')
            await page2.waitForSelector('#grdAttachment > tbody > tr.dccp-row > td:nth-child(3)')
            const adjunts = await page2.$$('#grdAttachment > tbody > tr.dccp-row > td:nth-child(3)');
            
            for (const item of adjunts) {
                await page2.waitForSelector('#grdAttachment > tbody > tr.dccp-row > td:nth-child(3) > input')
                await page2.waitForTimeout(3000);
                await item.click('#grdAttachment > tbody > tr.dccp-row > td:nth-child(3) > input')
                await waitFile({id: idCot, type: tipoCotizacion});
            }
            await page2.click('#modalVerAdjuntos > div > div > div.modal-footer.text-center.pb-4 > button');
        }


        // Extract productos


        for (const item of productIds) {
            const productoIdCotizacion = await item.evaluate(item => item.innerText, 'td:nth-child(1) > div > span:nth-child(2)');
            productoIdCotizacionArr.push(productoIdCotizacion);
        }
        for (const item of productoNombres) {
            const productoNombreCotizacion = await item.evaluate(item => item.innerText, 'td:nth-child(1) > div > span:nth-child(1)');
            productoNombreCotizacionArr.push(productoNombreCotizacion);
        }
        for (const item of productoDescripciones) {
            const productoDescripcionCotizacion = await item.evaluate(item => item.innerText, '#gvCategory > tbody > tr > td:nth-child(1) > span');
            productoDescripcionCotizacionArr.push(productoDescripcionCotizacion);
        }
        for (const item of productoUnidades) {
            const productoUnidadCotizacion = await item.evaluate(item => item.innerText, '#gvCategory > tbody > tr > td:nth-child(2) > span:nth-child(1)');
            productoUnidadCotizacionArr.push(productoUnidadCotizacion);
        }
        for (const item of productoTipos) {
            const productoTypeCotizacion = await item.evaluate(item => item.innerText, 'td:nth-child(2) > span:nth-child(2)');
            productoTypeCotizacionArr.push(productoTypeCotizacion);
        }

        // Extract contact info
        let productId =          productoIdCotizacionArr.join(', ');
        let productName =        productoNombreCotizacionArr.join(', ');
        let productDescription = productoDescripcionCotizacionArr.join(', ');
        let productAmount =      productoUnidadCotizacionArr.join(', '); 
        let productType =        productoTypeCotizacionArr.join(', ');
        
        const nombreContactoCotizacion    = await page2.evaluate(nombreContacto    =>    nombreContacto.innerText, nombreContacto);
        const celularContactoCotizacion   = await page2.evaluate(celularContacto   =>    celularContacto.innerText, celularContacto);
        const correoContactoCotizacion    = await page2.evaluate(correoContacto    =>    correoContacto.innerText, correoContacto);
        const direccionContactoCotizacion = await page2.evaluate(direccionContacto =>    direccionContacto.innerText, direccionContacto);


        // Check if exist in DB
        
        const newCotizacion = await new quote({
            id: idCot,
            name: nombreCotizacion,
            description: descripcionCotizacion,
            region: 'CL;13',
            address: direccionCotizacion,
            price: montoCotizacion,
            datePublish: fechaPublicacionCotizacion,
            dateExpire: fechaCierreCotizacion,
            deliveryTerm: plazoEntregaCotizacion,
            contactName: nombreContactoCotizacion,
            contactPhone: celularContactoCotizacion,
            contactEmail: correoContactoCotizacion,
            contactAddress: direccionContactoCotizacion,

            productId,
            productName,
            productDescription,
            productAmount,
            productType,
            
            status: tipoCotizacion,
            url: urlPage
        });
        await newCotizacion.save();
        // querie all data db
        await saveData()
        await page2.close();
    }

    const nextPageSelector = await frame.$$('#_PagerBlock__TblPages > tbody > tr > td > a');

    if (nextPageSelector.length == 11 && first == false)  next === 10 ? next = 1 : next = next + 1;  
    if (nextPageSelector.length == 10 || first == true)   next == 9 && first == true ? ( next = 1, first = false) : next = next + 1;

    await nextPageSelector[next].click();
    await page.waitForTimeout(5000);
    await scrapPublicadas({nextPage: next});
}

module.exports = {
    scrapOcEmitidas
};