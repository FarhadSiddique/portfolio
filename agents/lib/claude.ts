import { config } from "dotenv";
config({ path: ".env.local" });

const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY not set in .env.local");
  process.exit(1);
}

export async function askClaude(
  system: string,
  user: string,
  maxTokens = 4096
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error ${response.status}: ${error}`);
  }

  const data = (await response.json()) as { content: { text: string }[] };
  return data.content[0].text;
}
