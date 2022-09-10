const fs = require('fs');
const path = require('path');

/* config */
const filler = '!!!TRANSLATEME!!!';

/* magic */
const languageFilesPath = path.resolve(path.dirname(__dirname), 'lang');

fs.readdirSync(languageFilesPath).forEach((languageFileName) => {
  const languageFilePath = path.resolve(languageFilesPath, languageFileName);

  const languageFileContent = JSON.parse(fs.readFileSync(languageFilePath).toString());

  Object.keys(languageFileContent).forEach((translationKey) => {
    if (languageFileContent[translationKey].startsWith(filler)) {
      console.error('There are texts with missing translations!!!');
      process.exit(1);
    }
  });
});
