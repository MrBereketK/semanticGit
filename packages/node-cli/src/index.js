#!/usr/bin/env node

import fs from "fs";
import path from "path";
import os from "os";
import fetch from "node-fetch";
import { loginWithGitHub } from "./auth.js";
import { generateCommitOptions } from "./api.js";
import {
  intro,
  text,
  select,
  spinner,
  note,
  outro,
  password,
} from "@clack/prompts";
import { execSync } from "child_process";

const TOKEN_PATH = path.join(os.homedir(), ".semanticgit_token");
const CURRENT_VERSION = "1.2.0"; // Matches package.json

function isGitRepository() {
  try {
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks npm registry in the background to notify users if an update is available.
 */
async function checkForUpdates() {
  try {
    const res = await fetch(
      "[https://registry.npmjs.org/semgit-ai-engine/latest](https://registry.npmjs.org/semgit-ai-engine/latest)",
      {
        timeout: 1500,
      },
    );
    if (res.ok) {
      const data = await res.json();
      if (data.version && data.version !== CURRENT_VERSION) {
        note(
          `🔔 A new version (v${data.version}) of SemanticGit is available!\n` +
            `Run: npm install -g semgit-ai-engine@latest`,
          "Update Notice",
        );
      }
    }
  } catch {
    // Fail silently so it never slows down offline or slow connections
  }
}

async function main() {
  console.clear();
  intro("🚀 SemanticGit Core Engine");

  // Check for registry updates silently in parallel
  checkForUpdates();

  if (!isGitRepository()) {
    outro("❌ Error: This directory is not an active Git repository.");
    process.exit(1);
  }

  let token = await loginWithGitHub();

  // ─── 🛠️ AUTOMATIC FIRST-TIME SETUP ───
  if (!token) {
    note(
      "Get a free API key in 30 seconds (1-click sign in with GitHub/Google):\n\n" +
        "👉 [https://console.groq.com/keys](https://console.groq.com/keys)",
      "👋 First-time setup! Connect to the AI Engine",
    );

    const userToken = await password({
      message: "Paste your API key here:",
      mask: "*",
      validate(value) {
        const cleanValue = value ? value.trim() : "";
        if (cleanValue.length === 0) return "API Key cannot be empty!";
      },
    });

    if (typeof userToken === "symbol" || !userToken) {
      outro("❌ Setup cancelled. An API key is required to use the engine.");
      process.exit(1);
    }

    try {
      fs.writeFileSync(TOKEN_PATH, userToken.trim(), { encoding: "utf8" });
      note("Key saved safely to your local user profile!", "✨ Success");
      token = userToken.trim();
    } catch (err) {
      outro(`❌ Error saving token locally: ${err.message}`);
      process.exit(1);
    }
  }
  // ──────────────────────────────────────

  const casualMessage = await text({
    message: "What changes did you make? (Plain English)",
    placeholder: "e.g., fixed dashboard crashing on refresh for phone screens",
    validate(value) {
      const cleanValue = value ? value.trim() : "";
      if (cleanValue.length === 0) return "Input cannot be empty!";
    },
  });

  if (typeof casualMessage === "symbol") {
    outro("👋 Operation cancelled.");
    process.exit(0);
  }

  const s = spinner();
  s.start("🤖 Running semantic engine analysis...");

  try {
    const options = await generateCommitOptions(casualMessage, token);
    s.stop("✨ Semantic choices generated!");

    // ─── ✨ DETAILED PREVIEW BLOCK ───
    note(
      `[1] Short:\n${options.option_short}\n\n` +
        `[2] Detailed:\n${options.option_detailed}\n\n` +
        `[3] Alternative Scope:\n${options.option_scope_focused}`,
      "📋 Generated Options Preview",
    );

    const choice = await select({
      message: "Use your arrow keys to select a format:",
      options: [
        {
          value: options.option_short,
          label: `📝 Short: "${options.option_short}"`,
        },
        {
          value: options.option_detailed,
          label: `📄 Detailed: "${options.option_detailed}"`,
        },
        {
          value: options.option_scope_focused,
          label: `🎯 Alternative: "${options.option_scope_focused}"`,
        },
      ],
    });

    if (typeof choice === "symbol") {
      outro("👋 Operation cancelled.");
      process.exit(0);
    }

    note(choice, "Final Selected Git Commit Message");

    // Natively run git commit with the selected structured string safely
    execSync(`git commit -m "${choice.replace(/"/g, '\\"')}"`, {
      stdio: "inherit",
    });

    outro("🎉 Changes committed successfully!");
  } catch (error) {
    s.stop("❌ Process failed");
    outro(
      `⚠️ Error: ${error.message}. Make sure your changes are staged using "git add ."`,
    );
  }
}

main();
