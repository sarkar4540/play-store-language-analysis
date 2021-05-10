var gplay = require('google-play-scraper');
const { async } = require('rxjs');
var fs = require('fs');

var languages = ['bn', 'gu', 'hi', 'kn', 'ml', 'mr', 'ne', 'pa', 'ta', 'te'];

directory = 'data';

(async () => {
    try {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }
        for (collection in gplay.collection) {
            console.log(collection);
            for (lang of languages) {
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
            }
            console.log();
        }
    } catch (err) {
        console.error(err)
    }

})();