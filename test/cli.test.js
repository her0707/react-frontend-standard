import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const cliPath = path.join(repoRoot, "bin", "react-frontend-standard.js");
const packageJsonPath = path.join(repoRoot, "package.json");

const readJson = filePath => JSON.parse(fs.readFileSync(filePath, "utf8"));

const makeTarget = name => fs.mkdtempSync(path.join(os.tmpdir(), `rfs-${name}-`));

const pathEnvKey = () => Object.keys(process.env).find(key => key.toLowerCase() === "path") ?? "PATH";

const runCli = (args, options = {}) =>
  spawnSync(process.execPath, [cliPath, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      ...options.env,
    },
  });

const assertSuccessful = result => {
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
};

const writeFakeNpx = binDir => {
  fs.mkdirSync(binDir, { recursive: true });

  if (process.platform === "win32") {
    fs.writeFileSync(
      path.join(binDir, "npx.cmd"),
      [
        "@echo off",
        "if defined npm_config_cache goto run",
        "if defined NPM_CONFIG_CACHE goto run",
        "echo missing npm cache env 1>&2",
        "exit /b 9",
        ":run",
        `"${process.execPath}" "${cliPath}" %3 "%~4"`,
        "",
      ].join("\r\n"),
    );
    return;
  }

  const npxPath = path.join(binDir, "npx");
  fs.writeFileSync(
    npxPath,
    [
      "#!/bin/sh",
      'if [ -z "$npm_config_cache" ] && [ -z "$NPM_CONFIG_CACHE" ]; then',
      '  echo "missing npm cache env" >&2',
      "  exit 9",
      "fi",
      `exec "${process.execPath}" "${cliPath}" "$3" "$4"`,
      "",
    ].join("\n"),
  );
  fs.chmodSync(npxPath, 0o755);
};

test("package exposes the next minor version", () => {
  const packageJson = readJson(packageJsonPath);

  assert.equal(packageJson.version, "0.7.2");
});

test("init --with-skill --with-hooks writes skill-first manifest and session hook files", () => {
  const targetRoot = makeTarget("init-hooks");
  const packageJson = readJson(packageJsonPath);

  const result = runCli(["init", targetRoot, "--with-skill", "--with-hooks"]);

  assertSuccessful(result);

  const manifest = readJson(path.join(targetRoot, ".react-frontend-standard", "manifest.json"));
  const managedPaths = manifest.managedFiles.map(file => file.path);

  assert.equal(manifest.package, "react-frontend-standard");
  assert.equal(manifest.version, packageJson.version);
  assert.equal(manifest.installSkill, "project");
  assert.equal(manifest.installHooks, true);
  assert.equal(manifest.installDocs, false);
  assert.ok(managedPaths.includes("AGENTS.md"));
  assert.ok(!managedPaths.includes("ARCHITECTURE.md"));
  assert.ok(!managedPaths.includes("docs/coding-patterns.md"));
  assert.ok(managedPaths.includes(".agents/skills/react-frontend-standard"));
  assert.ok(managedPaths.includes(".react-frontend-standard/hooks/session-start.mjs"));
  assert.ok(fs.existsSync(path.join(targetRoot, "AGENTS.md")));
  assert.ok(!fs.existsSync(path.join(targetRoot, "ARCHITECTURE.md")));
  assert.ok(!fs.existsSync(path.join(targetRoot, "docs", "coding-patterns.md")));
  assert.ok(fs.existsSync(path.join(targetRoot, ".codex", "hooks.json")));
  assert.ok(fs.existsSync(path.join(targetRoot, ".claude", "settings.json")));
  assert.ok(fs.existsSync(path.join(targetRoot, ".react-frontend-standard", "hooks", "session-start.mjs")));
});

test("init defaults to project skill without optional docs", () => {
  const targetRoot = makeTarget("init-default");
  const result = runCli(["init", targetRoot]);

  assertSuccessful(result);

  const manifest = readJson(path.join(targetRoot, ".react-frontend-standard", "manifest.json"));

  assert.equal(manifest.installSkill, "project");
  assert.equal(manifest.installDocs, false);
  assert.ok(fs.existsSync(path.join(targetRoot, ".agents", "skills", "react-frontend-standard", "SKILL.md")));
  assert.ok(!fs.existsSync(path.join(targetRoot, "ARCHITECTURE.md")));
  assert.ok(!fs.existsSync(path.join(targetRoot, "docs", "coding-patterns.md")));
});

test("init --with-docs writes optional architecture and coding documents", () => {
  const targetRoot = makeTarget("init-docs");
  const result = runCli(["init", targetRoot, "--with-skill", "--with-docs"]);

  assertSuccessful(result);

  const manifest = readJson(path.join(targetRoot, ".react-frontend-standard", "manifest.json"));
  const managedPaths = manifest.managedFiles.map(file => file.path);

  assert.equal(manifest.installDocs, true);
  assert.ok(managedPaths.includes("AGENTS.md"));
  assert.ok(managedPaths.includes("ARCHITECTURE.md"));
  assert.ok(managedPaths.includes("docs/coding-patterns.md"));
  assert.ok(fs.existsSync(path.join(targetRoot, "ARCHITECTURE.md")));
  assert.ok(fs.existsSync(path.join(targetRoot, "docs", "coding-patterns.md")));
});

test("init refreshes existing project skill while preserving existing project docs", () => {
  const targetRoot = makeTarget("init-existing");
  const agentsPath = path.join(targetRoot, "AGENTS.md");
  const skillPath = path.join(targetRoot, ".agents", "skills", "react-frontend-standard", "SKILL.md");

  fs.mkdirSync(path.dirname(skillPath), { recursive: true });
  fs.writeFileSync(agentsPath, "# Existing project guide\n");
  fs.writeFileSync(skillPath, "old skill\n");

  const result = runCli(["init", targetRoot, "--with-skill", "--with-hooks"]);

  assertSuccessful(result);
  assert.equal(fs.readFileSync(agentsPath, "utf8"), "# Existing project guide\n");
  assert.notEqual(fs.readFileSync(skillPath, "utf8"), "old skill\n");

  const manifest = readJson(path.join(targetRoot, ".react-frontend-standard", "manifest.json"));
  assert.equal(manifest.installSkill, "project");
  assert.equal(manifest.installDocs, false);
});

test("check reports outdated installed standard", () => {
  const targetRoot = makeTarget("check");
  const manifestDir = path.join(targetRoot, ".react-frontend-standard");

  fs.mkdirSync(manifestDir, { recursive: true });
  fs.writeFileSync(
    path.join(manifestDir, "manifest.json"),
    `${JSON.stringify(
      {
        package: "react-frontend-standard",
        version: "0.5.0",
        installSkill: "project",
        installHooks: true,
        installDocs: false,
        managedFiles: [],
      },
      null,
      2,
    )}\n`,
  );

  const result = runCli(["check", targetRoot], {
    env: {
      RFS_NPM_LATEST_VERSION: "0.7.2",
    },
  });

  assert.equal(result.status, 1, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /outdated: react-frontend-standard 0\.5\.0 -> 0\.7\.2/);
});

test("sync refreshes generated skill and preserves modified docs", () => {
  const targetRoot = makeTarget("sync");
  const packageJson = readJson(packageJsonPath);
  const initResult = runCli(["init", targetRoot, "--with-skill", "--with-hooks", "--with-docs"]);

  assertSuccessful(initResult);

  const agentsPath = path.join(targetRoot, "AGENTS.md");
  const skillPath = path.join(targetRoot, ".agents", "skills", "react-frontend-standard", "SKILL.md");
  const manifestPath = path.join(targetRoot, ".react-frontend-standard", "manifest.json");

  fs.writeFileSync(agentsPath, "# Local project instructions\n");
  fs.writeFileSync(skillPath, "old skill\n");

  const manifest = readJson(manifestPath);
  manifest.version = "0.5.0";
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const syncResult = runCli(["sync", targetRoot]);

  assertSuccessful(syncResult);
  assert.equal(fs.readFileSync(agentsPath, "utf8"), "# Local project instructions\n");
  assert.notEqual(fs.readFileSync(skillPath, "utf8"), "old skill\n");
  assert.match(syncResult.stdout, /skip modified: AGENTS\.md/);

  const syncedManifest = readJson(manifestPath);
  assert.equal(syncedManifest.version, packageJson.version);
});

test("generated session hook refreshes an outdated manifest through npx", () => {
  const targetRoot = makeTarget("hook-sync");
  const fakeBinDir = path.join(targetRoot, "fake-bin");
  const packageJson = readJson(packageJsonPath);
  const initResult = runCli(["init", targetRoot, "--with-skill", "--with-hooks"]);

  assertSuccessful(initResult);
  writeFakeNpx(fakeBinDir);

  const manifestPath = path.join(targetRoot, ".react-frontend-standard", "manifest.json");
  const manifest = readJson(manifestPath);
  manifest.version = "0.6.0";
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const env = { ...process.env };
  const key = pathEnvKey();
  env[key] = `${fakeBinDir}${path.delimiter}${env[key] ?? ""}`;

  const hookResult = spawnSync(
    process.execPath,
    [path.join(targetRoot, ".react-frontend-standard", "hooks", "session-start.mjs"), "--platform", "codex"],
    {
      cwd: targetRoot,
      encoding: "utf8",
      input: JSON.stringify({ cwd: targetRoot }),
      env,
    },
  );

  assertSuccessful(hookResult);

  const payload = JSON.parse(hookResult.stdout);
  assert.equal(payload.systemMessage, undefined);
  assert.match(payload.hookSpecificOutput.additionalContext, /synced: react-frontend-standard 0\.6\.0 ->/);

  const syncedManifest = readJson(manifestPath);
  assert.equal(syncedManifest.version, packageJson.version);
});

test("sync keeps optional docs absent when docs were not installed", () => {
  const targetRoot = makeTarget("sync-no-docs");
  const initResult = runCli(["init", targetRoot, "--with-skill", "--with-hooks"]);

  assertSuccessful(initResult);

  const manifestPath = path.join(targetRoot, ".react-frontend-standard", "manifest.json");
  const manifest = readJson(manifestPath);
  manifest.version = "0.5.0";
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const syncResult = runCli(["sync", targetRoot]);

  assertSuccessful(syncResult);
  assert.ok(!fs.existsSync(path.join(targetRoot, "ARCHITECTURE.md")));
  assert.ok(!fs.existsSync(path.join(targetRoot, "docs", "coding-patterns.md")));
});
