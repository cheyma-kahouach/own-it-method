const PDF = "https://www.cheymakahouach.com/hook-finder/HookFinderPlaybook.pdf";
const FROM = "Cheyma Kahouach <hello@cheymakahouach.com>";

const html = `<div style="background:#FFFDFC;padding:32px 16px;font-family:Arial,sans-serif;color:#2F0D18">
<div style="max-width:520px;margin:0 auto;font-size:17px;line-height:1.6">
<p style="margin:0 0 16px">Hi babe! \u{1F497}</p>
<p style="margin:0 0 16px">Welcome to the world of women who have steady inbound leads coming in from Instagram. every. single. week.</p>
<p style="margin:0 0 16px">Your Hook Finder Playbook is right here:</p>
<p style="margin:24px 0"><a href="${PDF}" style="background:#AB274F;color:#FFFDFC;text-decoration:none;font-weight:700;padding:16px 32px;border-radius:999px;display:inline-block">Download the playbook</a></p>
<p style="margin:0 0 16px">Fair warning: it only works if you fill it in. Reading it and nodding does nothing, trust me.</p>
<p style="margin:0 0 16px">I'm Cheyma. 4 years of doing this. No degree. No first job (kind of). Just sheer will and an ever growing need to own as many pink trinkets and Hello Kitty plushies as possible, which means I need a lot of money, high maintenance girl things. If you have to know one thing about me, it's that as much as I love doom scrolling, sleeping in and iced matcha lattes, I love seeing women thrive online and build personal brands that actually support them financially.</p>
<p style="margin:0 0 16px">Judge my free stuff yourself. If it's fluff, it's fluff, tell me. If it helps, even better.</p>
<p style="margin:24px 0 16px">Cheyma \u{1F497}</p>
<p style="margin:0">PS. Do you know exactly who you're posting for right now? Yes or no? Hit reply. I WILL reply to you, pinky promise.</p>
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
      subject: "here's the playbook, babe \u{1F48C}",
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
