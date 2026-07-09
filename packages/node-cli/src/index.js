#!/usr/bin/env node

import { loginWithGitHub } from "./auth.js";
import { generateCommitOptions } from "./api.js";
import { intro, text, select, spinner, note, outro } from "@clack/prompts";
import { execSync } from "child_process";

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

  const token = await loginWithGitHub();
  if (!token) {
    outro("❌ Active token credentials not detected.");
    process.exit(1);
  }

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

    // ─── ✨ NEW: DETAILED PREVIEW BLOCK ───
    // This prints out the full multiline explanation so you can read it before picking!
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
