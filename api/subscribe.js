const PDF = "https://www.cheymakahouach.com/hook-finder/HookFinderPlaybook.pdf";
const FROM = "Cheyma Kahouach <hello@cheymakahouach.com>";

const html = `<div style="background:#FFFDFC;padding:32px 16px;font-family:Arial,sans-serif;color:#2F0D18">
<div style="max-width:520px;margin:0 auto;font-size:17px;line-height:1.6">
<p style="margin:0 0 16px">Hi,</p>
<p style="margin:0 0 16px">Here is your Hook Finder Playbook. Open it, fill in the blanks and post your first hook this week.</p>
<p style="margin:28px 0"><a href="${PDF}" style="background:#AB274F;color:#FFFDFC;text-decoration:none;font-weight:700;padding:16px 32px;border-radius:999px;display:inline-block">Download the playbook</a></p>
<p style="margin:0 0 16px">It is also attached to this email.</p>
<p style="margin:0 0 16px">Hit reply and tell me which hook you posted first. I read every message.</p>
<p style="margin:24px 0 0">Cheyma</p>
</div></div>`;

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(500).json({ ok: false });
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const email = String((body && body.email) || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) {
    return res.status(400).json({ ok: false, error: "invalid" });
  }
  const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers,
    body: JSON.stringify({
      from: FROM,
      to: [email],
      reply_to: "hello@cheymakahouach.com",
      subject: "Your Hook Finder Playbook",
      html,
      attachments: [{ filename: "The Hook Finder Playbook.pdf", path: PDF }],
    }),
  });
  if (!r.ok) return res.status(502).json({ ok: false });
  try {
    await fetch("https://api.resend.com/contacts", { method: "POST", headers, body: JSON.stringify({ email, unsubscribed: false }) });
  } catch (e) {}
  return res.status(200).json({ ok: true });
};
