const fs = require('fs');
const dataPath = '../data/10K';
const _ = require('lodash');
const output = '../data/bookworm/jsoncatalog.txt';

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
  return findLine('ACCESSION NUMBER', lines).split('-')[1];
};

const createSearchString = (fileName, lines) => {
  const root = 'https://www.sec.gov/Archives/edgar/data'
  const fileNameStripped = fileName.replace('-', '').replace('.txt', '');
  const indexKey = findLine('CENTRAL INDEX KEY', lines).replace(' ', '').split(':')[1];
  const indexKeyStripped = stripIndexKey(indexKey);
  return `${root}$/${indexKeyStripped}/${fileNameStripped}/${fileName}`;
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
      filename: file,
    });
  });
};

const writeMeta = (metadata, output) => {
  console.log(metadata);
};

const parseAndWriteAll = (directory) => {
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

parseAndWriteAll(dataPath);

 // {
 //   "searchstring" : 10K_link, https://www.sec.gov/Archives/edgar/data/1490196/000149019610000002/0001490196-10-000002.txt
 //   "companyName": companyName, // can categorize
 //   "year" : year,
 //   "filename" : filename,
 //   "industry" : subjectArray, // can categorize
 // }
