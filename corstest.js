const http = require('http');
const https = require('https');
const url = require('url');
const { exec } = require('child_process');

const guidelines = `
  CORS Test Server Guidelines:
  1. Start the server using: node corstest.js
  2. Access the server in your browser: http://localhost:3000
  3. Enter the URL of the file you want to test in the input field on the page.
  4. The page will display the file URL and the fetched CORS headers.
`;

const corsHeadersList = [
  'access-control-allow-origin',
  'access-control-allow-methods',
  'access-control-allow-headers',
  'access-control-max-age',
  'access-control-expose-headers',
  'access-control-allow-credentials',
];

const getHeaders = (fileUrl, callback) => {
  const parsedUrl = url.parse(fileUrl);
  const options = {
    method: 'HEAD',
    hostname: parsedUrl.hostname,
    path: parsedUrl.path,
  };

  const protocol = parsedUrl.protocol === 'https:' ? https : http;

  const req = protocol.request(options, (res) => {
    callback(null, res.headers);
  });

  req.on('error', (e) => {
    callback(e);
  });

  req.end();
};

const getMediaType = (headers) => {
  const contentType = headers['content-type'];
  if (contentType) {
    if (contentType.startsWith('image/')) {
      return 'image';
    } else if (contentType.startsWith('video/')) {
      return 'video';
    } else if (contentType.startsWith('audio/')) {
      return 'audio';
    }
  }
  return null;
};

const renderPage = (res, fileUrl = '', corsHeaders = {}, otherHeaders = {}, mediaType = '') => {
  let previewSection = '';
  if (mediaType === 'image') {
    previewSection = `<img src="${fileUrl}" alt="Image Preview" style="max-width: 600px; max-height: 400px; display: block; margin: 20px auto;" />`;
  } else if (mediaType === 'video') {
    previewSection = `<video controls style="max-width: 600px; max-height: 400px; display: block; margin: 20px auto;"><source src="${fileUrl}" type="${corsHeaders['content-type']}">Your browser does not support the video tag.</video>`;
  } else if (mediaType === 'audio') {
    previewSection = `<audio controls style="display: block; margin: 20px auto;"><source src="${fileUrl}" type="${corsHeaders['content-type']}">Your browser does not support the audio element.</audio>`;
  }

  const formatHeaders = (headers) => {
    return Object.entries(headers).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('');
  };

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(`
    <html>
      <head>
        <title>CORS Test</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          h1 {
            color: #444;
          }
          input[type="text"] {
            width: 80%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
          button {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            background-color: #007bff;
            color: #fff;
            cursor: pointer;
          }
          button:hover {
            background-color: #0056b3;
          }
          pre {
            background-color: #fff;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 80%;
            margin: 10px 0;
            overflow: auto;
          }
          .container {
            width: 100%;
            max-width: 800px;
            text-align: center;
          }
          .preview-section {
            margin: 20px 0;
          }
          ul {
            text-align: left;
            list-style-type: none;
            padding: 0;
          }
          li {
            background-color: #fff;
            margin: 5px 0;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>CORS Test</h1>
          <form method="GET" action="/">
            <input type="text" name="url" value="${fileUrl}" placeholder="Enter the URL to test" required />
            <button type="submit">Test URL</button>
          </form>
          ${previewSection ? `<div class="preview-section">${previewSection}</div>` : ''}
          ${fileUrl ? `<p>Testing URL: <a href="${fileUrl}" target="_blank">${fileUrl}</a></p>` : ''}
          <hr>
          <h2>Guidelines:</h2>
          <pre>${guidelines}</pre>
          <hr>
          ${Object.keys(corsHeaders).length > 0 ? `
          <h2>CORS Headers:</h2>
          <ul>${formatHeaders(corsHeaders)}</ul>` : ''}
          ${Object.keys(otherHeaders).length > 0 ? `
          <h2>Other Headers:</h2>
          <ul>${formatHeaders(otherHeaders)}</ul>` : ''}
        </div>
      </body>
    </html>
  `);
  res.end();
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/') {
    const fileUrl = parsedUrl.query.url;

    if (!fileUrl) {
      renderPage(res);
      return;
    }

    getHeaders(fileUrl, (error, headers) => {
      if (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.write('Error fetching headers: ' + error.message);
        res.end();
        return;
      }

      const corsHeaders = {};
      const otherHeaders = {};

      for (const [key, value] of Object.entries(headers)) {
        if (corsHeadersList.includes(key.toLowerCase())) {
          corsHeaders[key] = value;
        } else {
          otherHeaders[key] = value;
        }
      }

      const mediaType = getMediaType(headers);

      renderPage(res, fileUrl, corsHeaders, otherHeaders, mediaType);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('Not Found');
    res.end();
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  console.log(guidelines);
  
  // Open the default browser to the server URL
  const platform = process.platform;
  let command;
  if (platform === 'win32') {
    command = `start http://localhost:${port}/`;
  } else if (platform === 'darwin') {
    command = `open http://localhost:${port}/`;
  } else if (platform === 'linux') {
    command = `xdg-open http://localhost:${port}/`;
  }

  if (command) {
    exec(command, (err) => {
      if (err) {
        console.error('Failed to open browser:', err);
      }
    });
  } else {
    console.error('Platform not supported for automatic browser opening');
  }
});
