import fetch from "node-fetch";

/**
 * Sends the casual message to the free GitHub Models API
 * and returns exactly 3 formalized Conventional Commit choices.
 * @param {string} casualMessage - The messy input from the developer
 * @param {string} githubToken - The fresh user access token from device flow
 * @returns {Promise<Object>} An object containing the 3 structured choices
 */
export async function generateCommitOptions(casualMessage, githubToken) {
  // Direct entrypoint for GitHub Models infrastructure
  const ENDPOINT = "https://models.inference.ai.azure.com/chat/completions";

  const systemInstruction = `
You are a strict Git Version Control specialist enforcing the Conventional Commits 1.0.0 specification. 
Your sole purpose is to translate a developer's casual description of their code changes into exactly three distinct structural commit messages.

You must respond ONLY with a raw, valid JSON object matching the requested schema. Do not include markdown code blocks, backticks (\`\`\`json), or any conversational introductory/concluding prose.

JSON Schema format to follow:
{
  "option_short": "feat(scope): short imperative text",
  "option_detailed": "feat(scope): short line\\n\\nDetailed background body text detailing why.",
  "option_scope_focused": "fix(alternative-scope): specialized line"
}

Types allowed: feat, fix, docs, style, refactor, perf, test, build, ci, chore.
`;

  const payload = {
    model: "gpt-4o-mini", // Targeted optimized free-tier model
    messages: [
      { role: "system", content: systemInstruction },
      {
        role: "user",
        content: `Formalize this casual commit message: "${casualMessage}"`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
  };

  try {
    console.log("🤖 Analyzing changes and generating semantic options...");

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${githubToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    let aiResponseText = data.choices[0].message.content.trim();

    // Fallback safety to strip markdown code blocks if present
    if (aiResponseText.startsWith("```")) {
      aiResponseText = aiResponseText
        .replace(/^```json\s*/, "")
        .replace(/```$/, "")
        .trim();
    }

    return JSON.parse(aiResponseText);
  } catch (error) {
    console.error(
      "❌ Failed to communicate with free AI engine:",
      error.message,
    );
    process.exit(1);
  }
}
