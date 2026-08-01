import fs from "fs";
import path from "path";
import os from "os";

const TOKEN_PATH = path.join(os.homedir(), ".semanticgit_token");

/**
 * Silently retrieves the stored Groq key.
 * If an old/invalid token (e.g. GitHub token) is found, it deletes it.
 * @returns {Promise<string|boolean>} The Groq API key or false
 */
export async function loginWithGitHub() {
  if (fs.existsSync(TOKEN_PATH)) {
    const savedToken = fs.readFileSync(TOKEN_PATH, "utf8").trim();

    // 🚀 Check if the saved key is a valid Groq API Key (starts with gsk_)
    if (savedToken && savedToken.startsWith("gsk_")) {
      return savedToken;
    }

    // If it's an old token format (e.g., ghp_ or old string), delete it automatically
    try {
      fs.unlinkSync(TOKEN_PATH);
    } catch {
      // Ignore deletion errors
    }
  }
  return false;
}
