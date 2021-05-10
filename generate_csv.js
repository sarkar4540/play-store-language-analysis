const { async } = require('rxjs');
var gplay = require('google-play-scraper');
var fs = require('fs');
var csvWriter = require('csv-writer');
var languages = ['bn', 'gu', 'hi', 'kn', 'ml', 'mr', 'ne', 'pa', 'ta', 'te'];

let directory = 'data', review_directory = directory + '/reviews_by_apps', t_review_directory = directory + '/t_reviews_by_apps';

var sample_app_metadata = { "title": "Mars Jump", "description": "Tap to control\r\nJump on mars planet and finished the mission.\r\nPlay now", "descriptionHTML": "Tap to control<br>Jump on mars planet and finished the mission.<br>Play now", "summary": "ఈ ఆట థీమ్‌లో మార్స్ గ్రహం ఉంది. ప్లేయర్ జంప్ మరియు ముగింపు మిషన్.", "installs": "100+", "minInstalls": 100, "maxInstalls": 356, "score": 4.7, "scoreText": "4.7", "ratings": 10, "reviews": 9, "histogram": { "1": 0, "2": 0, "3": 1, "4": 1, "5": 8 }, "price": 10, "free": false, "currency": "INR", "priceText": "₹10.00", "offersIAP": false, "size": "15M", "androidVersion": "4.1", "androidVersionText": "4.1 మరియు తదుపరిది", "developer": "Gamezoneking", "developerId": "Gamezoneking", "developerEmail": "topgamekaithal@gmail.com", "developerAddress": "A  near building\nKota rajasthan", "developerInternalID": "7072805494330522391", "genre": "ఆర్కేడ్", "genreId": "GAME_ARCADE", "icon": "https://play-lh.googleusercontent.com/WqtoPEZPBnoQeJPyKcOCSfQkn1DEcpGhUZEyKbdhX7mJegJZlDKHa5Dhd6lj5Fmdz_9f", "headerImage": "https://play-lh.googleusercontent.com/rR_ICm3AC-wgR3Uu3DwD2w-rrvxo75CH2wj1tjHFOWSRr7m7hTxqnogz7IRXj0U7kg", "screenshots": ["https://play-lh.googleusercontent.com/CFeEnZ4Cg3BGtGwYEEy4CYtPXZj8xtD1kS63VkX1CaZzD-jszBQ15_26bAN1t0WIl_M", "https://play-lh.googleusercontent.com/OvOyhnqbSD76AmVYXLndd3liwhv5SH-mbC7MWnb9PWmvyZIxbvsS7spf-CgD1-qprQy6", "https://play-lh.googleusercontent.com/lh6Y6xNKoswUm3V1q5PA7ZzMX4Utn32Pa5Kp5FBtVBMG8YRqIZi3xti7OLtDSM8G2g", "https://play-lh.googleusercontent.com/sEdIB81lBHmtCmpVVabliR88OjVsLsl9cvbIXGxK9SPhP1Hcj8SARxINPx_KAODByVA", "https://play-lh.googleusercontent.com/Ld3AlyBv1uvQVGK9b-5LuMGFxIzV8bke-2iVGmlhgrYhrB7PXzF-HnhyZ0bR0O_xoQ", "https://play-lh.googleusercontent.com/Z8Gk64aQbPFQlfxbz-8FfeuUovNO0tamYXZsNix9EPOa4yvllZn1HWkEysJpMlhS1dc", "https://play-lh.googleusercontent.com/n5VqStvTCaWZclh2HtsenPoZqOYENzcVmTiTGO1DrBR5K_7wHkiMPxsvEgZ0pZYeE_X-"], "contentRating": "3+ కోసం రేట్ చేయబడింది", "adSupported": true, "released": "11 ఫిబ్ర, 2021", "updated": 1613033290000, "version": "21", "comments": [], "editorsChoice": false, "appId": "top.mars.missexp", "url": "https://play.google.com/store/apps/details?id=top.mars.missexp&hl=te&gl=in" };


(async () => {
    app_header = [{ id: "lang", title: "lang" }];
    for (header_entry in sample_app_metadata) app_header.push({ id: header_entry, title: header_entry });
    console.dir(app_header);
    if (fs.existsSync('app_data.csv')) {
        console.log("deleting csv");
        fs.unlinkSync('app_data.csv')
        if (!fs.existsSync('app_data.csv')) console.log("done")
    }
    var apps_csv = csvWriter.createObjectCsvWriter({
        path: 'app_data.csv',
        header: app_header
    });
    let i = 0;
    for (collection in gplay.collection) {
        for (lang of languages) {
            try {
                const data = fs.readFileSync(directory + '/' + lang + '_' + collection + '.json', 'utf8')
                let obj = JSON.parse(data);
                obj = obj.map((value) => { return { lang, ...value } })
                await apps_csv.writeRecords(obj)
            } catch (e) { console.error(e) }
        }
    }
})();

// (async () => {
//     let sim_err_count = 0;
//     if (!fs.existsSync(directory)) {
//         fs.mkdirSync(directory);
//     }
//     if (!fs.existsSync(review_directory)) {
//         fs.mkdirSync(review_directory);
//     }
//     if (!fs.existsSync(t_review_directory)) {
//         fs.mkdirSync(t_review_directory);
//     }
//     try {
//         let data = fs.readFileSync(directory + "/AllAppIDs.json", 'utf-8');
//         let appIds = JSON.parse(data);
//         let app_count = appIds.length;
//         let total_count = 0;
//         let i = 0;
//         for (appId of appIds) {
//             if (fs.existsSync(review_directory + "/" + appId + ".json")) {
//                 if (!fs.existsSync(t_review_directory + "/" + appId + ".json")) {
//                     console.log(++i + " of " + app_count + " : started translating reviews of " + appId);
//                     let raw = fs.readFileSync(review_directory + "/" + appId + ".json", 'utf-8');
//                     let reviews = JSON.parse(raw);
//                     let translated_reviews = {};
//                     let count = 0;
//                     for (lang of languages) {
//                         if (lang in reviews) {
//                             let l_count = 0;
//                             translated_reviews[lang] = [];
//                             for (review of reviews[lang]) {
//                                 try {
//                                     review.translated = await translate(review.text, { from: lang, to: 'en' });
//                                     translated_reviews[lang].push(review);
//                                     console.log(++total_count + " " + ++count + " " + ++l_count);
//                                     sim_err_count = 0;
//                                 } catch (e) { console.error(e); sim_err_count++; if (sim_err_count > 10) process.exit(1); }
//                                 if (l_count >= 100) break;
//                             }
//                         }
//                         else {
//                             console.log(appId + " : " + lang + " doesn't exists...");
//                         }
//                     }
//                     translated_reviews['count'] = count;
//                     fs.writeFileSync(t_review_directory + "/" + appId + ".json", JSON.stringify(translated_reviews), 'utf-8');
//                     console.log("finished... count: " + count);
//                 }
//                 else {
//                     console.log(++i + " : skipping.. file exists...");
//                 }
//             }
//             else {
//                 console.log(++i + " : " + appId + " skipping.. file doesn't exists...");
//             }
//         }
//     }
//     catch (e) { console.error(e) }
// })();
// fs.writeFileSync(directory + "/AllAppIDs.json", JSON.stringify(universal), 'utf-8');