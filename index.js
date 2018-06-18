var scraper = require('google-search-scraper');
const csv = require('csvtojson');
const q = require('q');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: 'response.csv',
    header: [{
            id: 'text',
            title: 'Text'
        },
        {
            id: 'location',
            title: 'Location'
        },
    ]
});



var deferArr = [];
const csvFilePath = 'test.csv'
csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        console.log(jsonObj);
        jsonObj.forEach(function(obj, index) {
            var defer = q.defer();
            deferArr.push(defer.promise);
            var options = {
                query: obj.text,
                host: 'www.google.co.in',
                lang: 'en',
                limit: 100
            };
            var count = 0
            scraper.search(options, function(err, url) {
                // This is called for each result
                if (err) throw err;
                // console.log(url);
                count++;
                if (url.indexOf('financebuddha') > -1 && !jsonObj[index].location) {
                    console.log(count);
                    jsonObj[index].location = count.toString();
		    console.log(obj.text + ',' + count);
                    // console.log(jsonObj);
                    defer.resolve();
                }
            });
        })

        q.all(deferArr).then(function() {
            console.log(jsonObj);
            // const records = [ { text: 'same day loan', location: 39 },
            //  { text: 'urgent personal loan', location: 4 } ];

            csvWriter.writeRecords(jsonObj) // returns a promise
                .then(() => {
                    console.log('...Done');
                });

            console.log(csv);
        });
    })
