import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

type LogType = "error" | "info" | "success" | "warning";

type PackageToPublish = {
  dir: string;
  name: string;
  order: number;
};

const PACKAGES: PackageToPublish[] = [
  {
    name: "@markup-canvas/core",
    dir: "packages/core",
    order: 1,
  },
  {
    name: "@markup-canvas/react",
    dir: "packages/react",
    order: 2,
  },
];

function log(message: string, type: LogType = "info") {
  const colors: Record<LogType, string> & { reset: string } = {
    error: "\x1b[31m",
    info: "\x1b[36m",
    reset: "\x1b[0m",
    success: "\x1b[32m",
    warning: "\x1b[33m",
  };

  console.log(`${colors[type]}${message}${colors.reset}`);
}

function runCommand(command: string, cwd: string): boolean {
  try {
    log(`Running: ${command}`, "info");
    execSync(command, { cwd, stdio: "inherit" });
    return true;
  } catch {
    log(`Failed to run: ${command}`, "error");
    return false;
  }
}

function getPackageVersion(pkgDir: string): string {
  const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgDir, "package.json"), "utf8")) as { version: string };
  return pkgJson.version;
}

function checkDistExists(pkgDir: string): boolean {
  const distPath = path.join(pkgDir, "dist");
  return fs.existsSync(distPath);
}

function publishPackage(pkg: PackageToPublish): boolean {
  const pkgPath = path.join(process.cwd(), pkg.dir);
  const version = getPackageVersion(pkgPath);

  log(`\n📦 Publishing ${pkg.name}@${version}...`, "info");

  if (!checkDistExists(pkgPath)) {
    log(`Building ${pkg.name}...`, "info");
    if (!runCommand("npm run build", pkgPath)) {
      log(`Failed to build ${pkg.name}`, "error");
      return false;
    }
  }

  if (!runCommand("npm publish --access public", pkgPath)) {
    log(`Failed to publish ${pkg.name}`, "error");
    return false;
  }

  log(`✅ Successfully published ${pkg.name}@${version}`, "success");
  return true;
}

async function main(): Promise<void> {
  log("\n🚀 Starting publication process...\n", "info");

  try {
    execSync("npm whoami", { stdio: "pipe" });
  } catch {
    log("❌ You are not logged in to npm. Please run 'npm login' first.", "error");
    process.exit(1);
  }

  const sortedPackages = [...PACKAGES].sort((a, b) => a.order - b.order);

  let publishedCount = 0;
  let failedCount = 0;

  for (const pkg of sortedPackages) {
    if (publishPackage(pkg)) {
      publishedCount++;
    } else {
      failedCount++;
      log(`⚠️  Publication process stopped due to failure at ${pkg.name}`, "warning");
      break;
    }
  }

  log("\n📊 Publication Summary", "info");
  log(`✅ Published: ${publishedCount}`, "success");
  if (failedCount > 0) {
    log(`❌ Failed: ${failedCount}`, "error");
    process.exit(1);
  } else {
    log(`\n🎉 All packages published successfully!`, "success");
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  log(`Fatal error: ${message}`, "error");
  process.exit(1);
});
