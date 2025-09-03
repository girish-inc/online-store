// Build script for Vercel deployment
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Execute command and log output
function execute(command, cwd) {
  log(`Executing: ${command}`);
  try {
    execSync(command, { 
      cwd: cwd || process.cwd(),
      stdio: 'inherit'
    });
    return true;
  } catch (error) {
    log(`Error executing ${command}: ${error.message}`);
    return false;
  }
}

// Main build function
async function build() {
  log('Starting build process...');

  // Install dependencies in root directory
  log('Installing root dependencies...');
  execute('npm install');

  // Install backend dependencies
  log('Installing backend dependencies...');
  execute('npm install', path.join(process.cwd(), 'backend'));

  // Install frontend dependencies
  log('Installing frontend dependencies...');
  execute('npm install', path.join(process.cwd(), 'frontend'));

  // Build frontend
  log('Building frontend...');
  execute('npm run build', path.join(process.cwd(), 'frontend'));

  log('Build process completed successfully!');
}

// Run build
build().catch(error => {
  log(`Build failed: ${error.message}`);
  process.exit(1);
});