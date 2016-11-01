const fs = require('fs');
const industries = require('../data/industries');

const determineIndustry = () => {};

const parse = (fileString) => {};

const parseAll(directory) => {
  fs.readdir(directory, (err, files) => {
    if (err) {
      return console.log('ERROR:', err);
    }
    return files.forEach((file) => {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          return console.log(`Err reading file ${file}`);
        }
        console.log(data);
      });
    });
  });
};

parseAll('../data/10K');

 // {
 //   "searchstring" : companyName,
 //   "filename" : filename,
 //   "year" : year,
 //   "industry" : subjectArray,
 // 	 "ticker": ticker, ??
 // }
