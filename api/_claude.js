// Shared Claude client and call helper for the API routes.
import Anthropic from '@anthropic-ai/sdk';

export const MODEL = process.env.BUTTR_MODEL || 'claude-sonnet-5-5';

function key() {
  return (process.env.ANTHROPIC_API_KEY || '').trim();
}

export function keyInfo() {
  const k = key();
  if (!k) return { present: false };
  const kind = k.startsWith('sk-ant-api') ? 'api key' : k.startsWith('sk-ant-') ? k.split('-').slice(0, 3).join('-') + ' token' : 'unrecognised format';
  return { present: true, kind, length: k.length };
}

// Standard API keys go in x-api-key; other Claude credentials are sent as a bearer token.
let client = null;
export function claude() {
  if (client) return client;
  const k = key();
  client = k.startsWith('sk-ant-api') || !k.startsWith('sk-ant-') ? new Anthropic({ apiKey: k }) : new Anthropic({ authToken: k, apiKey: null });
  return client;
}

export function describeError(e) {
  if (!e) return 'unknown error';
  const status = e.status ? e.status + ' ' : '';
  const msg = (e.error && e.error.error && e.error.error.message) || e.message || String(e);
  return (status + msg).slice(0, 400);
}
