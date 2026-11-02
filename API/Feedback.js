export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { job, lang, questions, answers } = req.body;

  const prompt = `You are a kind job interview coach. The candidate applies for a ${job} job and practises in language code ${lang}. They are a second-language speaker, so keep language simple.
For each question and answer below, reply with a short comment (what was good or unclear) and a better simple sentence they could say.
Then give 5 useful phrases to practise.
Reply ONLY as JSON: {"feedback":[{"comment":"...","better":"..."}], "phrases":["..."]}

Questions and answers:
${questions.map((q,i)=>`Q${i+1}: ${q}\nA${i+1}: ${answers[i]}`).join("\n\n")}`;

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await r.json();
  const text = data.content[0].text;
  res.status(200).json(JSON.parse(text));
}
