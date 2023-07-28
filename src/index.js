const { fail } = require("assert");
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
      const darMatch = [];
      while ((match = linkRegex.exec(data)) !== null) {
        darMatch.push(match);
      }

      const linksEncontrados = darMatch.map((match) => ({
        text: match[1],
        url: match[2],
        file: path,
      }));

      //console.log(linksEncontrados);
      resolve(linksEncontrados);
    });
  });
}

/* Apagar depois que tiver CLI pronta & os console.log
const caminhoDoArquivo = path.join(__dirname, "arquivos", "arquivo.md");
lerArquivos(caminhoDoArquivo);*/

function lerDiretorioMd(diretorio) {
  return new Promise((resolve, reject) => {
    fs.readdir(diretorio, (err, data) => {
      if (err) {
        console.error(err);
        return reject(`Erro ao ler o diretório: ${err}`);
      }

      const listaArquivosMd = data
        .filter((data) => data.endsWith(".md"))
        .map((data) => lerArquivos(path.join(diretorio, data)));

      // console.log(listaArquivosMd);
      resolve(listaArquivosMd);
    });
  });
}

/*const caminhoDoDiretorio = path.join(__dirname, "arquivos");
lerDiretorioMd(caminhoDoDiretorio);*/

function validateLinks(arrayLinks) {
  return Promise.all(
      arrayLinks.map((link) => {
          return fetch(link.url)
              .then((response) => {
  /*                 link.status = response.status;
                  link.ok = response.ok ? 'ok' : 'fail'; */
                  return {
                    ...link,
                    status : response.status, 
                    ok: response.ok ? 'ok' : 'fail'
                  };
              })
              .catch(() => {
 /*                  link.status = 404;
                  link.ok = false; */
                  return {
                    ...link,
                    status : 404, 
                    ok: 'fail'
                  };
              });
      })
  );
}

function mdLinks(path, option) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        return reject(`Erro: ${err}`);
      } else if (stats.isFile()) {
        lerArquivos(path) // Chame lerArquivos para obter os links do arquivo
          .then((links) => {
            if (option && option.validate) {
              return validateLinks(links); // Chame validateLinks se a opção "validate" estiver presente
            }
            return links;
          })
          .then(resolve)
          .catch(reject);
      } else if (stats.isDirectory()) {
        lerDiretorioMd(path) // Chame lerDiretorioMd para obter os links dos arquivos Markdown
          .then((links) => {
            if (option && option.validate) {
              return validateLinks(links); // Chame validateLinks se a opção "validate" estiver presente
            }
            return links;
          })
          .then(resolve)
          .catch(reject);
      }
    });
  });
}

module.exports = { mdLinks };