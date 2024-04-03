const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/') {
    const imageUrl = parsedUrl.query.url;

    if (!imageUrl) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.write('Missing "url" query parameter');
      res.end();
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`
      <html>
        <head>
          <title>CORS Test</title>
        </head>
        <body>
          <h1>CORS Test</h1>
          <img src="${imageUrl}" alt="Test Image" />
          <hr>
          <h2>CORS Headers:</h2>
          <pre id="corsHeaders"></pre>
          <script>
            fetch('${imageUrl}', { method: 'HEAD' })
              .then(response => {
                const corsHeaders = {
                  'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                  'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                  'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
                  'Content-Type': response.headers.get('Content-Type')
                };
                document.getElementById('corsHeaders').textContent = JSON.stringify(corsHeaders, null, 2);
              })
              .catch(error => {
                document.getElementById('corsHeaders').textContent = 'Error: ' + error.message;
              });
          </script>
        </body>
      </html>
    `);
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('Not Found');
    res.end();
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});