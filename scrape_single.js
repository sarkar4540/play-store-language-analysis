var gplay = require('google-play-scraper');
const { async } = require('rxjs');
var fs = require('fs');

var lang = 'ml';
var collection = 'NEW_FREE';

directory = 'data';

(async () => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    console.log(collection);
    console.log(lang + " started");
    try {
        let result = await gplay.list({ collection: gplay.collection[collection], lang, country: 'in', throttle: 10, fullDetail: true })
        result_json = JSON.stringify(result);
        fs.writeFileSync(directory + '/' + lang + "_" + collection + ".json", result_json, 'utf-8');
        console.log(lang + " done, size: " + result.length);
    }
    catch (e) {
        console.error(e.message);
    }
    console.log();

})();