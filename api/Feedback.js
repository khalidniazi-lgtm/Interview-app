export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { job, lang, questions, answers } = req.body;

  const prompt = `You are a kind job interview coach. The candidate applies for a ${job} job and practises in language code ${lang}. They are a second-language speaker, so keep language simple.
For each question and answer below, reply with a short comment (what was good or unclear) and a better simple sentence they could say.
Then give 5 useful phrases to practise.
Reply ONLY as JSON: {"feedback":[{"comment":"...","better":"..."}], "phrases":["..."]}

Questions and answers:
${questions.map((q,i)=>`Q${i+1}: ${q}\nA${i+1}: ${answers[i]}`).join("\n\n")}`;

  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY;

  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    })
  });
  const data = await r.json();
  const text = data.candidates[0].content.parts[0].text;
  res.status(200).json(JSON.parse(text));
}
