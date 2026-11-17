// POST /api/lead: a meeting request or Pocket Buttr sign up.
// Every lead is written to the server log. If LEAD_WEBHOOK_URL is set, it is also sent there
// (works with Google Sheets via Apps Script, Zapier, Make, Slack and most CRMs).
const FIELDS = ['type', 'name', 'phone', 'mode', 'when', 'calc', 'page', 'at'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const lead = {};
  for (const k of FIELDS) {
    const v = body && body[k];
    if (v == null) continue;
    lead[k] = typeof v === 'object' ? v : String(v).slice(0, 300);
  }
  if (!lead.phone || String(lead.phone).replace(/\D/g, '').length < 10) return res.status(400).json({ error: 'Phone needed' });
  lead.receivedAt = new Date().toISOString();

  console.log('LEAD', JSON.stringify(lead));
  const hook = process.env.LEAD_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
    } catch (e) {
      console.error('lead webhook failed', e && e.message);
    }
  }
  return res.status(200).json({ ok: true });
}
