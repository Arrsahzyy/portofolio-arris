const fs = require('fs');
const path = require('path');

// Function to copy directory recursively
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        // Skip node_modules, .git, and public folder itself
        if (entry.name === 'node_modules' || 
            entry.name === '.git' || 
            entry.name === 'public' ||
            entry.name === '.vercel' ||
            entry.name.startsWith('.')) {
            continue;
        }
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Copy all files to public directory
console.log('Building for Vercel deployment...');
copyDir('.', './public');
console.log('✅ Build completed - files copied to public directory');
