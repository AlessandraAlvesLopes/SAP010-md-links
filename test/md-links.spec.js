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
        url: 'https://nodejsxxxxxxxxx.org/en',
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

// Teste ler diretório

describe("lerDiretorioMd", () => {
  it("deve retornar um array com informações dos links encontrados nos arquivos do diretório", (done) => {
    const directoryPath = path.resolve(__dirname, "../src/arquivos");
    const filePath = path.resolve(__dirname, "../src/arquivos/arquivo.md"); 

    const expectedLinks = [
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
        url: 'https://nodejsxxxxxxxxx.org/en',
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
    ];

    lerDiretorioMd(directoryPath)
      .then((promises) => Promise.all(promises)) 
      .then((result) => {
        const flattenedResult = result.flat(); 
        expect(flattenedResult).toEqual(expectedLinks);
        done();
      })
      .catch((error) => {
        done(error);
      });
  }, 10000); 
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
      { url: 'https://nodejsxxxxxxxxx.org/en' },
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

describe('mdLinks', () => {
  const filePath = path.resolve(__dirname, '../src/arquivos/arquivo.md');
  const invalidFilePath = path.resolve(__dirname, '/caminho/invalido.md');
  
  const directoryPath = path.resolve(__dirname, '../src/arquivos');

  it('deve retornar os links de um arquivo individual corretamente', () => {
    return mdLinks(filePath).then((result) => {
      // Faça as asserções necessárias para verificar o resultado
      // Por exemplo, verifique se o resultado é uma array de objetos contendo as propriedades text, url e file
      expect(Array.isArray(result)).toBe(true);
      result.forEach((link) => {
        expect(link).toHaveProperty('text');
        expect(link).toHaveProperty('url');
        expect(link).toHaveProperty('file', filePath);
      });
    });
  });

  it('deve retornar um erro quando o arquivo não existe', () => {
    return mdLinks(invalidFilePath).catch((error) => {
      expect(error).toContain('Erro:');
    });
  });

  it('deve retornar os links de um diretório corretamente', () => {
    return mdLinks(directoryPath).then((result) => {
      // Faça as asserções necessárias para verificar o resultado
    });
  });

  it('deve retornar os links de um diretório quando opção "validate" é passada', () => {
    const options = { validate: true };

    return mdLinks(directoryPath, options).then((result) => {
      // Faça as asserções necessárias para verificar o resultado
      
    });
  });

  it('deve retornar os links de um diretório quando opção "stats" é passada', () => {
    const options = { stats: true };

    return mdLinks(directoryPath, options).then((result) => {
      // Faça as asserções necessárias para verificar o resultado
    });
  });

  it('deve retornar as estatísticas corretamente quando a opção "stats" é passada', () => {
    const options = { stats: true };

    return mdLinks(filePath, options).then((result) => {
      // Verifique se a saída está correta para este arquivo quando a opção "stats" é passada
      expect(result).toHaveProperty('totalLinks', 6);
      expect(result).toHaveProperty('uniqueLinks', 5);
      
    });
  });

  it('deve retornar os links de um diretório quando opções "validate" e "stats" são passadas', () => {
    const options = { validate: true, stats: true };

    return mdLinks(directoryPath, options).then((result) => {
      // Faça as asserções necessárias para verificar o resultado
    });
  });

  it('deve retornar as estatísticas corretamente quando as opções "validate" e "stats" são passadas', () => {
    const options = { validate: true, stats: true };
  
    return mdLinks(filePath, options).then((result) => {
      // Verifique se a saída está correta para este arquivo quando as opções "validate" e "stats" são passadas
      expect(result.stats).toHaveProperty('totalLinks', 6);
      expect(result.stats).toHaveProperty('uniqueLinks', 5);
      expect(result.stats).toHaveProperty('totalBrokenLinks', 1); 
    });
  });
});