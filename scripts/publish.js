const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const PACKAGES = [
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

function log(message, type = "info") {
  const colors = {
    info: "\x1b[36m",
    success: "\x1b[32m",
    error: "\x1b[31m",
    warning: "\x1b[33m",
    reset: "\x1b[0m",
  };

  console.log(`${colors[type]}${message}${colors.reset}`);
}

function runCommand(command, cwd) {
  try {
    log(`Running: ${command}`, "info");
    execSync(command, { cwd, stdio: "inherit" });
    return true;
  } catch {
    log(`Failed to run: ${command}`, "error");
    return false;
  }
}

function getPackageVersion(pkgDir) {
  const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgDir, "package.json"), "utf8"));
  return pkgJson.version;
}

function checkDistExists(pkgDir) {
  const distPath = path.join(pkgDir, "dist");
  return fs.existsSync(distPath);
}

function publishPackage(pkg) {
  const pkgPath = path.join(process.cwd(), pkg.dir);
  const version = getPackageVersion(pkgPath);

  log(`\n📦 Publishing ${pkg.name}@${version}...`, "info");

  // Check if dist exists
  if (!checkDistExists(pkgPath)) {
    log(`Building ${pkg.name}...`, "info");
    if (!runCommand("npm run build", pkgPath)) {
      log(`Failed to build ${pkg.name}`, "error");
      return false;
    }
  }

  // Publish to npm
  if (!runCommand("npm publish --access public", pkgPath)) {
    log(`Failed to publish ${pkg.name}`, "error");
    return false;
  }

  log(`✅ Successfully published ${pkg.name}@${version}`, "success");
  return true;
}

async function main() {
  log("\n🚀 Starting publication process...\n", "info");

  // Check if logged in to npm
  try {
    execSync("npm whoami", { stdio: "pipe" });
  } catch {
    log("❌ You are not logged in to npm. Please run 'npm login' first.", "error");
    process.exit(1);
  }

  // Sort packages by order
  const sortedPackages = PACKAGES.sort((a, b) => a.order - b.order);

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

  // Summary
  log("\n📊 Publication Summary", "info");
  log(`✅ Published: ${publishedCount}`, "success");
  if (failedCount > 0) {
    log(`❌ Failed: ${failedCount}`, "error");
    process.exit(1);
  } else {
    log(`\n🎉 All packages published successfully!`, "success");
  }
}

main().catch((error) => {
  log(`Fatal error: ${error.message}`, "error");
  process.exit(1);
});
