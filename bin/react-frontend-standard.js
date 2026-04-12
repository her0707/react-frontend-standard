#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");

const command = process.argv[2] ?? "help";
const args = process.argv.slice(3);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = question =>
  new Promise(resolve => {
    rl.question(question, answer => resolve(answer.trim()));
  });

const printHelp = () => {
  console.log(`
react-frontend-standard

Usage:
  react-frontend-standard
  react-frontend-standard init [target-path] [--with-skill]
  react-frontend-standard help

Examples:
  react-frontend-standard
  react-frontend-standard init .
  react-frontend-standard init ./my-app --with-skill

What it creates:
  - AGENTS.md
  - ARCHITECTURE.md
  - docs/coding-patterns.md
  - optional local skill at .agents/skills/react-frontend-standard
`);
};

const ensureDir = target => {
  fs.mkdirSync(target, { recursive: true });
};

const copyFile = (source, target) => {
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
};

const copyDir = (sourceDir, targetDir) => {
  ensureDir(targetDir);

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const source = path.join(sourceDir, entry.name);
    const target = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDir(source, target);
      continue;
    }

    copyFile(source, target);
  }
};

const writeFileByMode = (source, target, mode) => {
  const relativeTarget = path.relative(process.cwd(), target);
  const exists = fs.existsSync(target);

  if (exists && mode === "skip") {
    console.log(`skip: ${relativeTarget} already exists`);
    return;
  }

  copyFile(source, target);
  console.log(`${exists ? "overwrite" : "create"}: ${relativeTarget}`);
};

const copySkillByMode = (source, target, mode) => {
  const relativeTarget = path.relative(process.cwd(), target);
  const exists = fs.existsSync(target);

  if (exists && mode === "skip") {
    console.log(`skip: ${relativeTarget} already exists`);
    return;
  }

  copyDir(source, target);
  console.log(`${exists ? "overwrite" : "create"}: ${relativeTarget}`);
};

const resolveUserSkillPath = () => {
  const codexHome = process.env.CODEX_HOME;

  if (codexHome) {
    return path.join(codexHome, "skills", "react-frontend-standard");
  }

  const home = process.env.USERPROFILE ?? process.env.HOME;
  if (!home) {
    throw new Error("Could not resolve a user home directory for skill installation.");
  }

  return path.join(home, ".agents", "skills", "react-frontend-standard");
};

const initProject = ({ targetRoot, overwriteMode = "skip", installSkill = "none" }) => {
  const skillSource = path.join(packageRoot, "skills", "react-frontend-standard");
  const templatesDir = path.join(packageRoot, "templates");

  ensureDir(targetRoot);

  writeFileByMode(path.join(templatesDir, "AGENTS.md"), path.join(targetRoot, "AGENTS.md"), overwriteMode);
  writeFileByMode(
    path.join(templatesDir, "ARCHITECTURE.md"),
    path.join(targetRoot, "ARCHITECTURE.md"),
    overwriteMode,
  );
  writeFileByMode(
    path.join(templatesDir, "coding-patterns.md"),
    path.join(targetRoot, "docs", "coding-patterns.md"),
    overwriteMode,
  );

  if (installSkill === "project") {
    const skillTarget = path.join(targetRoot, ".agents", "skills", "react-frontend-standard");
    copySkillByMode(skillSource, skillTarget, overwriteMode);
  }

  if (installSkill === "user") {
    const skillTarget = resolveUserSkillPath();
    copySkillByMode(skillSource, skillTarget, overwriteMode);
  }

  console.log("");
  console.log("next:");
  console.log("1. define initial feature folders from backend domains or stable use cases");
  console.log("2. add thin route-entry screens");
  console.log("3. adjust local docs for the actual project");
};

const askChoice = async ({ title, options }) => {
  console.log("");
  console.log(title);
  options.forEach((option, index) => {
    console.log(`${index + 1}. ${option.label}`);
  });

  while (true) {
    const answer = await ask("> ");
    const index = Number(answer) - 1;

    if (Number.isInteger(index) && index >= 0 && index < options.length) {
      return options[index].value;
    }

    console.log("Please enter one of the listed numbers.");
  }
};

const runWizard = async () => {
  console.log("React Frontend Standard Setup");
  console.log("This wizard will create project docs and optionally install the local skill.");

  const targetInput = await ask("");
  const targetPathAnswer =
    targetInput || (await ask("Target path for project docs (default: current directory): "));
  const targetRoot = path.resolve(process.cwd(), targetPathAnswer || ".");

  const installSkill = await askChoice({
    title: "Where should the skill be installed?",
    options: [
      { label: "Do not install the skill", value: "none" },
      { label: "Install into this project (.agents/skills)", value: "project" },
      { label: "Install into my user environment", value: "user" },
    ],
  });

  const overwriteMode = await askChoice({
    title: "How should existing files be handled?",
    options: [
      { label: "Skip existing files (recommended)", value: "skip" },
      { label: "Overwrite existing files", value: "overwrite" },
    ],
  });

  console.log("");
  console.log("Summary");
  console.log(`- target: ${targetRoot}`);
  console.log(`- install skill: ${installSkill}`);
  console.log(`- existing files: ${overwriteMode}`);

  const confirm = await ask("Proceed? (y/N): ");
  if (!["y", "Y", "yes", "YES"].includes(confirm)) {
    console.log("Cancelled.");
    rl.close();
    process.exit(0);
  }

  initProject({ targetRoot, overwriteMode, installSkill });
  rl.close();
};

if (command === "help" || command === "--help" || command === "-h") {
  printHelp();
  rl.close();
  process.exit(0);
}

if (command === "init") {
  const targetArg = args.find(arg => !arg.startsWith("--")) ?? ".";
  const installSkill = args.includes("--with-skill") ? "project" : "none";
  initProject({
    targetRoot: path.resolve(process.cwd(), targetArg),
    overwriteMode: "skip",
    installSkill,
  });
  rl.close();
  process.exit(0);
}

if (command === "wizard" || command === "setup" || command === ".") {
  await runWizard();
  process.exit(0);
}

if (process.argv.length <= 2) {
  await runWizard();
  process.exit(0);
}

printHelp();
rl.close();
process.exit(1);
