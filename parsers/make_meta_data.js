const fs = require('fs');
const industries = require('../data/industries');

const dataPath = '../data/10K';

const determineIndustry = () => {};

const parse = (fileString) => {};

const parseAll = (directory) => {
  fs.readdir(directory, (err, files) => {
    if (err) {
      return console.log('ERROR:', err);
    }
    return files.forEach((file) => {
      fs.readFile(`${directory}/${file}`, 'utf8', (err, data) => {
        if (err) {
          return console.log(`Err reading file ${file}`);
        }
        console.log(data);
      });
    });
  });
};

parseAll(dataPath);

 // {
 //   "searchstring" : companyName,
 //   "filename" : filename,
 //   "year" : year,
 //   "industry" : subjectArray,
 // 	 "ticker": ticker, ??
 // }
