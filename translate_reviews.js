const translate = require('@vitalets/google-translate-api');
const { async } = require('rxjs');
var fs = require('fs');

var languages = ['bn', 'gu', 'hi', 'kn', 'ml', 'mr', 'ne', 'pa', 'ta', 'te'];

let directory = 'data', review_directory = directory + '/reviews_by_apps', t_review_directory = directory + '/t_reviews_by_apps';

(async () => {
    let sim_err_count = 0;
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    if (!fs.existsSync(review_directory)) {
        fs.mkdirSync(review_directory);
    }
    if (!fs.existsSync(t_review_directory)) {
        fs.mkdirSync(t_review_directory);
    }
    try {
        let data = fs.readFileSync(directory + "/AllAppIDs.json", 'utf-8');
        let appIds = JSON.parse(data);
        let app_count = appIds.length;
        let total_count = 0;
        let i = 0;
        for (appId of appIds) {
            if (fs.existsSync(review_directory + "/" + appId + ".json")) {
                if (!fs.existsSync(t_review_directory + "/" + appId + ".json")) {
                    console.log(++i + " of " + app_count + " : started translating reviews of " + appId);
                    let raw = fs.readFileSync(review_directory + "/" + appId + ".json", 'utf-8');
                    let reviews = JSON.parse(raw);
                    let translated_reviews = {};
                    let count = 0;
                    for (lang of languages) {
                        if (lang in reviews) {
                            let l_count = 0;
                            translated_reviews[lang] = [];
                            for (review of reviews[lang]) {
                                try {
                                    review.translated = await translate(review.text, { from: lang, to: 'en' });
                                    translated_reviews[lang].push(review);
                                    console.log(++total_count + " " + ++count + " " + ++l_count);
                                    sim_err_count = 0;
                                } catch (e) { console.error(e); sim_err_count++; if (sim_err_count > 10) process.exit(1); }
                                if (l_count >= 100) break;
                            }
                        }
                        else {
                            console.log(appId + " : " + lang + " doesn't exists...");
                        }
                    }
                    translated_reviews['count'] = count;
                    fs.writeFileSync(t_review_directory + "/" + appId + ".json", JSON.stringify(translated_reviews), 'utf-8');
                    console.log("finished... count: " + count);
                }
                else {
                    console.log(++i + " : skipping.. file exists...");
                }
            }
            else {
                console.log(++i + " : " + appId + " skipping.. file doesn't exists...");
            }
        }
    }
    catch (e) { console.error(e) }
})();