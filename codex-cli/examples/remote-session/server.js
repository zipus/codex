import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const clients = new Set();

app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  clients.add(res);
  req.on('close', () => {
    clients.delete(res);
  });
});

function broadcast(data) {
  for (const client of clients) {
    client.write(`data: ${data.replace(/\n/g, '\n')}\n\n`);
  }
}

const shell = spawn('script', ['-qfc', 'codex', '/dev/null']);

shell.stdout.on('data', (data) => broadcast(data.toString()));
shell.stderr.on('data', (data) => broadcast(data.toString()));
shell.on('close', (code) => broadcast(`\nProcess exited with code ${code}\n`));

app.post('/input', (req, res) => {
  if (req.body && typeof req.body.data === 'string') {
    shell.stdin.write(req.body.data);
  }
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
