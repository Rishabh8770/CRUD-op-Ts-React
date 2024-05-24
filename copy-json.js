import { existsSync, mkdirSync, readdirSync, copyFileSync } from 'fs';
import { join } from 'path';

const sourceDir = 'server';
const targetDir = 'dist/server';

// Ensure the target directory exists
if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
}

// Copy JSON files
readdirSync(sourceDir).forEach(file => {
    if (file.endsWith('.json')) {
        copyFileSync(join(sourceDir, file), join(targetDir, file));
    }
});
