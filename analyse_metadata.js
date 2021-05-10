var gplay = require('google-play-scraper');

var fs = require('fs');

var languages = ['bn', 'gu', 'hi', 'kn', 'ml', 'mr', 'ne', 'pa', 'ta', 'te'];

directory = 'data';

function getAppIds(object) {
    return object.map((entry) => entry['appId']);
}

let max_review_count = 0;
let universal = [];
let langcounts = {}
for (collection in gplay.collection) {
    console.log("=====" + collection + "=====");
    let intersection = [];
    let union = [];
    let i = 0;
    let sum_rating = 0;
    let count = 0;
    let sum_downloads = 0;
    let genre_count = {};
    let iap_count = 0;
    let ad_count = 0;
    let ec_count = 0;
    langcounts[collection] = {};
    for (lang of languages) {
        langcounts[collection][lang] = 0
    }
    try {
        for (lang of languages) {
            const data = fs.readFileSync(directory + '/' + lang + '_' + collection + '.json', 'utf8')
            let object = JSON.parse(data);
            let appIds = getAppIds(object);
            langcounts[collection][lang] = appIds.length;
            if (i == 0) {
                intersection.push(...appIds);
                union.push(...appIds);
                for (entry of object) {
                    sum_rating += parseFloat(entry['score']);
                    sum_downloads += parseFloat(entry['maxInstalls']);
                    if (max_review_count < parseInt(entry['reviews'])) max_review_count = parseInt(entry['reviews']);
                    if (entry['genreId'] in genre_count) {
                        genre_count[entry['genreId']]++;
                    }
                    else genre_count[entry['genreId']] = 1;
                    if (entry['adSupported']) ad_count++;
                    if (entry['offersIAP']) iap_count++;
                    if (entry['editorsChoice']) ec_count++;
                    count++;
                }
            }
            else {
                for (entry of object) {
                    if (union.indexOf(entry['appId']) == -1) {
                        union.push(entry['appId']);
                        if (max_review_count < parseInt(entry['reviews'])) max_review_count = parseInt(entry['reviews']);
                        if (entry['genreId'] in genre_count) {
                            genre_count[entry['genreId']]++;
                        }
                        else genre_count[entry['genreId']] = 1;
                        if (entry['adSupported']) ad_count++;
                        if (entry['offersIAP']) iap_count++;
                        if (entry['editorsChoice']) ec_count++;
                    }
                    sum_rating += parseFloat(entry['score']);
                    sum_downloads += parseFloat(entry['maxInstalls']);
                    count++;
                }
                intersection = intersection.filter((entry) => (appIds.indexOf(entry) !== -1));
            }
            i++;
        }
        console.log("count -> " + count);
        console.log("intersection -> " + intersection.length);
        console.log("union -> " + union.length);
        console.log("avg_score -> " + (sum_rating / count));
        console.log("avg_downloads -> " + (sum_downloads / count))
        console.log("offers in-app purchases -> " + iap_count + " of " + union.length);
        console.log("contains ads -> " + ad_count + " of " + union.length);
        console.log("editors choice -> " + ec_count + " of " + union.length);
        for (genre in genre_count) {
            console.log(genre + " -> " + genre_count[genre] + " of " + union.length);
        }

        for (lang of languages) {
            const data = fs.readFileSync(directory + '/' + lang + '_' + collection + '.json', 'utf8')
            let object = JSON.parse(data);
            let appIds = getAppIds(object);
            let app_count = 0;
            for (entry of appIds) {
                if (intersection.indexOf(entry) == -1) {
                    app_count++;
                }
            }
            console.log("count of uncommon apps in " + lang + " : " + app_count)
        }
    } catch (err) {
        console.error(err)
    }
    for (entry of union) {
        if (universal.indexOf(entry) == -1) {
            universal.push(entry);
        }
    }
}

header = "Category"
for (lang of languages) {
    header = header + " & " + lang
}
console.log(header)

for (category in langcounts) {
    data = category
    for (lang in langcounts[category]) {
        data = data + " & " + langcounts[category][lang]
    }
    console.log(data)
}
console.log("\nUniversal App ID length: " + universal.length);
console.log("Max Review Count: " + max_review_count);

// fs.writeFileSync(directory + "/AllAppIDs.json", JSON.stringify(universal), 'utf-8');