const scrapeStationList = require('./scrape-station-list.js');
const fs = require('fs');

const log = (it) => {
  console.log(it);
  return it;
}

scrapeStationList('https://en.wikipedia.org/wiki/List_of_ABC_television_affiliates_(table)')
  .then(stationList => {
    fs.writeFile('abc.csv', stationList.reduce((str, station) => {
      return `${str}${station.name},${station.link}\n`
    }))
    console.log('Finished scraping ABC affiliates')
  });
