import requests
import json
import sys

def generate_commit_options(casual_message, api_key):
    # Active Groq AI Endpoint
    ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"

    system_instruction = """
You are a strict Git Version Control specialist enforcing the Conventional Commits 1.0.0 specification. 
Your sole purpose is to translate a developer's casual description of their code changes into exactly three distinct structural commit messages.

You must respond ONLY with a raw, valid JSON object matching the requested schema. Do not include markdown code blocks, backticks (```json), or any conversational introductory/concluding prose.

JSON Schema format to follow:
{
  "option_short": "feat(scope): short imperative text",
  "option_detailed": "feat(scope): short line\\n\\nDetailed background body text detailing why.",
  "option_scope_focused": "fix(alternative-scope): specialized line"
}

Types allowed: feat, fix, docs, style, refactor, perf, test, build, ci, chore.
"""

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": f'Formalize this casual commit message: "{casual_message}"'}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.1
    }

    try:
        response = requests.post(ENDPOINT, headers=headers, json=payload)

        if response.status_code != 200:
            raise Exception(f"Status {response.status_code}: {response.text}")

        ai_response_text = response.json()["choices"][0]["message"]["content"].strip()
        
        # Fallback safety to strip markdown code blocks if present
        if ai_response_text.startswith("```"):
            ai_response_text = (
                ai_response_text.replace("```json", "")
                .replace("```", "")
                .strip()
            )

        return json.loads(ai_response_text)
    except Exception as error:
        print(f"\n❌ Failed to communicate with AI engine: {error}")
        sys.exit(1)