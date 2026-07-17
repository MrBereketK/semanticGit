#!/usr/bin/env node

import fs from "fs";
import path from "path";
import os from "os";
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

// Shared configuration location matching the Python tool exactly
const TOKEN_PATH = path.join(os.homedir(), ".semanticgit_token");

function isGitRepository() {
  try {
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.clear();
  intro("🚀 SemanticGit Core Engine");

  if (!isGitRepository()) {
    outro("❌ Error: This directory is not an active Git repository.");
    process.exit(1);
  }

  let token = await loginWithGitHub();

  // ─── 🛠️ AUTOMATIC NODE FIRST-TIME SETUP ───
  if (!token) {
    note(
      "Click this pre-filled link, scroll to the bottom, and click the green button:\n\n" +
        "👉 https://github.com/settings/tokens/new?description=SemanticGit%20CLI&scopes=",
      "👋 First-time setup! Connect to the free AI engine",
    );

    const userToken = await password({
      message: "Paste your generated GitHub token here:",
      mask: "*",
      validate(value) {
        const cleanValue = value ? value.trim() : "";
        if (cleanValue.length === 0) return "Token cannot be empty!";
      },
    });

    if (typeof userToken === "symbol" || !userToken) {
      outro(
        "❌ Setup cancelled. A token is required to authenticate with the AI engine.",
      );
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
  // ──────────────────────────────────────────

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
          label: `📄 Detailed: "${options.option_short}" (+ Append Body Explainer)`,
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
