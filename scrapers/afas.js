const cheerio = require('cheerio');
const axios = require('axios');


const url = "https://afasstatus.nl/"

async function scrape() {
    let responseObject = []

    await axios.get(url).then((response) => {
        const $ = cheerio.load(response.data);
        const status = $('.statuscontent > p > span').text();   
        responseObject['status'] = (status == 'Goed') ? 'online' : 'offline';


        responseObject['maintenances'] = [];
        $('.maintenance').each((i, el) => {
            let maintenance = {};

            let title = $(el).find('.announcement #eventtitle').text();
            let description =$(el).find('.announcement #eventmsg').text();

            description = description.replace(/\n/g, '');

            maintenance['title'] = title.replace(/ \([0-9]{2}-[0-9]{2}-[0-9]{4} [0-9]{2}:[0-9]{2} t\/m [0-9]{2}-[0-9]{2}-[0-9]{4} [0-9]{2}:[0-9]{2}\)/gm, '');            ;
            maintenance['description'] = description;

            const regex = /[0-9]{2}-[0-9]{2}-[0-9]{4} [0-9]{2}:[0-9]{2}/gm;
            let matches = title.match(regex);
            if (matches.length != 2) {
                maintenance['scheduled'] = false
            }
            else {
                maintenance['scheduled'] = true;
                maintenance['scheduled_start'] = matches[0];
                maintenance['scheduled_end'] = matches[1];
            }
            
            responseObject['maintenances'].push(maintenance);
        });
    });

    return responseObject;
}

exports.scrape = scrape;
