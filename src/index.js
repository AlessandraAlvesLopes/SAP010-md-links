const fs = require("fs");
const path = require("path");

function lerArquivos(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return reject(`Erro na leitura do arquivo: ${err}`);
      }

      const linkRegex = /\[([^[\]]+?)\]\((https?:\/\/[^\s?#.]+\S+?)\)/gm;
      let match;        

      const linksEncontrados = [];

      while ((match = linkRegex.exec(data)) !== null) {
        linksEncontrados.push({
          text: match[1],
          url: match[2],
          file: path,
        });
      }

      resolve(linksEncontrados);
    });
  });
}

function lerDiretorioMd(diretorio) {
  return new Promise((resolve, reject) => {
    fs.readdir(diretorio, (err, data) => {
      if (err) {
        console.error(err);
        return reject(`Erro ao ler o diretório: ${err}`);
      }

      const listaArquivosMd = data
        .filter((data) => data.endsWith(".md"))
        .map((data) => path.join(diretorio, data));

      resolve(listaArquivosMd);
    });
  });
}

const caminhoDoArquivo = path.join(__dirname, "arquivos", "arquivo.md");
lerArquivos(caminhoDoArquivo)
  .then((linksDoArquivo) => {
    console.log("Links encontrados no arquivo:");
    console.log(linksDoArquivo);

    const caminhoDoDiretorio = path.join(__dirname, "arquivos");
    return lerDiretorioMd(caminhoDoDiretorio);
  })
  .then((linksDoDiretorio) => {
    console.log("Links encontrados nos arquivos do diretório:");
    console.log(linksDoDiretorio);
  })
  .catch((err) => console.error(err));

  function mdLinks(path) {
    return new Promise((resolve, reject) => {
      fs.stat(path, (err, stats) => {
        if (err) {
          return reject(`Erro: ${err}`);
        } else if (stats.isFile()) {
          //console.log(lerArquivos);
          resolve(lerArquivos(path));
        } else if (stats.isDirectory()) {
          resolve(lerDiretorioMd(diretorio));
        }
      });
    });
  }
  
  module.exports = { mdLinks };