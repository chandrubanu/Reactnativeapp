#!/usr/bin/env node
/**
 * build-web.js — cross-platform build script
 *
 * Usage:
 *   node scripts/build-web.js github     → baseUrl=/Reactnativeapp  → dist/
 *   node scripts/build-web.js domain     → baseUrl=/attendanceui    → dist-domain/
 *   node scripts/build-web.js root       → baseUrl=                 → dist-domain/
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const target = process.argv[2] || 'github';

const configs = {
  // GitHub Pages: https://chandrubanu.github.io/Reactnativeapp/
  github: {
    baseUrl: '/Reactnativeapp',
    outDir: 'dist',
    cname: null,
  },
  // Sub-path on custom server: https://app.footpro.in/attendanceui/
  domain: {
    baseUrl: '/attendanceui',
    outDir: 'dist-domain',
    cname: 'admin.attendanceui.com',
  },
  // True root domain: https://admin.attendanceui.com/
  root: {
    baseUrl: '',
    outDir: 'dist-domain',
    cname: 'admin.attendanceui.com',
  },
};

const cfg = configs[target];
if (!cfg) {
  console.error(`Unknown target "${target}". Use: github | domain | root`);
  process.exit(1);
}

console.log(`\n🔨  Building for target: ${target}`);
console.log(`    baseUrl  : "${cfg.baseUrl}"`);
console.log(`    output   : ${cfg.outDir}/\n`);

// Set env var for app.config.js to read
process.env.BASE_URL = cfg.baseUrl;

// Run expo export
execSync(
  `npx expo export -p web --output-dir ${cfg.outDir} --clear`,
  {
    stdio: 'inherit',
    env: { ...process.env, BASE_URL: cfg.baseUrl },
  }
);

// Write CNAME if needed
if (cfg.cname) {
  const cnamePath = path.join(cfg.outDir, 'CNAME');
  fs.writeFileSync(cnamePath, cfg.cname);
  console.log(`\n✅  CNAME written: ${cfg.cname}`);
}

console.log(`\n✅  Build complete → ${cfg.outDir}/`);
console.log('    Upload the contents of this folder to your web server root.\n');

