export default `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Codex Web</title>
<style>
body { font-family: sans-serif; margin: 2rem; }
textarea { width: 100%; height: 150px; }
pre { background:#f0f0f0; padding:1rem; white-space: pre-wrap; }
</style>
</head>
<body>
<h1>Codex Web</h1>
<textarea id="prompt" placeholder="Enter your prompt here"></textarea><br>
<button id="run">Run</button>
<pre id="output"></pre>
<script>
document.getElementById('run').onclick = async () => {
  const prompt = (document.getElementById('prompt') as HTMLTextAreaElement).value;
  const res = await fetch('/run', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({prompt})});
  const data = await res.json();
  (document.getElementById('output') as HTMLElement).textContent = data.output;
};
</script>
</body>
</html>`;
