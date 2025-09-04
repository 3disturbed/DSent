import assert from 'node:assert/strict';
import test from 'node:test';
import http from 'node:http';
import { createServer } from '../src/loaders/server.js';
import { loadConfig } from '../src/config/index.js';

const config = loadConfig();

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: 'localhost', port: config.PORT, path, method: 'GET' }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

// Start a server instance for tests
const app = createServer({ config });
const server = app.listen(config.PORT);

await test('health endpoint returns ok', async () => {
  const res = await makeRequest('/api/v1/health');
  assert.equal(res.status, 200);
  const json = JSON.parse(res.body);
  assert.equal(json.success, true);
  assert.equal(json.data.status, 'ok');
});

server.close();
