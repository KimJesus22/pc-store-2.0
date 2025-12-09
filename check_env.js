const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');

try {
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        lines.forEach(line => {
            if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
                const val = line.split('=')[1].trim();
                console.log(`URL Protocol: ${val.split('://')[0]}`);
                console.log(`URL Valid Format: ${val.startsWith('http')}`);
            }
        });

    }
} catch (e) {
    console.error(e);
}
