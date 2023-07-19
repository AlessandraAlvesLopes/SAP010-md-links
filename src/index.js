/* module.exports = () => {
  // ...
}; */
/* const fs = require('fs');

const filePath = './src/files/file.md';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error("erro na leitura", err);
    return;
  }

  
  console.log(data);
}); */

//função p extrair links

const fs = require('fs');

function extractLinksFromFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(`Erro na leitura do arquivo: ${err.message}`);
        return;
      }

      const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/gm;
      const links = [];
      let match;

      while ((match = linkRegex.exec(data)) !== null) {
        const [fullMatch, text, href] = match;
        links.push({ text, href });
      }

      resolve(links);
    });
  });
}

// Exemplo de uso da função:
const filePath = './src/files/file.md';
extractLinksFromFile(filePath)
  .then((links) => {
    console.log('Links encontrados no arquivo:');
    console.table(links);
  })
  .catch((error) => {
    console.error(error);
  });
