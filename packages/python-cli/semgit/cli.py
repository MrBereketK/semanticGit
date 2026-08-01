import os
import sys
import subprocess
import requests
import getpass
from .auth import login_with_github, TOKEN_PATH
from .api import generate_commit_options

CURRENT_VERSION = "1.2.0"

def is_git_repository():
    try:
        subprocess.run(
            ["git", "rev-parse", "--is-inside-work-tree"],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        return True
    except subprocess.CalledProcessError:
        return False

def check_for_updates():
    """Silently checks PyPI in the background for new package updates."""
    try:
        response = requests.get("https://pypi.org/pypi/semgit-ai-engine/json", timeout=1.5)
        if response.status_code == 200:
            latest_version = response.json()["info"]["version"]
            if latest_version != CURRENT_VERSION:
                print(
                    f"\n🔔 A new version (v{latest_version}) of SemanticGit is available!\n"
                    f"   Run: pip install --upgrade semgit-ai-engine\n"
                )
    except Exception:
        pass

def main():
    print("🚀 SemanticGit Core Engine\n")

    check_for_updates()

    if not is_git_repository():
        print("❌ Error: This directory is not an active Git repository.")
        sys.exit(1)

    token = login_with_github()

    # ─── 🛠️ AUTOMATIC FIRST-TIME SETUP ───
    if not token:
        print("👋 First-time setup! Connect to the AI Engine")
        print("Get a free API key in 30 seconds (1-click sign in with GitHub/Google):")
        print("👉 https://console.groq.com/keys\n")

        try:
            user_token = getpass.getpass("Paste your API key here: ").strip()
        except KeyboardInterrupt:
            print("\n❌ Setup cancelled.")
            sys.exit(1)

        if not user_token:
            print("❌ API Key cannot be empty!")
            sys.exit(1)

        try:
            with open(TOKEN_PATH, "w", encoding="utf-8") as f:
                f.write(user_token)
            print("✨ Key saved safely to your local user profile!\n")
            token = user_token
        except Exception as err:
            print(f"❌ Error saving token locally: {err}")
            sys.exit(1)
    # ──────────────────────────────────────

    casual_message = input("What changes did you make? (Plain English): ").strip()
    if not casual_message:
        print("❌ Input cannot be empty!")
        sys.exit(1)

    print("🤖 Running semantic engine analysis...")

    try:
        options = generate_commit_options(casual_message, token)
        
        print("\n📋 Generated Options Preview:")
        print(f"[1] Short:\n{options.get('option_short')}\n")
        print(f"[2] Detailed:\n{options.get('option_detailed')}\n")
        print(f"[3] Alternative Scope:\n{options.get('option_scope_focused')}\n")

        print("Select format:")
        print("1. Short")
        print("2. Detailed")
        print("3. Alternative Scope")
        
        choice_num = input("Enter option (1-3): ").strip()

        if choice_num == "1":
            selected_commit = options.get("option_short")
        elif choice_num == "2":
            selected_commit = options.get("option_detailed")
        elif choice_num == "3":
            selected_commit = options.get("option_scope_focused")
        else:
            print("❌ Invalid selection.")
            sys.exit(1)

        # Natively run git commit
        subprocess.run(["git", "commit", "-m", selected_commit], check=True)
        print("\n🎉 Changes committed successfully!")

    except Exception as error:
        print(f"\n⚠️ Process failed: {error}")

if __name__ == "__main__":
    main()