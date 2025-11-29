// scripts/copy-prisma-engines.ts
import fs from 'fs';
import path from 'path';

const engineNamePrefix = 'libquery_engine';
const srcDir = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
const destDirCandidates = [
  path.join(process.cwd(), '.next', 'server', 'chunks'),
  path.join(process.cwd(), 'src', 'generated', 'prisma'),
  path.join(process.cwd(), 'node_modules', '.prisma', 'client'),
];

function findEngine(): string | null {
  if (!fs.existsSync(srcDir)) return null;
  const files = fs.readdirSync(srcDir);
  const match = files.find(f => f.startsWith(engineNamePrefix) && f.endsWith('.so.node'));
  return match ? path.join(srcDir, match) : null;
}

function copyFile(src: string, dest: string) {
  if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`Copied Prisma engine: ${src} -> ${dest}`);
}

function run() {
  const enginePath = findEngine();
  if (!enginePath) {
    console.warn('[copy-prisma-engines] Prisma engine not found at', srcDir);
    return;
  }

  for (const dest of destDirCandidates) {
    try {
      const destPath = path.join(dest, path.basename(enginePath));
      copyFile(enginePath, destPath);
    } catch (err) {
      // continue trying other destinations
    }
  }
}

run();
