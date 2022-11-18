const afas = require('./scrapers/afas.js');

async function main() {
    try{
        const afasResponse = await afas.scrape();
        console.log(afasResponse);
    } catch (e) {
        console.log("Error retrieving data for AFAS:" +  e);
    }

}

main();