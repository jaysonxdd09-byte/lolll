const fs = require('fs');
let content = fs.readFileSync('src/components/ebuddha/EbuddhaApp.tsx', 'utf8');

// Remove react-router-dom import
content = content.replace(/import \{.*?\} from 'react-router-dom';\r?\n?/g, '');

// Replace Link with a
content = content.replace(/<Link/g, '<a');
content = content.replace(/<\/Link>/g, '</a>');

// Replace to= with href=
content = content.replace(/\bto=/g, 'href=');

// Fix useLocation
content = content.replace(/const location = useLocation\(\);/g, 'const location = { pathname: "" };');

fs.writeFileSync('src/components/ebuddha/EbuddhaApp.tsx', content);
