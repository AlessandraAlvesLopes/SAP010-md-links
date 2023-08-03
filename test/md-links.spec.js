const {lerArquivos, lerDiretorioMd} = require('../src/index');
const path = require('path');
const fs = require('fs');

describe('lerArquivos', () => {
  it ('deve retornar um array vazio quando o arquivo não tem links',() => {
    return lerArquivos('./src/arquivos/vazio.md').then((result)=> {
      expect(result).toEqual([]);
    });
  });
});

it ('deve retornar um array com informações quando o arquivo tiver links',() => {
  const filePath = path.resolve(__dirname, '../src/arquivos/arquivo.md');
  return lerArquivos(filePath).then((result)=> {
    expect(result).toEqual([
      {
        text: 'Google',
        url: 'https://www.google.com/',
        file: filePath,
      },
      {
        text: 'Wikpedia',
        url: 'https://pt.wikipedia.org/wiki/Wikip%C3%A9dia:P%C3%A1gina_principal',
        file: filePath,
      },
      {
        text: 'Node',
        url: 'https://nodejs.org/en',
        file: filePath,
      },
      {
        text: 'JavaScript',
        url: 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript',
        file: filePath,
      },
      {
        text: 'Microsoft',
        url: 'https://www.microsoft.com/pt-br',
        file: filePath,
      }
     ]);
  });
});

// teste de diretório

/* describe('readDirectory', () => {
  it('deveria ler o diretório e retornar um array com os caminhos dos arquivos .md', (done) => {
    const pathInput = 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest';

    // Mock da função lerArquivos para retornar uma promessa resolvida
    jest.mock('../src/arquivos/arquivo.md', () => ({
      lerArquivos: (caminho) => Promise.resolve(caminho),
    }));

    lerDiretorioMd(pathInput)
      .then((files) => {
        expect(Array.isArray(files)).toBe(true);

        // Verifica se todos os arquivos retornados têm a extensão .md
        files.forEach((file) => {
          expect(path.extname(file)).toBe('.md');
        });

        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('deveria mostrar uma mensagem de erro caso ocorra um erro ao ler o diretório', (done) => {
    const pathInput = 'C:/Caminho/falso';

    lerDiretorioMd(pathInput)
      .then(() => {
        done(new Error('Esperava-se um erro, mas a promessa foi resolvida.'));
      })
      .catch((error) => {
        expect(error).toMatch('Erro ao ler o diretório');
        done();
      });
  });
});

 */