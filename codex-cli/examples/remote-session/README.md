# Remote Codex Session

This example exposes a running Codex session over HTTP. It starts a small web
server that spawns a Codex process and streams the output to connected clients.
User input from the web page is forwarded to the Codex process.

## Usage

1. Install dependencies (`pnpm install`) if you haven't already.
2. Run `./run.sh` to start the server.
3. Open `http://localhost:3000` in your browser.

To share the session publicly you can create a tunnel with a tool like
[ngrok](https://ngrok.com/):

```bash
ngrok http 3000
```

Share the generated URL with collaborators. They will see the same Codex session
in their browser and can type commands in the input box.
