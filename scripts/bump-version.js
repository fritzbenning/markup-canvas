const fs = require("node:fs");
const path = require("node:path");

function incrementVersion(version, type) {
  const [major, minor, patch] = version.split(".").map(Number);

  switch (type) {
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "major":
      return `${major + 1}.0.0`;
    default:
      throw new Error(`Invalid version type: ${type}. Use 'patch', 'minor', or 'major'`);
  }
}

function updatePackageJson(filePath, newVersion) {
  const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
  content.version = newVersion;
  fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`);
}

const versionType = process.argv[2] || "patch";

// Update root package.json
const rootPkgPath = path.join(__dirname, "../package.json");
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf8"));
const currentVersion = rootPkg.version;
const newVersion = incrementVersion(currentVersion, versionType);

console.log(`📦 Bumping version: ${currentVersion} → ${newVersion} (${versionType})\n`);

updatePackageJson(rootPkgPath, newVersion);
console.log(`✅ Root package.json updated to ${newVersion}`);

// Update all workspace packages
const packagesDir = path.join(__dirname, "../packages");
fs.readdirSync(packagesDir).forEach((pkg) => {
  const pkgJsonPath = path.join(packagesDir, pkg, "package.json");
  if (fs.existsSync(pkgJsonPath)) {
    updatePackageJson(pkgJsonPath, newVersion);
    console.log(`✅ packages/${pkg}/package.json updated to ${newVersion}`);
  }
});

console.log(`\n✨ All packages updated to version ${newVersion}`);
