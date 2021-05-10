var gplay = require('google-play-scraper');

const { async } = require('rxjs');
var fs = require('fs');

var languages = ['bn', 'gu', 'hi', 'kn', 'ml', 'mr', 'ne', 'pa', 'ta', 'te'];

let directory = 'data', review_directory = directory + '/reviews_by_apps';

(async () => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    if (!fs.existsSync(review_directory)) {
        fs.mkdirSync(review_directory);
    }
    try {
        total_count = 0;
        let data = fs.readFileSync(directory + "/AllAppIDs.json", 'utf-8');
        appIds = JSON.parse(data);
        let i = 0;
        for (appId of appIds) {
            if (!fs.existsSync(review_directory + "/" + appId + ".json")) {
                console.log(++i + " : started fetching reviews of " + appId);
                reviews = {};
                count = 0;
                for (lang of languages) {
                    let response;
                    try {
                        response = (await gplay.reviews({ appId, country: "in", lang, num: 10000 }));
                    }
                    catch (e) { console.error(appId + " " + lang + " " + e.message) }
                    if (response && response.data) {
                        reviews[lang] = response.data;
                        count += response.data.length;
                        total_count += response.data.length;
                    }
                    else {
                        reviews[lang] = [];
                    }
                    console.log(lang + " : " + reviews[lang].length);
                }
                fs.writeFileSync(review_directory + "/" + appId + ".json", JSON.stringify(reviews), 'utf-8');
                console.log("finished... count: " + count);
            }
            else {
                console.log(++i + " : skipping.. file exists...");
            }
        }
        console.log("finished... total reviews fetched: " + total_count);
    }
    catch (e) { console.error(e) }
})();