# AI Integration Architecture

OpenAI integration now runs through the local Node backend in `server/index.js`.

Market prediction now runs through `src/ai/trainModule.js`. The module builds candle, news,
macro, and derivatives features, trains lightweight model weights from the loaded market history,
and returns signal probability, confidence, validation accuracy, context score, news impact, and
trained sample count to the dashboard.

The browser model is intentionally a risk-aware signal engine, not a guaranteed profit system.
It can reduce weak setups by requiring price action, sentiment, and risk context to align, but
all live trading still needs backtesting, position sizing, and human risk controls.

Set `OPENAI_API_KEY` on the server process before using the ChatGPT bot. Optional settings:

- `OPENAI_MODEL` sets the Responses API model. Default: `gpt-4.1-mini`.
- `API_PORT` sets the backend port. Default: `8787`.
- `CLIENT_ORIGIN` sets the allowed browser origin. Default: `http://localhost:5173`.

No model training, proprietary AI service keys, or exchange credentials belong in the client bundle.

Market context currently comes from `/api/market/context` with a mock provider shape:

- `news[]` headline sentiment and impact values, optionally aligned with `candleIndex`.
- `macro` risk appetite, dollar pressure, and rate stress.
- `derivatives` funding, open interest, long/short skew, and liquidation bias.

Replace `buildMarketContext` in `server/index.js` with a licensed news/sentiment data provider when
you are ready for production-grade market context.
