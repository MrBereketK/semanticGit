import os

TOKEN_PATH = os.path.expanduser("~/.semanticgit_token")

def login_with_github():
    """
    Silently retrieves the stored Groq API key.
    If an old/invalid token (e.g. GitHub token) is found, it deletes it.
    """
    if os.path.exists(TOKEN_PATH):
        try:
            with open(TOKEN_PATH, "r", encoding="utf-8") as f:
                saved_token = f.read().strip()
                
            # Check if the saved key is a valid Groq API Key (starts with gsk_)
            if saved_token and saved_token.startswith("gsk_"):
                return saved_token
                
            # If it's an old token format, clean it up automatically
            os.remove(TOKEN_PATH)
        except Exception:
            pass

    return False