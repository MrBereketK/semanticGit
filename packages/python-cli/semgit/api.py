import requests
import json

ENDPOINT = "https://models.inference.ai.azure.com/chat/completions"

def generate_commit_options(casual_message, github_token):
    system_instruction = """
    You are a strict Git Version Control specialist enforcing the Conventional Commits 1.0.0 specification. 
    Translate the description into exactly three structural commit messages.

    Respond ONLY with a raw, valid JSON object matching the requested schema. Do not include markdown code blocks, backticks (```json), or conversational prose.

    JSON Schema format to follow:
    {
      "option_short": "feat(scope): short imperative text",
      "option_detailed": "feat(scope): short line\\n\\nDetailed background body text detailing why.",
      "option_scope_focused": "fix(alternative-scope): specialized line"
    }
    """

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {github_token}"
    }

    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": f'Formalize this casual commit message: "{casual_message}"'}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.2
    }

    response = requests.post(ENDPOINT, headers=headers, json=payload)
    
    if response.status_code != 200:
        raise Exception(f"Status {response.status_code}: {response.text}")

    ai_response_text = response.json()["choices"][0]["message"]["content"].strip()
    return json.loads(ai_response_text)