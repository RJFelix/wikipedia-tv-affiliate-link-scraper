const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const log = (it) => {
  console.log(it);
  return it;
}

function scrapeStationList(url) {
  return JSDOM.fromURL(url)
    .then(jsd => jsd.window.document)
    .then(dom => dom.querySelectorAll('tr > td:nth-of-type(2) > b > a'))
    .then(anchorNodes => Array.from(anchorNodes))
    .then(anchors => {
      const rawStationData = anchors.map(a => ({
        name: a.textContent,
        wikiLink: a.href,
      }))
      return Promise.all(
        rawStationData.map(rawStation => {
          return JSDOM.fromURL(rawStation.wikiLink)
            .then(jsd => jsd.window.document)
            .then(document => document.querySelectorAll('.infobox tr'))
            .then(rowNodes => Array.from(rowNodes))
            .then(rows => rows.filter(row => row.textContent.includes('Website'))[0])
            .then(linkRow => linkRow.querySelector('a'))
            .then(a => a.href)
            .then(link => ({
              link,
              name: rawStation.name,
            }))
            .catch(() => ({
              name: rawStation.name,
              link: 'Could not retrieve link.'
            }))
        })
      )
    })
}

module.exports = scrapeStationList;
