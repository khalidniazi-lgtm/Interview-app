export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { text, target } = req.body;
  const prompt = `A worker writes this in their own language: "${text}".
Give a natural, simple ${target} sentence they can say in a job interview.
Reply ONLY as JSON: {"sentence":"...", "pronunciation":"...", "tip":"one short tip in the user's own language"}`;
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({ model: "claude-sonnet-4-5", max_tokens: 500, messages: [{ role: "user", content: prompt }] })
  });
  const data = await r.json();
  res.status(200).json(JSON.parse(data.content[0].text));
}
