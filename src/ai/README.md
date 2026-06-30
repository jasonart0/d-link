# AI Integration Architecture

OpenAI integration now runs through the local Node backend in `server/index.js`.

Market prediction now runs through `src/ai/trainModule.js`. The module builds candle features,
trains lightweight model weights from the loaded market history, and returns signal probability,
confidence, accuracy, and trained sample count to the dashboard.

Set `OPENAI_API_KEY` on the server process before using the ChatGPT bot. Optional settings:

- `OPENAI_MODEL` sets the Responses API model. Default: `gpt-4.1-mini`.
- `API_PORT` sets the backend port. Default: `8787`.
- `CLIENT_ORIGIN` sets the allowed browser origin. Default: `http://localhost:5173`.

No model training, proprietary AI service keys, or exchange credentials belong in the client bundle.
