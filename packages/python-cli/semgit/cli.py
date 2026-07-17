import os
import sys
import subprocess
import questionary

# Using relative imports so the package modules find each other properly when installed globally
from .auth import TOKEN_PATH, login_with_github
from .api import generate_commit_options

def is_git_repository():
    try:
        subprocess.run(["git", "rev-parse", "--is-inside-work-tree"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return True
    except subprocess.CalledProcessError:
        return False

def main():
    print("\n🚀 SemanticGit Python Engine Active\n")

    if not is_git_repository():
        print("❌ Error: This directory is not an active Git repository.")
        sys.exit(1)

    token = login_with_github()
    
    # --- AUTOMATIC FIRST-TIME SETUP ---
    if not token:
        print("👋 First-time setup! Let's connect your CLI to the free AI engine.")
        print("💡 Click this pre-filled link, scroll to the bottom, and click the green 'Generate token' button:")
        print("👉 https://github.com/settings/tokens/new?description=SemanticGit%20CLI&scopes=\n")
        
        # questionary.password masks the key input while typing so it stays secure
        user_token = questionary.password("Paste your generated GitHub token here:").ask()
        
        if not user_token or user_token.strip() == "":
            print("❌ Setup cancelled. A token is required to authenticate with the AI engine.")
            sys.exit(1)
            
        # Dynamically create the file and save the token to their home profile directory
        try:
            with open(TOKEN_PATH, "w", encoding="utf-8") as f:
                f.write(user_token.strip())
            print("✨ Key saved successfully! Moving forward with analysis...\n")
            token = user_token.strip()
        except Exception as e:
            print(f"❌ Error saving token locally: {str(e)}")
            sys.exit(1)
    # ----------------------------------

    # 1. Prompt the user for input using questionary
    casual_message = questionary.text(
        "What changes did you make? (Plain English)",
        placeholder="e.g., fixed dashboard crashing on refresh for phone screens"
    ).ask()

    if not casual_message or casual_message.strip() == "":
        print("👋 Operation cancelled or empty input.")
        sys.exit(0)

    print("\n🤖 Running semantic engine analysis...")
    
    try:
        options = generate_commit_options(casual_message, token)
        print("✨ Semantic choices generated!\n")

        # 2. Render the Preview Block
        print("📋 Generated Options Preview:")
        print(f" [1] Short: {options['option_short']}")
        print(f" [2] Detailed: {options['option_detailed']}")
        print(f" [3] Alternative: {options['option_scope_focused']}\n")

        # 3. Present the interactive arrow-key list choice
        choice = questionary.select(
            "Use your arrow keys to select a format:",
            choices=[
                f"📝 Short: \"{options['option_short']}\"",
                f"📄 Detailed: \"{options['option_short']}\" (+ Append Body Explainer)",
                f"🎯 Alternative: \"{options['option_scope_focused']}\""
            ]
        ).ask()

        if not choice:
            print("👋 Operation cancelled.")
            sys.exit(0)

        # Map selected label back to the raw target string value
        if "📝 Short" in choice:
            final_message = options['option_short']
        elif "📄 Detailed" in choice:
            final_message = options['option_detailed']
        else:
            final_message = options['option_scope_focused']

        print(f"\nFinal Selected Commit:\n{final_message}\n")

        # 4. Natively execute the local Git commit
        subprocess.run(["git", "commit", "-m", final_message], check=True)
        print("🎉 Changes committed successfully via Python!")

    except Exception as e:
        print(f"⚠️ Error: {str(e)}. Make sure your changes are staged using 'git add .'")

if __name__ == "__main__":
    main()