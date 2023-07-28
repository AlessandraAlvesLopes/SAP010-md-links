#!/usr/bin/env node

const { mdLinks } = require("./index.js");
const path = require("path");

const caminhoDoArquivo = path.join(__dirname, "arquivos", "arquivo.md");
mdLinks(caminhoDoArquivo, { validate: true })
  .then((links) => {
    console.log(links); // Array de links com informações de validação
  })
  .catch((err) => {
    console.error(err);
  });
