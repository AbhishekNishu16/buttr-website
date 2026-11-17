// GET /api/health: shows whether AI answers can work, without revealing the key.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { MODEL, keyInfo, claude, describeError } from './_claude.js';
import { answer } from './ask.js';

export default async function handler(req, res) {
  const out = { model: MODEL, key: keyInfo() };
  try {
    out.knowledge = readFileSync(join(process.cwd(), 'content', 'buttr_knowledge.md'), 'utf8').length + ' characters';
  } catch (e) {
    out.knowledge = 'missing: ' + e.message;
  }
  if (!out.key.present) {
    out.result = 'No ANTHROPIC_API_KEY on this deployment. Add it in Settings, Environment Variables, then redeploy.';
    return res.status(200).json(out);
  }
  try {
    const r = await claude().messages.create({ model: MODEL, max_tokens: 20, messages: [{ role: 'user', content: 'Reply with the word ready.' }] });
    out.plainCall = 'ok: ' + ((r.content.find(b => b.type === 'text') || {}).text || '').trim();
  } catch (e) {
    out.plainCall = 'failed: ' + describeError(e);
  }
  try {
    const r = await claude().messages.create({
      model: MODEL, max_tokens: 60,
      messages: [{ role: 'user', content: 'Say hello.' }],
      output_config: { format: { type: 'json_schema', schema: { type: 'object', additionalProperties: false, required: ['reply'], properties: { reply: { type: 'string' } } } } }
    });
    out.structuredCall = 'ok: ' + ((r.content.find(b => b.type === 'text') || {}).text || '').trim().slice(0, 80);
  } catch (e) {
    out.structuredCall = 'failed: ' + describeError(e);
  }
  if (req.query && req.query.q) {
    const t0 = Date.now();
    const a = await answer({ messages: [{ role: 'user', content: String(req.query.q).slice(0, 300) }], topic: null, calc: null });
    out.question = { seconds: ((Date.now() - t0) / 1000).toFixed(1), steps: a.log, reply: a.result.reply, visual: a.result.visual ? a.result.visual.kind : null };
  }
  return res.status(200).json(out);
}
