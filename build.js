const fs = require('fs');
const path = require('path');

const srcDir = './src';
const distDir = './dist';

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function processFile(srcPath, distPath) {
  let code = fs.readFileSync(srcPath, 'utf8');

  // Remove require statements
  code = code.replace(/^\s*const\s+\{[^}]+\}\s*=\s*require\([^)]+\);\s*\n?/gm, '');

  // Remove module.exports lines
  code = code.replace(/^\s*module\.exports\s*=\s*\{[^}]+\};?\s*\n?/gm, '');

  fs.writeFileSync(distPath, code, 'utf8');
  console.log(`Processed: ${srcPath} → ${distPath}`);
}

function processDirectory(src, dist) {
  ensureDirExists(dist);

  fs.readdirSync(src).forEach(item => {
    const srcPath = path.join(src, item);
    const distPath = path.join(dist, item);

    if (fs.statSync(srcPath).isDirectory()) {
      processDirectory(srcPath, distPath);
    } else if (item.endsWith('.js')) {
      processFile(srcPath, distPath);
    }
  });
}

// Start clean
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}

processDirectory(srcDir, distDir);
