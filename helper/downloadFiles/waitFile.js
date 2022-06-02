const fs = require('fs');
const colors = require('colors');
function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

const waitFile = async ({type, id}) => {
    // detect new file in folder preprocess
    while (true) {
        // count files in folder preprocess
        let files = fs.readdirSync(`./archives/preprocess/`);
        if (files.length > 0 && !files[0].includes('.tmp') && !files[0].includes('.DS_Store') && !files[0].includes('.crdownload')) {
            let filename = files[0];
            if (!fs.existsSync(`./archives`))               fs.mkdirSync(`./archives`);
            if (!fs.existsSync(`./archives/${type}`))       fs.mkdirSync(`./archives/${type}`);
            if (!fs.existsSync(`./archives/${type}/${id}`)) fs.mkdirSync(`./archives/${type}/${id}`);
            // Move file to folder
            fs.rename(`./archives/preprocess/${filename}`, `./archives/${type}/${id}/${filename}`, function (err) {
                if (err) throw err;
                console.log(`${id} tiene el adjunto ${filename}`.yellow);
            });
            return;
        }
        await delay(500);
    }
}
 
module.exports = {
    waitFile
}