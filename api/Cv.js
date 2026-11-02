export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { name, job, experience, training, skills, cvLang } = req.body;
  const prompt = `Write the content of a one-page CV in ${cvLang} for a worker named ${name} applying for: ${job}.
Use simple, professional language. Do not invent facts: use only what is given.
Experience (raw): ${experience}
Training (raw): ${training}
Skills and languages (raw): ${skills}
Reply ONLY as JSON: {"summary":"2 short sentences", "h1":"heading for experience in ${cvLang}", "h2":"heading for training in ${cvLang}", "h3":"heading for skills in ${cvLang}", "experience":["..."], "training":["..."], "skills":["..."]}`;
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY;
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
  });
  const d = await r.json();
  res.status(200).json(JSON.parse(d.candidates[0].content.parts[0].text));
}
