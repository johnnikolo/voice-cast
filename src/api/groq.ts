import type { ScriptLine } from '../types';

export async function generateScript(topic: string): Promise<ScriptLine[]> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'user',
          content: `Generate a short, engaging podcast conversation between two hosts (A and B) about: "${topic}".

Rules:
- 6 to 8 turns total, alternating between A and B
- Each line should be 1-3 sentences, natural and conversational
- Start with host A
- Return ONLY valid JSON, no markdown, no explanation

Format:
[{"speaker":"A","text":"..."},{"speaker":"B","text":"..."}]`,
        },
      ],
      temperature: 0.8,
    }),
  });

  if (!res.ok) throw new Error(`Groq error: ${res.status}`);
  const data = await res.json();
  const raw: string = data.choices[0].message.content;
  return JSON.parse(raw) as ScriptLine[];
}
