/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

/* config */
const languageFilesPath = path.resolve(path.dirname(__dirname), 'lang');
const defaultLanguageCode = 'en';
const filler = '!!!TRANSLATEME!!!';

/* magic */
const defaultLanguageFilePath = path.resolve(languageFilesPath, `${defaultLanguageCode}.json`);
const defaultValues = JSON.parse(fs.readFileSync(defaultLanguageFilePath).toString());
const translationKeys = Object.keys(defaultValues);

fs.readdirSync(languageFilesPath).filter((f) => f !== `${defaultLanguageCode}.json`).forEach((languageFileName) => {
  console.log(`Processing language: ${languageFileName}...`);

  const languageFilePath = path.resolve(languageFilesPath, languageFileName);
  const languageFileValues = JSON.parse(fs.readFileSync(languageFilePath).toString());

  const newLanguageFileContent = {};

  translationKeys.forEach((translationKey) => {
    newLanguageFileContent[translationKey] = languageFileValues[translationKey] || `${filler} ${defaultValues[translationKey]}`;
  });

  fs.writeFileSync(languageFilePath, `${JSON.stringify(newLanguageFileContent, null, 2)}\n`);

  console.log(`Done. Output is saved to ${languageFilesPath}/${languageFileName}.`);
});
