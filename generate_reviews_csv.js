const { async } = require('rxjs');
var gplay = require('google-play-scraper');
var fs = require('fs');
var csvWriter = require('csv-writer');
var languages = ['bn', 'gu', 'hi', 'kn', 'ml', 'mr', 'ne', 'pa', 'ta', 'te'];

let directory = 'data', review_directory = directory + '/reviews_by_apps', t_review_directory = directory + '/t_reviews_by_apps';

// var sample_app_metadata = { "title": "Mars Jump", "description": "Tap to control\r\nJump on mars planet and finished the mission.\r\nPlay now", "descriptionHTML": "Tap to control<br>Jump on mars planet and finished the mission.<br>Play now", "summary": "ఈ ఆట థీమ్‌లో మార్స్ గ్రహం ఉంది. ప్లేయర్ జంప్ మరియు ముగింపు మిషన్.", "installs": "100+", "minInstalls": 100, "maxInstalls": 356, "score": 4.7, "scoreText": "4.7", "ratings": 10, "reviews": 9, "histogram": { "1": 0, "2": 0, "3": 1, "4": 1, "5": 8 }, "price": 10, "free": false, "currency": "INR", "priceText": "₹10.00", "offersIAP": false, "size": "15M", "androidVersion": "4.1", "androidVersionText": "4.1 మరియు తదుపరిది", "developer": "Gamezoneking", "developerId": "Gamezoneking", "developerEmail": "topgamekaithal@gmail.com", "developerAddress": "A  near building\nKota rajasthan", "developerInternalID": "7072805494330522391", "genre": "ఆర్కేడ్", "genreId": "GAME_ARCADE", "icon": "https://play-lh.googleusercontent.com/WqtoPEZPBnoQeJPyKcOCSfQkn1DEcpGhUZEyKbdhX7mJegJZlDKHa5Dhd6lj5Fmdz_9f", "headerImage": "https://play-lh.googleusercontent.com/rR_ICm3AC-wgR3Uu3DwD2w-rrvxo75CH2wj1tjHFOWSRr7m7hTxqnogz7IRXj0U7kg", "screenshots": ["https://play-lh.googleusercontent.com/CFeEnZ4Cg3BGtGwYEEy4CYtPXZj8xtD1kS63VkX1CaZzD-jszBQ15_26bAN1t0WIl_M", "https://play-lh.googleusercontent.com/OvOyhnqbSD76AmVYXLndd3liwhv5SH-mbC7MWnb9PWmvyZIxbvsS7spf-CgD1-qprQy6", "https://play-lh.googleusercontent.com/lh6Y6xNKoswUm3V1q5PA7ZzMX4Utn32Pa5Kp5FBtVBMG8YRqIZi3xti7OLtDSM8G2g", "https://play-lh.googleusercontent.com/sEdIB81lBHmtCmpVVabliR88OjVsLsl9cvbIXGxK9SPhP1Hcj8SARxINPx_KAODByVA", "https://play-lh.googleusercontent.com/Ld3AlyBv1uvQVGK9b-5LuMGFxIzV8bke-2iVGmlhgrYhrB7PXzF-HnhyZ0bR0O_xoQ", "https://play-lh.googleusercontent.com/Z8Gk64aQbPFQlfxbz-8FfeuUovNO0tamYXZsNix9EPOa4yvllZn1HWkEysJpMlhS1dc", "https://play-lh.googleusercontent.com/n5VqStvTCaWZclh2HtsenPoZqOYENzcVmTiTGO1DrBR5K_7wHkiMPxsvEgZ0pZYeE_X-"], "contentRating": "3+ కోసం రేట్ చేయబడింది", "adSupported": true, "released": "11 ఫిబ్ర, 2021", "updated": 1613033290000, "version": "21", "comments": [], "editorsChoice": false, "appId": "top.mars.missexp", "url": "https://play.google.com/store/apps/details?id=top.mars.missexp&hl=te&gl=in" };
var sample_review_metadata = { "id": "gp:AOqpTOHfiI5AHbFOzBM7Gt7TlmWv9_RLjlGBgtDbn8FNrJ5X15WoG6TU-I3lQlMSxcfqy4Y7fVxUGheukQtn3g", "userName": "Swaraj Saha", "userImage": "https://play-lh.googleusercontent.com/a-/AOh14GgyMofMOWfmfA7JBoW3GSXWGihcjDQxtb3u67Zb", "date": "2021-02-18T13:01:33.596Z", "score": 5, "scoreText": "5", "url": "https://play.google.com/store/apps/details?id=com.amazon.avod.thirdpartyclient&reviewId=gp:AOqpTOHfiI5AHbFOzBM7Gt7TlmWv9_RLjlGBgtDbn8FNrJ5X15WoG6TU-I3lQlMSxcfqy4Y7fVxUGheukQtn3g", "title": null, "text": "Good", "replyDate": null, "replyText": null, "version": "3.0.289.8047", "thumbsUp": 2, "criterias": [] }

// (async () => {
//     app_header = [{ id: "lang", title: "lang" }];
//     for (header_entry in sample_app_metadata) app_header.push({ id: header_entry, title: header_entry });
//     console.dir(app_header);
//     if (fs.existsSync('app_data.csv')) {
//         console.log("deleting csv");
//         fs.unlinkSync('app_data.csv')
//         if (!fs.existsSync('app_data.csv')) console.log("done")
//     }
//     var apps_csv = csvWriter.createObjectCsvWriter({
//         path: 'app_data.csv',
//         header: app_header
//     });
//     let i = 0;
//     for (collection in gplay.collection) {
//         for (lang of languages) {
//             try {
//                 const data = fs.readFileSync(directory + '/' + lang + '_' + collection + '.json', 'utf8')
//                 let obj = JSON.parse(data);
//                 obj = obj.map((value) => { return { lang, ...value } })
//                 await apps_csv.writeRecords(obj)
//             } catch (e) { console.error(e) }
//         }
//     }
// })();


async function process_reviews() {
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
    app_header = [
        { id: "lang", title: "lang" },
        { id: "appId", title: "appId" }
    ];
    for (header_entry in sample_review_metadata) app_header.push({ id: header_entry, title: header_entry });

    console.dir(app_header);
    if (fs.existsSync('review_data.csv')) {
        console.log("deleting csv");
        fs.unlinkSync('review_data.csv')
        if (!fs.existsSync('review_data.csv')) console.log("done")
    }
    var apps_csv = csvWriter.createObjectCsvWriter({
        path: 'review_data.csv',
        header: app_header
    });
    try {
        let data = fs.readFileSync(directory + "/AllAppIDs.json", 'utf-8');
        let appIds = JSON.parse(data);
        let total = 0;
        for (appId of appIds) {
            if (fs.existsSync(review_directory + "/" + appId + ".json")) {
                let raw = fs.readFileSync(review_directory + "/" + appId + ".json", 'utf-8');
                let reviews = JSON.parse(raw);
                entry = []
                for (lang of languages) {
                    if (lang in reviews) {
                        entry.push(...reviews[lang].map((value) => { return { appId, lang, ...value } }))
                    }
                    else {
                        console.log(appId + " : " + lang + " doesn't exists...");
                    }
                }
                await apps_csv.writeRecords(entry)
                total += entry.length
                console.log("finished... count: " + entry.length);
            }
        }
    }
    catch (e) { console.error(e) }
}

process_reviews();