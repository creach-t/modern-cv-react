/**
 * Script de test pour vérifier le bon fonctionnement du SSR
 * Exécutez avec: node server/test-ssr.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Liste des user-agents à tester
const userAgents = [
  // Bots standard
  'Googlebot/2.1 (+http://www.google.com/bot.html)',
  'Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)',
  'facebookexternalhit/1.1',
  
  // Navigateurs standard (ne devraient pas déclencher le SSR)
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15'
];

// Configuration
const PORT = 2585;
const HOST = 'localhost';
const OUTPUT_DIR = path.join(__dirname, 'test-results');

// Créer le dossier de sortie s'il n'existe pas
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Fonction pour effectuer une requête avec un user-agent spécifique
const makeRequest = (userAgent) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: '/',
      method: 'GET',
      headers: {
        'User-Agent': userAgent
      },
      timeout: 5000 // Ajouter un timeout de 5 secondes
    };

    console.log(`Envoi de la requête: ${HOST}:${PORT}/ avec user-agent "${userAgent}"`);

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Réponse reçue: ${res.statusCode}`);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', (error) => {
      console.error(`Erreur de connexion: ${error.message}`);
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      req.abort();
      reject(new Error('Timeout de la requête après 5 secondes'));
    });
    
    req.end();
  });
};

// Fonction pour vérifier le contenu et le type de rendu
const analyzeResponse = (response, userAgent) => {
  const isBot = (/bot|spider|crawler|facebook|slurp/i).test(userAgent);

  // Vérifier si le rendu est fait côté serveur ou client
  const renderedBy = response.body.includes('meta name="rendered-by" content="server"') ? 'server' : 'client';
  
  // Vérifier s'il y a du contenu prérendu entre les balises root
  const rootTagMatch = response.body.match(/<div id="root">([\s\S]*?)<\/div>/);
  const rootContent = rootTagMatch ? rootTagMatch[1].trim() : '';
  const hasSSRContent = rootContent.length > 10; // Contenu significatif
  
  const expectedRender = isBot ? 'server' : 'client';
  
  console.log(`Analyse pour ${userAgent.substring(0, 30)}...`);
  console.log(`  Détecté comme: ${isBot ? 'Bot' : 'Navigateur'}`);
  console.log(`  Rendu: ${renderedBy}`);
  console.log(`  Contenu SSR: ${hasSSRContent ? 'Oui' : 'Non'} (${rootContent.length} caractères)`);
  
  return {
    userAgent,
    isBot,
    renderedBy,
    hasSSRContent,
    matchesExpected: renderedBy === expectedRender,
    statusCode: response.statusCode
  };
};

// Fonction principale qui exécute les tests
const runTests = async () => {
  console.log('Test de compatibilité SSR...');
  console.log('----------------------------');
  
  const results = [];
  let passCount = 0;
  let failCount = 0;
  
  // Tester chaque user-agent
  for (const userAgent of userAgents) {
    try {
      console.log(`\nTesting avec user-agent: ${userAgent}`);
      const response = await makeRequest(userAgent);
      
      // Enregistrer le HTML pour inspection
      const filename = path.join(OUTPUT_DIR, `response-${userAgent.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}.html`);
      fs.writeFileSync(filename, response.body);
      
      // Analyser la réponse
      const result = analyzeResponse(response, userAgent);
      results.push(result);
      
      // Afficher le résultat
      console.log(`  Résultat: ${result.matchesExpected ? 'PASS ✓' : 'FAIL ✗'}`);
      console.log(`  Rendu par: ${result.renderedBy}`);
      console.log(`  Contenu SSR: ${result.hasSSRContent ? 'Oui' : 'Non'}`);
      console.log(`  Code HTTP: ${result.statusCode}`);
      console.log(`  Réponse enregistrée dans: ${filename}`);
      
      if (result.matchesExpected) {
        passCount++;
      } else {
        failCount++;
      }
    } catch (error) {
      console.error(`  ERREUR: ${error.message}`);
      failCount++;
    }
  }
  
  // Afficher le résumé
  console.log('\n----------------------------');
  console.log(`RÉSUMÉ: ${passCount} réussis, ${failCount} échoués`);
  console.log('----------------------------');
  
  // Enregistrer les résultats
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'results.json'),
    JSON.stringify(results, null, 2)
  );
  
  console.log(`Résultats complets enregistrés dans: ${path.join(OUTPUT_DIR, 'results.json')}`);
};

// Test aussi avec ?bot=1
const testBotParameter = async () => {
  try {
    console.log('\nTest avec paramètre ?bot=1...');
    
    const options = {
      hostname: HOST,
      port: PORT,
      path: '/?bot=1',
      method: 'GET',
      headers: {
        'User-Agent': 'Test Script'
      },
      timeout: 5000
    };

    const response = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      });
      
      req.on('error', (error) => {
        console.error(`Erreur de connexion pour bot=1: ${error.message}`);
        reject(error);
      });
      
      req.setTimeout(5000, () => {
        req.abort();
        reject(new Error('Timeout de la requête après 5 secondes'));
      });
      
      req.end();
    });
    
    // Enregistrer la réponse
    const filename = path.join(OUTPUT_DIR, 'response-bot-parameter.html');
    fs.writeFileSync(filename, response.body);
    
    // Vérification simple
    const isSSR = response.body.includes('meta name="rendered-by" content="server"');
    const rootTagMatch = response.body.match(/<div id="root">([\s\S]*?)<\/div>/);
    const rootContent = rootTagMatch ? rootTagMatch[1].trim() : '';
    const hasContent = rootContent.length > 10;
    
    console.log(`  Résultat: ${isSSR ? 'PASS ✓' : 'FAIL ✗'}`);
    console.log(`  Rendu par: ${isSSR ? 'server' : 'client'}`);
    console.log(`  Contenu SSR: ${hasContent ? 'Oui' : 'Non'} (${rootContent.length} caractères)`);
    console.log(`  Code HTTP: ${response.statusCode}`);
    console.log(`  Réponse enregistrée dans: ${filename}`);
  } catch (error) {
    console.error(`  ERREUR: ${error.message}`);
  }
};

// Générer un rapport HTML
const generateHtmlReport = () => {
  try {
    console.log('\nGénération du rapport HTML...');
    
    const resultsPath = path.join(OUTPUT_DIR, 'results.json');
    if (!fs.existsSync(resultsPath)) {
      console.error('  Fichier results.json introuvable, exécutez les tests d\'abord');
      return;
    }
    
    const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    
    const passCount = results.filter(r => r.matchesExpected).length;
    const failCount = results.length - passCount;
    
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rapport de test SSR</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1, h2 { color: #333; }
    .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .pass { color: #2e7d32; }
    .fail { color: #c62828; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    tr:hover { background-color: #f5f5f5; }
    .result-pass { background-color: #e8f5e9; }
    .result-fail { background-color: #ffebee; }
    .tag { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 12px; font-weight: bold; }
    .tag-server { background-color: #bbdefb; color: #0d47a1; }
    .tag-client { background-color: #ffecb3; color: #ff6f00; }
    .tag-bot { background-color: #c8e6c9; color: #1b5e20; }
    .tag-browser { background-color: #e1bee7; color: #4a148c; }
  </style>
</head>
<body>
  <h1>Rapport de test SSR</h1>
  
  <div class="summary">
    <h2>Résumé</h2>
    <p>
      <span class="pass">✓ ${passCount} tests réussis</span> |
      <span class="fail">✗ ${failCount} tests échoués</span> |
      Total: ${results.length} tests
    </p>
    <p>Rapport généré le ${new Date().toLocaleString()}</p>
  </div>
  
  <h2>Résultats détaillés</h2>
  <table>
    <thead>
      <tr>
        <th>User Agent</th>
        <th>Type</th>
        <th>Rendu</th>
        <th>Contenu SSR</th>
        <th>Code</th>
        <th>Résultat</th>
      </tr>
    </thead>
    <tbody>
      ${results.map(result => `
        <tr class="${result.matchesExpected ? 'result-pass' : 'result-fail'}">
          <td title="${result.userAgent}">${result.userAgent.substring(0, 50)}${result.userAgent.length > 50 ? '...' : ''}</td>
          <td><span class="tag tag-${result.isBot ? 'bot' : 'browser'}">${result.isBot ? 'Bot' : 'Navigateur'}</span></td>
          <td><span class="tag tag-${result.renderedBy}">${result.renderedBy}</span></td>
          <td>${result.hasSSRContent ? '✓' : '✗'}</td>
          <td>${result.statusCode}</td>
          <td><strong>${result.matchesExpected ? '✓ PASS' : '✗ FAIL'}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <h2>Fichiers de réponse</h2>
  <ul>
    ${fs.readdirSync(OUTPUT_DIR)
      .filter(file => file.startsWith('response-') && file.endsWith('.html'))
      .map(file => `
        <li><a href="${file}" target="_blank">${file}</a></li>
      `).join('')}
  </ul>
</body>
</html>`;
    
    const reportPath = path.join(OUTPUT_DIR, 'report.html');
    fs.writeFileSync(reportPath, html);
    
    console.log(`  Rapport HTML généré: ${reportPath}`);
  } catch (error) {
    console.error(`  ERREUR lors de la génération du rapport: ${error.message}`);
  }
};

// Exécuter les tests
console.log('Démarrage des tests...');
console.log('Assurez-vous que le serveur est en cours d\'exécution sur', `${HOST}:${PORT}`);

runTests()
  .then(() => testBotParameter())
  .then(() => generateHtmlReport())
  .catch(error => {
    console.error('Erreur lors de l\'exécution des tests:', error);
  })
  .finally(() => {
    console.log('\nTests terminés!');
  });