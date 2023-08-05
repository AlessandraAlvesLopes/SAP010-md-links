const {lerArquivos, lerDiretorioMd, validateLinks, mdLinks, getStats} = require('../src/index');
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
      },
      {
        text: 'Microsoft',
        url: 'https://www.microsoft.com/pt-br',
        file: filePath,
      }
     ]);
  });
});

// teste de validar

describe('validateLinks', () => {
  it('deve validar links corretamente', (done) => {
    const mockArrayLinks = [
      { url: 'http://example.com', text: 'Exemplo 1' },
      { url: 'http://invalid-url', text: 'Link Inválido' }
    ];

    const mockResponseSuccess = {
      status: 200,
      ok: true
    };

    const mockResponseFail = {
      status: 404,
      ok: false
    };

    // Mock do fetch para retornar a resposta desejada
    const fetchMock = jest.fn((url) => {
      if (url === 'http://example.com') {
        return Promise.resolve(mockResponseSuccess);
      } else {
        return Promise.reject(mockResponseFail);
      }
    });

    global.fetch = fetchMock;

    validateLinks(mockArrayLinks).then((result) => {
      expect(result).toEqual([
        { url: 'http://example.com', text: 'Exemplo 1', status: 200, ok: 'ok' },
        { url: 'http://invalid-url', text: 'Link Inválido', status: 404, ok: 'fail' }
      ]);
      done();
    }).catch(done.fail);
  });
});

//Teste getStats

describe('getStats', () => {
  it('Mostrar total de links e links únicos quando der o --stats', () => {
    const mockArrayLinks = [
      { url: 'https://www.google.com/' },
      { url: 'https://pt.wikipedia.org/wiki/Wikip%C3%A9dia:P%C3%A1gina_principal' },
      { url: 'https://nodejs.org/en' },
      { url: 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript' },
      { url: 'https://www.microsoft.com/pt-br' },
      { url: 'https://www.microsoft.com/pt-br' },
    ];

    const options = {
      validate: false,
      stats: true,
    };

    const result = {
      totalLinks: 6,
      uniqueLinks: 5,
    };

    const res = getStats(mockArrayLinks, options);
    expect(res).toEqual(result);
  });
});

// Teste mdLinks

 /* describe('mdLinks', () => {
  it('deve retornar links de um arquivo corretamente', (done) => {
    const filePath = '../src/arquivos/arquivo.md'; // Substitua pelo caminho do arquivo que você quer testar

    mdLinks(filePath, { validate: false, stats: false }).then((result) => {
      expect(result).toEqual([
        { text: 'Link 1', url: 'http://example.com/link1.md', file: filePath },
        { text: 'Link 2', url: 'http://example.com/link2.md', file: filePath }
        // Adicione mais links conforme necessário
      ]);
      done();
    }).catch(done.fail);
  });

  it('deve retornar estatísticas de links corretamente', (done) => {
    const filePath = '../src/arquivos/arquivo.md'; // Substitua pelo caminho do arquivo que você quer testar

    mdLinks(filePath, { validate: false, stats: true }).then((result) => {
      expect(result).toEqual({
        totalLinks: 6, // Substitua pelo número correto de links no arquivo
        uniqueLinks: 5 // Substitua pelo número correto de links únicos no arquivo
      });
      done();
    }).catch(done.fail);
  });

  it('deve retornar links validados corretamente', (done) => {
    const filePath = '../src/arquivos/arquivo.md'; // Substitua pelo caminho do arquivo que você quer testar

    mdLinks(filePath, { validate: true, stats: false }).then((result) => {
      // Verifique se os links têm as propriedades status e ok conforme o resultado esperado
      for (const link of result) {
        expect(link).toHaveProperty('status');
        expect(link).toHaveProperty('ok');
      }
      done();
    }).catch(done.fail);
  });

  it('deve retornar estatísticas de links validados corretamente', (done) => {
    const filePath = '../src/arquivos/arquivo.md'; // Substitua pelo caminho do arquivo que você quer testar

    mdLinks(filePath, { validate: true, stats: true }).then((result) => {
      expect(result).toEqual({
        totalLinks: 6, // Substitua pelo número correto de links no arquivo
        uniqueLinks: 5, // Substitua pelo número correto de links únicos no arquivo
        totalBrokenLinks: 0 // Substitua pelo número correto de links quebrados no arquivo
      });
      done();
    }).catch(done.fail);
  });
}); 
 */
