const fs = require('fs');
const dataPath = '../data/10K';
const _ = require('lodash');
const jsoncatalog = '../data/bookworm/jsoncatalog.txt';

const findLine = (regex, lines) => {
  return _.find(lines, (line) => {
    return line.match(regex);
  });
};

const stripIndexKey = (indexKey) => {
  for (var i = 0; i < indexKey.length; i++) {
    if (indexKey[i] !== 0) {
      return indexKey.slice(i);
    }
  }
};

const getIndustry = (lines) => {
  return findLine('STANDARD INDUSTRIAL CLASSIFICATION', lines).split(':')[1].trim();
};

const getCompanyName = (lines) => {
  return findLine('COMPANY CONFORMED NAME', lines).split(':')[1].trim();
};

const getReportYear = (lines) => {
  const year = findLine('ACCESSION NUMBER', lines).split('-')[1];
  return new Date(`12-01-${year}`);
};

const createSearchString = (fileName, lines) => {
  const rootUrl = 'https://www.sec.gov/Archives/edgar/data/';
  const fileNameStripped = fileName.replace('-', '').replace('.txt', '').replace('-', '');
  const indexKey = findLine('CENTRAL INDEX KEY', lines).replace(' ', '').split(':')[1];
  const indexKeyStripped = stripIndexKey(indexKey).trim();
  const url = `${rootUrl}${indexKeyStripped}/${fileNameStripped}/${fileName}`;
  return url;
};

const readAndParse = (file, directory, cb) => {
  fs.readFile(`${directory}/${file}`, 'utf8', (err, data) => {
    if (err) {
      cb(err);
    }
    const lines = data.toString().split('\n');
    cb(null, {
      searchString: createSearchString(file, lines),
      companyName: getCompanyName(lines),
      year: getReportYear(lines),
      industry: getIndustry(lines),
      filename: file.replace('.txt', ''),
    });
  });
};

const writeMeta = (metadata, output) => {
  fs.appendFile(output, JSON.stringify(metadata) + '\n', function (err) {
    if (err) {
      console.log('error writing:' +  metadata.filename);
    }
  });
};

const parseAndWriteAll = (directory, output) => {

  fs.readdir(directory, (err, files) => {
    if (err) {
      return console.log('ERROR:', err);
    }
    files.forEach((file) => {
      readAndParse(file, directory, (parseErr, data) => {
        if (parseErr) {
          return console.log(`Err reading file ${file}`)
        }
        writeMeta(data, output);
      });
    });
  });
};

parseAndWriteAll(dataPath, jsoncatalog);
