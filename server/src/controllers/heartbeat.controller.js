const { heartbeats } = require('../state/heartbeats');

function ping(req, res) {
  const { playerId, info } = req.body || {};
  const id = playerId || req.ip;
  heartbeats.set(id, { lastSeen: Date.now(), info });
  res.json({ ok: true });
}

function statuses(req, res) {
  const data = Array.from(heartbeats.entries()).map(([playerId, v]) => ({ playerId, ...v }));
  res.json(data);
}

module.exports = { ping, statuses };