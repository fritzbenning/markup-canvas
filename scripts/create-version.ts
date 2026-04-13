import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type VersionBump = "major" | "minor" | "patch";

function incrementVersion(version: string, type: VersionBump): string {
  const [major, minor, patch] = version.split(".").map(Number);

  switch (type) {
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "major":
      return `${major + 1}.0.0`;
  }
}

function parseVersionType(value: string | undefined): VersionBump {
  const v = value ?? "patch";
  if (v === "patch" || v === "minor" || v === "major") {
    return v;
  }
  throw new Error(`Invalid version type: ${value}. Use 'patch', 'minor', or 'major'`);
}

function updatePackageJson(filePath: string, newVersion: string): void {
  const content = JSON.parse(fs.readFileSync(filePath, "utf8")) as { version: string };
  content.version = newVersion;
  fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`);
}

const versionType = parseVersionType(process.argv[2]);

// Update root package.json
const rootPkgPath = path.join(__dirname, "../package.json");
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf8")) as { version: string };
const currentVersion = rootPkg.version;
const newVersion = incrementVersion(currentVersion, versionType);

console.log(`📦 Creating version: ${currentVersion} → ${newVersion} (${versionType})\n`);

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
