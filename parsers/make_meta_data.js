const fs = require('fs');
const dataPath = '../data/10K';

const output = '../data/bookworm/jsoncatalog.txt';

const stripIndexKey = (indexKey) => {
  return for (let i = 0; i < indexKey.length; i++) {
    if (indexKey[i] !== 0) {
      return indexKey.slice(i);
    }
  }
}

const getIndustry = (lines) => {
  return lines[24].split(':')[1].trim();
};

const getCompanyName = (lines) => {
  return lines[22].split(':')[1].trim();
};

const getReportYear = (lines) => {
  return lines[13].split('-')[1];
};

const createSearchString = (fileName, lines) => {
  const root = 'https://www.sec.gov/Archives/edgar/data'
  const fileNameStripped = fileName.replace('-', '').replace('.txt', '');
  const indexKey = lines[23].replace(' ', '').split(':')[1];
  const indexKeyStripped = stripIndexKey(indexKey);
  return `${root}$/${indexKeyStripped}/${fileNameStripped}/${fileName}`;
};

const readAndParse = (file, cb) => {
  fs.readFile(`${directory}/${file}`, 'utf8', (err, data) => {
    if (err) {
      cb(err);
    }
    const lines = data.toString().split('\n');

    return {
      searchString: createSearchString(file, lines),
      companyName: getCompanyName(lines),
      year: getReportYear(lines),
      industry: getCompanyIndustry(lines),
      filename: file,
    };
  });
};

const writeMeta = (line, output) => {};

const parseAndWriteAll = (directory) => {
  fs.readdir(directory, (err, files) => {
    if (err) {
      return console.log('ERROR:', err);
    }
    files.forEach((file) => {
      readAndParse(file, (parseErr, data) => {
        if (parseErr) {
          return console.log(`Err reading file ${file}`)
        }
        writeMeta(metaData, output);
      });
    });
  });
};

parseAll(dataPath);

 // {
 //   "searchstring" : 10K_link, https://www.sec.gov/Archives/edgar/data/1490196/000149019610000002/0001490196-10-000002.txt
 //   "companyName": companyName, // can categorize
 //   "year" : year,
 //   "filename" : filename,
 //   "industry" : subjectArray, // can categorize
 // }
