import fs from "fs";
import path from "path";
import os from "os";

const TOKEN_PATH = path.join(os.homedir(), ".semanticgit_token");

/**
 * Silently retrieves the stored token or returns false if missing.
 * @returns {Promise<string|boolean>} The token string or false
 */
export async function loginWithGitHub() {
  if (fs.existsSync(TOKEN_PATH)) {
    const savedToken = fs.readFileSync(TOKEN_PATH, "utf8").trim();
    if (savedToken) return savedToken;
  }
  return false;
}
