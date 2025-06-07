import express from 'express';
import { spawn } from 'child_process';

const port = process.env.PORT || 3000;
const app = express();

const INDEX_HTML = `<!doctype html><html><head><meta charset="utf-8" />
<title>Codex Remote Session</title>
<style>body{font-family:monospace;background:#000;color:#0f0;}#output{white-space:pre-wrap;background:#111;padding:8px;height:70vh;overflow-y:auto;}#input{width:100%;box-sizing:border-box;}</style>
</head><body><div id="output"></div><form id="form"><input id="input" autocomplete="off" autofocus /></form>
<script>const output=document.getElementById('output');const input=document.getElementById('input');const form=document.getElementById('form');const evt=new EventSource('/stream');evt.onmessage=e=>{output.textContent+=e.data+'\n';output.scrollTop=output.scrollHeight;};form.onsubmit=async e=>{e.preventDefault();await fetch('/input',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:input.value+'\n'})});input.value='';};</script></body></html>`;

app.use(express.json());

app.get('/', (_req, res) => {
  res.type('html').send(INDEX_HTML);
});

const clients = new Set<express.Response>();

app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  clients.add(res);
  req.on('close', () => clients.delete(res));
});

function broadcast(data: string) {
  for (const client of clients) {
    client.write(`data: ${data.replace(/\n/g, '\n')}\n\n`);
  }
}

const shell = spawn('script', ['-qfc', 'codex', '/dev/null'], { cwd: process.cwd() });

shell.stdout.on('data', (d) => broadcast(d.toString()));
shell.stderr.on('data', (d) => broadcast(d.toString()));
shell.on('close', (code) => broadcast(`\nProcess exited with code ${code}\n`));

app.post('/input', (req, res) => {
  if (req.body && typeof req.body.data === 'string') {
    shell.stdin.write(req.body.data);
  }
  res.status(204).end();
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
