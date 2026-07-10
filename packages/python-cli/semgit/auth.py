import os

TOKEN_PATH = os.path.expanduser("~/.semanticgit_token")

def login_with_github():
    """
    Silently checks for the existing token file from Phase 1.
    """
    if os.path.exists(TOKEN_PATH):
        with open(TOKEN_PATH, "r", encoding="utf-8") as f:
            saved_token = f.read().strip()
            if saved_token:
                return saved_token
    return None