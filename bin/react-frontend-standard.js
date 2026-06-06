#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import readline from "node:readline";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));

const command = process.argv[2] ?? "help";
const args = process.argv.slice(3);

const manifestDirName = ".react-frontend-standard";
const manifestFileName = "manifest.json";
const packageName = packageJson.name;
const packageVersion = packageJson.version;

const templateSpecs = [
  {
    path: "AGENTS.md",
    kind: "template",
    source: "templates/AGENTS.md",
    sourcePath: path.join(packageRoot, "templates", "AGENTS.md"),
  },
  {
    path: "ARCHITECTURE.md",
    kind: "template",
    source: "templates/ARCHITECTURE.md",
    sourcePath: path.join(packageRoot, "templates", "ARCHITECTURE.md"),
  },
  {
    path: "docs/coding-patterns.md",
    kind: "template",
    source: "templates/coding-patterns.md",
    sourcePath: path.join(packageRoot, "templates", "coding-patterns.md"),
  },
];

const skillSourcePath = path.join(packageRoot, "skills", "react-frontend-standard");
const projectSkillPath = ".agents/skills/react-frontend-standard";
const hookScriptPath = ".react-frontend-standard/hooks/session-start.mjs";
const codexHooksPath = ".codex/hooks.json";
const claudeSettingsPath = ".claude/settings.json";

const toPosixPath = value => value.split(path.sep).join("/");

const ensureDir = target => {
  fs.mkdirSync(target, { recursive: true });
};

const hashText = value => `sha256-${crypto.createHash("sha256").update(value).digest("hex")}`;

const hashFile = filePath => hashText(fs.readFileSync(filePath));

const listFiles = dirPath => {
  const files = [];

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...listFiles(entryPath));
      continue;
    }

    files.push(entryPath);
  }

  return files;
};

const hashDir = dirPath => {
  const hash = crypto.createHash("sha256");

  for (const filePath of listFiles(dirPath)) {
    const relativePath = toPosixPath(path.relative(dirPath, filePath));
    hash.update(relativePath);
    hash.update("\0");
    hash.update(fs.readFileSync(filePath));
    hash.update("\0");
  }

  return `sha256-${hash.digest("hex")}`;
};

const hashPath = targetPath => {
  const stats = fs.statSync(targetPath);
  return stats.isDirectory() ? hashDir(targetPath) : hashFile(targetPath);
};

const writeTextFile = (target, content) => {
  ensureDir(path.dirname(target));
  fs.writeFileSync(target, content);
};

const writeJsonFile = (target, value) => {
  writeTextFile(target, `${JSON.stringify(value, null, 2)}\n`);
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

const displayPath = target => toPosixPath(path.relative(process.cwd(), target));

const writeFileByMode = (source, target, mode) => {
  const relativeTarget = displayPath(target);
  const exists = fs.existsSync(target);

  if (exists && mode === "skip") {
    console.log(`skip: ${relativeTarget} already exists`);
    return;
  }

  copyFile(source, target);
  console.log(`${exists ? "overwrite" : "create"}: ${relativeTarget}`);
};

const writeGeneratedTextByMode = (content, target, mode) => {
  const relativeTarget = displayPath(target);
  const exists = fs.existsSync(target);

  if (exists && mode === "skip") {
    console.log(`skip: ${relativeTarget} already exists`);
    return;
  }

  writeTextFile(target, content);
  console.log(`${exists ? "overwrite" : "create"}: ${relativeTarget}`);
};

const copySkillByMode = (source, target, mode) => {
  const relativeTarget = displayPath(target);
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

const manifestPathFor = targetRoot => path.join(targetRoot, manifestDirName, manifestFileName);

const readManifest = targetRoot => {
  const manifestPath = manifestPathFor(targetRoot);

  if (!fs.existsSync(manifestPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
};

const findManifestEntry = (manifest, relativePath) =>
  manifest?.managedFiles?.find(entry => entry.path === relativePath) ?? null;

const sessionHookScript = () =>
  [
    "#!/usr/bin/env node",
    "",
    'import process from "node:process";',
    'import { spawnSync } from "node:child_process";',
    "",
    "const readStdin = () =>",
    "  new Promise(resolve => {",
    '    let input = "";',
    '    process.stdin.setEncoding("utf8");',
    '    process.stdin.on("data", chunk => {',
    "      input += chunk;",
    "    });",
    '    process.stdin.on("end", () => resolve(input));',
    "  });",
    "",
    "const args = process.argv.slice(2);",
    'const platformIndex = args.indexOf("--platform");',
    'const platform = platformIndex >= 0 ? args[platformIndex + 1] : "codex";',
    "const input = await readStdin();",
    "let cwd = process.cwd();",
    "",
    "try {",
    "  const payload = JSON.parse(input);",
    '  if (payload && typeof payload.cwd === "string") {',
    "    cwd = payload.cwd;",
    "  }",
    "} catch {",
    "  // Hooks may run without JSON stdin in local smoke tests.",
    "}",
    "",
    'const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";',
    `const result = spawnSync(npxCommand, ["-y", "${packageName}@latest", "sync", cwd], {`,
    '  encoding: "utf8",',
    "  timeout: 60_000,",
    "  windowsHide: true,",
    "});",
    "",
    'const combinedOutput = [result.stdout, result.stderr].filter(Boolean).join("\\n").trim();',
    "const succeeded = result.status === 0;",
    "const fallbackError = result.error ? result.error.message : \"unknown error\";",
    "const summary = succeeded",
    '  ? combinedOutput || "react-frontend-standard is up to date."',
    '  : `react-frontend-standard sync failed: ${combinedOutput || fallbackError}`;',
    "",
    "const payload = {",
    "  continue: true,",
    "  hookSpecificOutput: {",
    '    hookEventName: "SessionStart",',
    "    additionalContext: summary,",
    "  },",
    "};",
    "",
    'if (platform === "claude" && /(^|\\n)(create|update|overwrite|skip modified):/i.test(combinedOutput)) {',
    "  payload.hookSpecificOutput.reloadSkills = true;",
    "}",
    "",
    "if (!succeeded) {",
    "  payload.systemMessage = summary;",
    "}",
    "",
    "console.log(JSON.stringify(payload));",
    "process.exit(0);",
  ].join("\n") + "\n";

const codexHooksJson = () =>
  `${JSON.stringify(
    {
      hooks: {
        SessionStart: [
          {
            matcher: "startup|resume",
            hooks: [
              {
                type: "command",
                command:
                  "sh -lc 'root=\"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\"; node \"$root/.react-frontend-standard/hooks/session-start.mjs\" --platform codex'",
                commandWindows:
                  "powershell -NoProfile -ExecutionPolicy Bypass -Command \"$root = git rev-parse --show-toplevel 2>$null; if (-not $root) { $root = (Get-Location).Path }; node (Join-Path $root '.react-frontend-standard/hooks/session-start.mjs') --platform codex\"",
                statusMessage: "Checking react-frontend-standard version",
                timeout: 60,
              },
            ],
          },
        ],
      },
    },
    null,
    2,
  )}\n`;

const claudeSettingsJson = () =>
  `${JSON.stringify(
    {
      hooks: {
        SessionStart: [
          {
            matcher: "startup|resume",
            hooks: [
              {
                type: "command",
                command: 'node "${CLAUDE_PROJECT_DIR}/.react-frontend-standard/hooks/session-start.mjs" --platform claude',
                timeout: 60,
              },
            ],
          },
        ],
      },
    },
    null,
    2,
  )}\n`;

const managedFilesFor = ({ installSkill, installHooks }) => {
  const managedFiles = templateSpecs.map(spec => ({
    path: spec.path,
    kind: spec.kind,
    source: spec.source,
    hash: hashPath(spec.sourcePath),
  }));

  if (installSkill === "project") {
    managedFiles.push({
      path: projectSkillPath,
      kind: "skill",
      source: "skills/react-frontend-standard",
      hash: hashPath(skillSourcePath),
    });
  }

  if (installSkill === "user") {
    managedFiles.push({
      path: resolveUserSkillPath(),
      kind: "user-skill",
      source: "skills/react-frontend-standard",
      external: true,
      hash: hashPath(skillSourcePath),
    });
  }

  if (installHooks) {
    managedFiles.push(
      {
        path: hookScriptPath,
        kind: "hook-script",
        source: "generated:session-start-hook",
        hash: hashText(sessionHookScript()),
      },
      {
        path: codexHooksPath,
        kind: "codex-hooks",
        source: "generated:codex-hooks",
        hash: hashText(codexHooksJson()),
      },
      {
        path: claudeSettingsPath,
        kind: "claude-settings",
        source: "generated:claude-settings",
        hash: hashText(claudeSettingsJson()),
      },
    );
  }

  return managedFiles;
};

const writeManifest = ({ targetRoot, installSkill, installHooks }) => {
  const previousManifest = readManifest(targetRoot);
  const now = new Date().toISOString();

  writeJsonFile(manifestPathFor(targetRoot), {
    schemaVersion: 1,
    package: packageName,
    version: packageVersion,
    installedAt: previousManifest?.installedAt ?? now,
    updatedAt: now,
    installSkill,
    installHooks,
    managedFiles: managedFilesFor({ installSkill, installHooks }),
  });
};

const parseInstallSkill = (cliArgs, fallback = "none") => {
  const wantsProjectSkill = cliArgs.includes("--with-skill");
  const wantsUserSkill = cliArgs.includes("--with-user-skill");

  if (wantsProjectSkill && wantsUserSkill) {
    throw new Error("Choose either --with-skill or --with-user-skill, not both.");
  }

  if (wantsProjectSkill) {
    return "project";
  }

  if (wantsUserSkill) {
    return "user";
  }

  return fallback;
};

const parseInstallHooks = (cliArgs, fallback = false) => {
  if (cliArgs.includes("--with-hooks")) {
    return true;
  }

  if (cliArgs.includes("--without-hooks")) {
    return false;
  }

  return fallback;
};

const targetArgFrom = cliArgs => cliArgs.find(arg => !arg.startsWith("--")) ?? ".";

const installHookFiles = ({ targetRoot, overwriteMode }) => {
  writeGeneratedTextByMode(sessionHookScript(), path.join(targetRoot, hookScriptPath), overwriteMode);
  writeGeneratedTextByMode(codexHooksJson(), path.join(targetRoot, codexHooksPath), overwriteMode);
  writeGeneratedTextByMode(claudeSettingsJson(), path.join(targetRoot, claudeSettingsPath), overwriteMode);
};

const initProject = ({ targetRoot, overwriteMode = "skip", installSkill = "none", installHooks = false }) => {
  ensureDir(targetRoot);

  for (const spec of templateSpecs) {
    writeFileByMode(spec.sourcePath, path.join(targetRoot, spec.path), overwriteMode);
  }

  if (installSkill === "project") {
    copySkillByMode(skillSourcePath, path.join(targetRoot, projectSkillPath), overwriteMode);
  }

  if (installSkill === "user") {
    copySkillByMode(skillSourcePath, resolveUserSkillPath(), overwriteMode);
  }

  if (installHooks) {
    installHookFiles({ targetRoot, overwriteMode });
  }

  writeManifest({ targetRoot, installSkill, installHooks });

  console.log("");
  console.log("next:");
  console.log("1. define initial feature folders from backend domains or stable use cases");
  console.log("2. add thin route-entry screens");
  console.log("3. adjust local docs for the actual project");
};

const compareVersions = (left, right) => {
  const leftParts = String(left).split(/[.-]/).map(part => Number.parseInt(part, 10) || 0);
  const rightParts = String(right).split(/[.-]/).map(part => Number.parseInt(part, 10) || 0);
  const length = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < length; index += 1) {
    const difference = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);

    if (difference !== 0) {
      return Math.sign(difference);
    }
  }

  return 0;
};

const latestPackageVersion = () => {
  if (process.env.RFS_NPM_LATEST_VERSION) {
    return process.env.RFS_NPM_LATEST_VERSION;
  }

  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npmCommand, ["view", `${packageName}@latest`, "version"], {
    encoding: "utf8",
    timeout: 30_000,
    windowsHide: true,
  });

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(output || result.error?.message || "Could not query npm for the latest version.");
  }

  return result.stdout.trim();
};

const checkProject = targetRoot => {
  const manifest = readManifest(targetRoot);

  if (!manifest) {
    console.log(`not installed: ${manifestDirName}/${manifestFileName} was not found`);
    return 1;
  }

  const latestVersion = latestPackageVersion();

  if (compareVersions(manifest.version, latestVersion) < 0) {
    console.log(`outdated: ${packageName} ${manifest.version} -> ${latestVersion}`);
    return 1;
  }

  console.log(`up to date: ${packageName} ${manifest.version}`);
  return 0;
};

const syncFileFromSource = ({ targetRoot, spec, previousEntry, overwriteMode }) => {
  const target = path.join(targetRoot, spec.path);
  const targetExists = fs.existsSync(target);
  const sourceHash = hashPath(spec.sourcePath);

  if (targetExists && hashPath(target) === sourceHash) {
    console.log(`ok: ${spec.path}`);
    return;
  }

  if (targetExists && overwriteMode !== "overwrite") {
    const previousHash = previousEntry?.hash;
    const targetHash = hashPath(target);

    if (!previousHash || targetHash !== previousHash) {
      console.log(`skip modified: ${spec.path}`);
      return;
    }
  }

  copyFile(spec.sourcePath, target);
  console.log(`${targetExists ? "update" : "create"}: ${spec.path}`);
};

const syncGeneratedText = ({ targetRoot, relativePath, content, previousEntry, overwriteMode }) => {
  const target = path.join(targetRoot, relativePath);
  const targetExists = fs.existsSync(target);
  const sourceHash = hashText(content);

  if (targetExists && hashPath(target) === sourceHash) {
    console.log(`ok: ${relativePath}`);
    return;
  }

  if (targetExists && overwriteMode !== "overwrite") {
    const previousHash = previousEntry?.hash;
    const targetHash = hashPath(target);

    if (!previousHash || targetHash !== previousHash) {
      console.log(`skip modified: ${relativePath}`);
      return;
    }
  }

  writeTextFile(target, content);
  console.log(`${targetExists ? "update" : "create"}: ${relativePath}`);
};

const syncSkill = ({ targetRoot, installSkill }) => {
  if (installSkill === "project") {
    const target = path.join(targetRoot, projectSkillPath);
    const targetExists = fs.existsSync(target);
    copyDir(skillSourcePath, target);
    console.log(`${targetExists ? "update" : "create"}: ${projectSkillPath}`);
  }

  if (installSkill === "user") {
    const target = resolveUserSkillPath();
    const targetExists = fs.existsSync(target);
    copyDir(skillSourcePath, target);
    console.log(`${targetExists ? "update" : "create"}: ${displayPath(target)}`);
  }
};

const syncProject = ({ targetRoot, overwriteMode, installSkill, installHooks }) => {
  const manifest = readManifest(targetRoot);

  if (!manifest) {
    console.log(`not installed: ${manifestDirName}/${manifestFileName} was not found`);
    return 1;
  }

  if (compareVersions(manifest.version, packageVersion) > 0 && overwriteMode !== "overwrite") {
    console.log(`installed version is newer than this CLI: ${manifest.version} > ${packageVersion}`);
    return 0;
  }

  const shouldSync =
    overwriteMode === "overwrite" ||
    compareVersions(manifest.version, packageVersion) < 0 ||
    installSkill !== manifest.installSkill ||
    installHooks !== Boolean(manifest.installHooks);

  if (!shouldSync) {
    console.log(`up to date: ${packageName} ${manifest.version}`);
    return 0;
  }

  for (const spec of templateSpecs) {
    syncFileFromSource({
      targetRoot,
      spec,
      previousEntry: findManifestEntry(manifest, spec.path),
      overwriteMode,
    });
  }

  syncSkill({ targetRoot, installSkill });

  if (installHooks) {
    syncGeneratedText({
      targetRoot,
      relativePath: hookScriptPath,
      content: sessionHookScript(),
      previousEntry: findManifestEntry(manifest, hookScriptPath),
      overwriteMode,
    });
    syncGeneratedText({
      targetRoot,
      relativePath: codexHooksPath,
      content: codexHooksJson(),
      previousEntry: findManifestEntry(manifest, codexHooksPath),
      overwriteMode,
    });
    syncGeneratedText({
      targetRoot,
      relativePath: claudeSettingsPath,
      content: claudeSettingsJson(),
      previousEntry: findManifestEntry(manifest, claudeSettingsPath),
      overwriteMode,
    });
  }

  writeManifest({ targetRoot, installSkill, installHooks });
  console.log(`synced: ${packageName} ${manifest.version} -> ${packageVersion}`);
  return 0;
};

const printHelp = () => {
  console.log(`
react-frontend-standard

Usage:
  react-frontend-standard
  react-frontend-standard init [target-path] [--with-skill] [--with-user-skill] [--with-hooks] [--overwrite]
  react-frontend-standard check [target-path]
  react-frontend-standard sync [target-path] [--with-skill] [--with-user-skill] [--with-hooks] [--without-hooks] [--overwrite]
  react-frontend-standard help

Examples:
  react-frontend-standard
  react-frontend-standard init .
  react-frontend-standard init ./my-app --with-skill --with-hooks
  react-frontend-standard init . --with-user-skill
  react-frontend-standard sync .
  react-frontend-standard check .

What it creates:
  - AGENTS.md
  - ARCHITECTURE.md
  - docs/coding-patterns.md
  - .react-frontend-standard/manifest.json
  - optional local skill at .agents/skills/react-frontend-standard
  - optional Codex and Claude Code SessionStart hooks
`);
};

const askChoice = async ({ rl, title, options }) => {
  const ask = question =>
    new Promise(resolve => {
      rl.question(question, answer => resolve(answer.trim()));
    });

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
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const ask = question =>
    new Promise(resolve => {
      rl.question(question, answer => resolve(answer.trim()));
    });

  console.log("React Frontend Standard Setup");
  console.log("This wizard will create project docs and optionally install the local skill.");

  const targetPathAnswer = await ask("Target path for project docs (default: current directory): ");
  const targetRoot = path.resolve(process.cwd(), targetPathAnswer || ".");

  const installSkill = await askChoice({
    rl,
    title: "Where should the skill be installed?",
    options: [
      { label: "Do not install the skill", value: "none" },
      { label: "Install into this project (.agents/skills)", value: "project" },
      { label: "Install into my user environment", value: "user" },
    ],
  });

  const installHooks = await askChoice({
    rl,
    title: "Should SessionStart update hooks be installed?",
    options: [
      { label: "Do not install hooks", value: false },
      { label: "Install Codex and Claude Code hooks", value: true },
    ],
  });

  const overwriteMode = await askChoice({
    rl,
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
  console.log(`- install hooks: ${installHooks}`);
  console.log(`- existing files: ${overwriteMode}`);

  const confirm = await ask("Proceed? (y/N): ");
  if (!["y", "Y", "yes", "YES"].includes(confirm)) {
    console.log("Cancelled.");
    rl.close();
    process.exit(0);
  }

  initProject({ targetRoot, overwriteMode, installSkill, installHooks });
  rl.close();
};

try {
  if (command === "help" || command === "--help" || command === "-h") {
    printHelp();
    process.exit(0);
  }

  if (command === "init") {
    const targetRoot = path.resolve(process.cwd(), targetArgFrom(args));
    const installSkill = parseInstallSkill(args);
    const installHooks = parseInstallHooks(args);

    initProject({
      targetRoot,
      overwriteMode: args.includes("--overwrite") ? "overwrite" : "skip",
      installSkill,
      installHooks,
    });
    process.exit(0);
  }

  if (command === "check") {
    const targetRoot = path.resolve(process.cwd(), targetArgFrom(args));
    process.exit(checkProject(targetRoot));
  }

  if (command === "sync") {
    const targetRoot = path.resolve(process.cwd(), targetArgFrom(args));
    const manifest = readManifest(targetRoot);
    const installSkill = parseInstallSkill(args, manifest?.installSkill ?? "none");
    const installHooks = parseInstallHooks(args, Boolean(manifest?.installHooks));

    process.exit(
      syncProject({
        targetRoot,
        overwriteMode: args.includes("--overwrite") ? "overwrite" : "safe",
        installSkill,
        installHooks,
      }),
    );
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
  process.exit(1);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
