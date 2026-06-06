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

test("package exposes the next minor version", () => {
  const packageJson = readJson(packageJsonPath);

  assert.equal(packageJson.version, "0.5.0");
});

test("init --with-skill --with-hooks writes manifest and session hook files", () => {
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
  assert.ok(managedPaths.includes("AGENTS.md"));
  assert.ok(managedPaths.includes("ARCHITECTURE.md"));
  assert.ok(managedPaths.includes("docs/coding-patterns.md"));
  assert.ok(managedPaths.includes(".agents/skills/react-frontend-standard"));
  assert.ok(managedPaths.includes(".react-frontend-standard/hooks/session-start.mjs"));
  assert.ok(fs.existsSync(path.join(targetRoot, ".codex", "hooks.json")));
  assert.ok(fs.existsSync(path.join(targetRoot, ".claude", "settings.json")));
  assert.ok(fs.existsSync(path.join(targetRoot, ".react-frontend-standard", "hooks", "session-start.mjs")));
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
        version: "0.4.0",
        installSkill: "project",
        installHooks: true,
        managedFiles: [],
      },
      null,
      2,
    )}\n`,
  );

  const result = runCli(["check", targetRoot], {
    env: {
      RFS_NPM_LATEST_VERSION: "0.5.0",
    },
  });

  assert.equal(result.status, 1, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /outdated: react-frontend-standard 0\.4\.0 -> 0\.5\.0/);
});

test("sync refreshes generated skill and preserves modified docs", () => {
  const targetRoot = makeTarget("sync");
  const packageJson = readJson(packageJsonPath);
  const initResult = runCli(["init", targetRoot, "--with-skill", "--with-hooks"]);

  assertSuccessful(initResult);

  const agentsPath = path.join(targetRoot, "AGENTS.md");
  const skillPath = path.join(targetRoot, ".agents", "skills", "react-frontend-standard", "SKILL.md");
  const manifestPath = path.join(targetRoot, ".react-frontend-standard", "manifest.json");

  fs.writeFileSync(agentsPath, "# Local project instructions\n");
  fs.writeFileSync(skillPath, "old skill\n");

  const manifest = readJson(manifestPath);
  manifest.version = "0.4.0";
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const syncResult = runCli(["sync", targetRoot]);

  assertSuccessful(syncResult);
  assert.equal(fs.readFileSync(agentsPath, "utf8"), "# Local project instructions\n");
  assert.notEqual(fs.readFileSync(skillPath, "utf8"), "old skill\n");
  assert.match(syncResult.stdout, /skip modified: AGENTS\.md/);

  const syncedManifest = readJson(manifestPath);
  assert.equal(syncedManifest.version, packageJson.version);
});
