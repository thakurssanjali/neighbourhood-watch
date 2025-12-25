#!/usr/bin/env node
/**
 * Build script for Vercel deployment
 * This handles installing dependencies and building the client
 */

const { execSync } = require('child_process');
const path = require('path');

function run(command, cwd = process.cwd()) {
  console.log(`\n📦 Running: ${command}`);
  console.log(`📂 In directory: ${cwd}\n`);
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit'
    });
    console.log(`✅ Command succeeded\n`);
  } catch (error) {
    console.error(`❌ Command failed with exit code ${error.status}`);
    process.exit(error.status || 1);
  }
}

async function build() {
  const rootDir = __dirname;
  const clientDir = path.join(rootDir, 'client');
  const serverDir = path.join(rootDir, 'server');

  try {
    console.log('🚀 Starting Vercel build process...\n');

    // Step 1: Install root dependencies
    console.log('Step 1: Installing root dependencies...');
    run('npm install', rootDir);

    // Step 2: Install client dependencies
    console.log('Step 2: Installing client dependencies...');
    run('npm install', clientDir);

    // Step 3: Build client
    console.log('Step 3: Building client...');
    run('npm run build', clientDir);

    // Step 4: Install server dependencies
    console.log('Step 4: Installing server dependencies...');
    run('npm install', serverDir);

    console.log('\n✅ Build completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

build();
