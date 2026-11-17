// Buttr website helpers: AI answers and lead capture, both through our own server routes.
(function () {
  window.buttrAsk = async function (payload) {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('ask failed: ' + res.status);
    const data = await res.json();
    return JSON.stringify(data);
  };

  window.buttrLead = function (lead) {
    try {
      const body = JSON.stringify(Object.assign({ page: location.href, at: new Date().toISOString() }, lead));
      fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(function () {});
    } catch (e) {}
  };
})();
